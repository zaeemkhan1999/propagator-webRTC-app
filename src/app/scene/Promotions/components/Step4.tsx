import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import { CreatePostAdVariables } from "../mutations/createAdPost";
import { useGetDiscounts } from "../queries/getDiscountCodes";
import { IconX } from "@tabler/icons-react";
import { enqueueSnackbar } from "notistack";

type Props = {
    adPostInput: CreatePostAdVariables;
    setAdPostInput: Dispatch<SetStateAction<CreatePostAdVariables>>;
}

const StepFour = memo(({ adPostInput, setAdPostInput }: Props) => {
    const [code, setCode] = useState("");

    const handleIncrement = () => {
        setAdPostInput(prev => ({ ...prev, numberOfPeopleCanSee: prev.numberOfPeopleCanSee + 1500 }));
    };

    const handleDecrement = () => {
        if (adPostInput.numberOfPeopleCanSee > 1500) {
            setAdPostInput(prev => ({ ...prev, numberOfPeopleCanSee: prev.numberOfPeopleCanSee - 1500 }));
        }
    };

    const { data, isLoading, isFetching, refetch } = useGetDiscounts({ code });

    const handleSearchDiscount = () => {
        code.length && !isLoading && !isFetching && refetch();
    }

    useEffect(() => {
        data?.pages?.forEach(page => {
            if (page.discount_getDiscountes.result.items.length) {
                const discountCode = page.discount_getDiscountes.result.items[0]?.discountCode;
                setAdPostInput(prev => ({ ...prev, discountCode }));
                setCode('');
            } else {
                enqueueSnackbar("No such Discount Found!", { autoHideDuration: 3000, variant: "error" });
            }
        })
    }, [data?.pages]);

    return (<>
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
            <h2 className="text-lg font-medium text-gray-800 mb-4">How many people can see this?</h2>

            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={adPostInput.numberOfPeopleCanSee <= 1500}
                    className={`w-8 h-8 flex justify-center items-center border rounded-full ${adPostInput.numberOfPeopleCanSee <= 1500 ? "border-gray-300 text-gray-300 cursor-not-allowed" : "border-gray-500 text-gray-700"
                        }`}
                >
                    −
                </button>

                <input
                    type="text"
                    value={adPostInput.numberOfPeopleCanSee}
                    disabled
                    className="w-20 text-center bg-gray-100 border rounded-md border-gray-300 text-gray-800 font-medium"
                />

                <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-8 h-8 flex justify-center items-center border border-gray-500 rounded-full text-gray-700"
                >
                    +
                </button>
            </div>

            <p className="text-sm text-gray-600 mt-4 text-center">
                Your request will be processed and approved immediately, and your ad will be published after payment. If we find
                your ad in violation of our terms of service, we reserve the right to remove it.
            </p>

            <p className="text-lg font-semibold text-gray-800 mt-6">
                Price: <span className="text-green-600">CAD ${((adPostInput.numberOfPeopleCanSee / 1500) * 5).toFixed(2)}</span> for {adPostInput.numberOfPeopleCanSee} views
            </p>
        </div>

        <div className="mt-5 flex flex-col items-center p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Have a Discount Code? Enter below!</h2>

            {!adPostInput.discountCode
                ? <><input
                    type="text"
                    placeholder="Discount Code"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full p-3 bg-gray-100 border rounded-md border-gray-300 font-medium"
                />

                    <button
                        disabled={isLoading || !code.length}
                        onClick={handleSearchDiscount}
                        className={`mt-5 px-4 w-full py-2 bg-red-800 text-white rounded hover:bg-red-500 `}
                    >
                        {(isLoading || isFetching) ? "Loading..." : "Apply"}
                    </button></>
                : <div className="relative">
                    <p className="mt-5 text-md bg-green-400 text-white p-3 rounded-lg">Applied: {adPostInput.discountCode} 🎉</p>
                    <IconX
                        onClick={() => setAdPostInput(prev => ({ ...prev, discountCode: "" }))}
                        size={15}
                        className="absolute top-5 right-0 cursor-pointer bg-red-800 hover:bg-red-500 text-white rounded-lg" />
                </div>}
        </div>
    </>);
});

export default StepFour;
