import { Dispatch, memo, SetStateAction } from "react";
import { GenderTypes } from "./RequestAds";
import { CreatePostAdVariables } from "../mutations/createAdPost";

type Props = {
    adPostInput: CreatePostAdVariables;
    setAdPostInput: Dispatch<SetStateAction<CreatePostAdVariables>>;
}

const StepTwo = memo(({ adPostInput, setAdPostInput }: Props) => {

    return (
        <div className="p-4 space-y-6 bg-gray-50 rounded-md">
            {/* Automate / Manual Radio */}
            <div className="flex justify-start space-x-6">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        value={"AUTOMATE"}
                        checked={adPostInput.manualStatus === "AUTOMATE"}
                        onChange={() => setAdPostInput({ ...adPostInput, manualStatus: "AUTOMATE" })}
                        className="w-4 h-4 text-gray-700 focus:ring-gray-500"
                    />
                    <span className="text-gray-700 font-medium">Automate</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        value={"MANUAL"}
                        checked={adPostInput.manualStatus === "MANUAL"}
                        onChange={() => setAdPostInput({ ...adPostInput, manualStatus: "MANUAL" })}
                        className="w-4 h-4 text-gray-700 focus:ring-gray-500"
                    />
                    <span className="text-gray-700 font-medium">Manual</span>
                </label>
            </div>

            {adPostInput.manualStatus === "MANUAL" && <>
                {/* Select Location */}
                <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                        Select Location
                    </label>
                    <input
                        type="text"
                        placeholder="India"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                        value={adPostInput.targetLocation}
                        onChange={e => setAdPostInput({ ...adPostInput, targetLocation: e.target.value })}
                    />
                </div>

                {/* Select Age Group */}
                <div>
                    <label className="block mb-2 text-gray-700 font-bold">
                        Select Age Group -
                    </label>
                    <div className="flex justify-between flex-col gap-3">
                        <div className=" gap-3">
                            <label className="block mb-2 text-gray-700 font-medium">
                                Start Age
                            </label>
                            <input
                                type="number"
                                min={18}
                                placeholder="18"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                                value={adPostInput.targetStartAge}
                                onChange={e => setAdPostInput({ ...adPostInput, targetStartAge: Number(e.target.value) })}
                            />
                        </div>
                        <div className=" gap-3">
                            <label className="block mb-2 text-gray-700 font-medium">
                                End Age
                            </label>
                            <input
                                type="number"
                                min={30}
                                placeholder="30"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                                value={adPostInput.targetEndAge}
                                onChange={e => setAdPostInput({ ...adPostInput, targetEndAge: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                {/* Select Gender */}
                <div>
                    <label className="block mb-4 text-gray-700 font-bold">
                        Select Gender
                    </label>
                    <div className="flex">
                        <label className="flex items-center mr-3 space-x-1">
                            <input
                                type="radio"
                                checked={adPostInput.targetGenders === "MALE"}
                                value="MALE"
                                onChange={e => setAdPostInput({ ...adPostInput, targetGenders: e.target.value as GenderTypes })}
                                className="w-5 h-5 text-gray-700 focus:ring-gray-500"
                            />
                            <span className="text-gray-700 font-medium">Male</span>
                        </label>
                        <label className="flex items-center mr-3 space-x-1">
                            <input
                                type="radio"
                                value="FEMALE"
                                checked={adPostInput.targetGenders === "FEMALE"}
                                onChange={e => setAdPostInput({ ...adPostInput, targetGenders: e.target.value as GenderTypes })}
                                className="w-5 h-5 text-gray-700 focus:ring-gray-500"
                            />
                            <span className="text-gray-700 font-medium">Female</span>
                        </label>
                        <label className="flex items-center mr-3 space-x-1">
                            <input
                                type="radio"
                                checked={adPostInput.targetGenders === "RATHER_NOT_SAY"}
                                value="RATHER_NOT_SAY"
                                onChange={e => setAdPostInput({ ...adPostInput, targetGenders: e.target.value as GenderTypes })}
                                className="w-5 h-5 text-gray-700 focus:ring-gray-500"
                            />
                            <span className="text-gray-700 font-medium">Other</span>
                        </label>
                    </div>
                </div>
            </>}
        </div>
    );
});

export default StepTwo;