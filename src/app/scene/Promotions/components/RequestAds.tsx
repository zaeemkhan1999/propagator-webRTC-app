import { useState } from "react";
import StepTwo from "./Step2";
import StepFour from "./Step4";
import CreatePostPage from "../../Create/components/Createpost";
import { CreatePostAdVariables, useCreatePostAd } from "../mutations/createAdPost";
import { CircularProgress } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { PromotePostVariables, usePromotePost } from "../mutations/promotePost";
import { Elements } from "@stripe/react-stripe-js";
import Payment from "@/components/Stripe/Payment";

enum PromotionTarget {
    WEBSITE_VISIT = "WEBSITE_VISIT", USER_PROFILE_VISIT = "USER_PROFILE_VISIT"
}

export type GenderTypes = "MALE" | "FEMALE" | "RATHER_NOT_SAY"

export default function RequestAds({ isPostAlreadyCreated, postId }: { isPostAlreadyCreated?: boolean, postId?: number }) {
    const [pId, setPId] = useState<string | null>("");
    const tabs = ["1", "2", "3", ...((isPostAlreadyCreated && postId) ? [] : ["4"])];

    const [activeTab, setActiveTab] = useState(0);
    const [adPostInput, setAdPostInput] = useState<CreatePostAdVariables>({
        visitType: PromotionTarget.WEBSITE_VISIT,
        manualStatus: "MANUAL",
        targetStartAge: 0,
        targetEndAge: 0,
        targetGenders: "MALE",
        targetLocation: "",
        postItems: [],
        yourMind: "",
        allowDownload: false,
        iconLayoutType: "VERTICAL",
        location: "",
        tags: [],
        isWithOutPayment: false,
        numberOfPeopleCanSee: 1500,
        discountCode: "",
    });

    const handleCreatePost = (data: any) => {
        const { allowDownload, postItems, yourMind, iconLayoutType, tags, location } = data || {};

        setAdPostInput(prev => ({
            ...prev,
            allowDownload: allowDownload ?? false,
            postItems: postItems?.length ? postItems : [],
            yourMind: yourMind || "",
            iconLayoutType: iconLayoutType || "VERTICAL",
            location: location || "",
            tags: tags?.length ? tags : [],
        }));
    };

    const { createPostAd, loading: creatingAd } = useCreatePostAd();
    const { promotePost, loading: promotingPost } = usePromotePost();

    const handleCreateAd = () => {
        (isPostAlreadyCreated && postId)
            ? promotePost(getPromotePostVars(), (id) => setPId(id || null))
            : createPostAd(adPostInput, (id) => setPId(id || null));
    }

    const getPromotePostVars = () => {
        const { yourMind, postItems, tags, location, iconLayoutType, allowDownload, ...rest } = adPostInput;
        return { ...rest, postId } as PromotePostVariables;
    }

    return (
        <div className="h-screen">
            {!pId ? (<>
                <div className="flex justify-center gap-4 pt-6 px-4">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`py-2 px-6 rounded-full h-14 w-14 flex items-center justify-centertransition-opacity ${activeTab === index
                                ? "opacity-100 shadow-sm bg-red-200 text-red-500 font-semibold"
                                : "opacity-70 bg-gray-200 text-gray-500 hover:text-red-500"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6 px-6 h-[60dvh] pb-10 overflow-y-auto ">
                    {activeTab === 0 && (
                        <div>
                            <h2 className="text-sm font-semibold mb-4">Select your Promotion Target</h2>
                            <div className="space-y-4">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="promotionTarget"
                                        value={PromotionTarget.WEBSITE_VISIT}
                                        checked={adPostInput.visitType === PromotionTarget.WEBSITE_VISIT}
                                        onChange={() => setAdPostInput({ ...adPostInput, visitType: PromotionTarget.WEBSITE_VISIT })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <h3 className="font-semibold">Website Promotion</h3>
                                        <p className="text-sm text-gray-600">
                                            Users can promote their website by sharing a link that is displayed above the caption, allowing others to visit their site directly.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="promotionTarget"
                                        value={PromotionTarget.USER_PROFILE_VISIT}
                                        checked={adPostInput.visitType === PromotionTarget.USER_PROFILE_VISIT}
                                        onChange={() => setAdPostInput({ ...adPostInput, visitType: PromotionTarget.USER_PROFILE_VISIT })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <h3 className="font-semibold">User Profile Promotion</h3>
                                        <p className="text-sm text-gray-600">
                                            Users can promote their SPECTER profile, making it easier for others to view and follow them on the platform.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 1 && (
                        <StepTwo setAdPostInput={setAdPostInput} adPostInput={adPostInput} />
                    )}

                    {activeTab === 2 && (
                        (isPostAlreadyCreated && postId)
                            ? <StepFour adPostInput={adPostInput} setAdPostInput={setAdPostInput} />
                            : <CreatePostPage isCreatingAd handleCreatePost={handleCreatePost} />
                    )}

                    {activeTab === 3 && (
                        <StepFour adPostInput={adPostInput} setAdPostInput={setAdPostInput} />
                    )}
                </div>

                <div className="flex justify-between mt-6 px-6 gap-4">
                    <button
                        disabled={activeTab === 0}
                        onClick={() => setActiveTab(activeTab - 1)}
                        className={`px-4 w-full py-2 bg-gray-300 rounded hover:bg-gray-400 ${activeTab === 0 && "opacity-50 cursor-not-allowed"}`}
                    >
                        Back
                    </button>
                    <button
                        disabled={creatingAd || promotingPost}
                        onClick={() => activeTab === ((isPostAlreadyCreated && postId) ? 2 : 3) ? handleCreateAd() : setActiveTab(activeTab + 1)}
                        className={`px-4 w-full py-2 bg-red-800 text-white rounded hover:bg-red-500 `}
                    >
                        {(creatingAd || promotingPost) ? <><CircularProgress size={15} className="text-white" /> Creating...</> : (activeTab === ((isPostAlreadyCreated && postId) ? 2 : 3) ? "Proceed" : "Next")}
                    </button>
                </div></>)
                : pId
                    ? (<Elements stripe={loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)}>
                        <Payment paymentIntentId={pId} setPaymentIntentId={setPId} />
                    </Elements>)
                    : null}
        </div>
    );
};
