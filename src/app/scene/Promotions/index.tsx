import React, { lazy, useEffect, useState } from "react";
import { Tabs, Tab, Radio, FormControlLabel, FormGroup, Typography, CircularProgress } from "@mui/material";
import Header from "@/components/Header";
import { Goback } from "@/utils/helper/Goback";
import { IconCircleCheck, IconClockPause, IconFilter } from "@tabler/icons-react";
import { AdsStatus, useGetAds } from "./queries/getAds";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import Lottie from "lottie-react";
import NoData from "@/app/utility/Nodata.json";
import { generalDateFormat } from "@/app/utility/misc.helpers";
import { useLocation, useNavigate } from "react-router";

const RequestAds = lazy(() => import("./components/RequestAds"));
const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));

const Promotions = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const { props }: { props?: { postId?: number, isPromote?: boolean } } = state || {};

    const user = useSnapshot(userStore.store).user;
    const handleGoBack = Goback();
    const queryParams = new URLSearchParams(window.location.search);

    const [activeTab, setActiveTab] = useState(queryParams.get("tab") === "All" ? 1 : 0);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilters] = useState<AdsStatus | "All">("All");

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const { data: adsData, isLoading: loadingAds, refetch: getAds } = useGetAds({
        userId: user?.id!,
        ...(activeFilter !== "All" && { adsDtoStatus: activeFilter })
    });

    useEffect(() => {
        activeTab === 1 && getAds();
    }, [activeTab, activeFilter]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActiveFilters(event.target.value as AdsStatus | "All");
        setShowFilters(false);
    };

    const getStatusColor = (status: AdsStatus): string => {
        switch (status) {
            case AdsStatus.ACTIVE:
                return "text-green-500";
            case AdsStatus.COMPLETE:
                return "text-blue-500";
            case AdsStatus.REJECTED:
                return "text-red-500";
            case AdsStatus.SUSPENDED:
                return "text-yellow-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="h-screen bg-white">
            <Header
                text="Promotions"
                textColor="black"
                handleBack={handleGoBack}
            />

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                className="border-b"
                TabIndicatorProps={{ style: { backgroundColor: '#3b82f6' } }}
            >
                <Tab label="Request New" className="capitalize text-gray-600" />
                <Tab label={activeFilter} className="capitalize text-gray-600" />
            </Tabs>

            <div className="p-2 h-full overflow-y-auto pb-10">
                {activeTab === 0 &&
                    <RequestAds
                        postId={props?.postId}
                        isPostAlreadyCreated={(props?.isPromote && !!props?.postId) ? true : false} />}

                {activeTab === 1 && (
                    <div className="space-y-2">
                        <IconFilter
                            title="Filter"
                            className="cursor-pointer"
                            onClick={() => setShowFilters(true)}
                        />

                        {loadingAds
                            ? <div className='text-center'><CircularProgress /></div>
                            : adsData?.pages.flatMap(page => (
                                page.ads_getAdses.result.items.length
                                    ? page.ads_getAdses.result.items.map(p => (
                                        <div
                                            key={p.ads.id}
                                            className="flex items-start justify-between p-4 border rounded-lg shadow-md cursor-pointer"
                                            title={p.ads.ticketNumber || "Nil"}
                                            onClick={() => (p.ads.ticketNumber && p.ads.postId) && navigate(`/specter/view/post/${p.ads.postId}`)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs font-semibold">
                                                        Status: <span className={`${getStatusColor(p.adsDtoStatus as AdsStatus)} text-[11px]`}>{p.adsDtoStatus}</span>
                                                    </div>
                                                    <div className="text-xs font-semibold">
                                                        Ticket number: <span className="font-normal">{p.ads.ticketNumber || "Nil"}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{generalDateFormat(p.ads.createdDate)}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-semibold flex gap-1 items-center">
                                                Payment: <span className={`flex gap-1 items-center ${p.ads.isCompletedPayment ? "text-green-700" : "text-amber-400"}`}>{p.ads.isCompletedPayment ? <>Completed <IconCircleCheck size={18} /></> : <>Pending <IconClockPause className="text-yellow-300" size={18} /></>}</span>
                                            </div>
                                        </div>
                                    ))
                                    : <>
                                        <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                                        <Typography className='text-md text-center italic'>
                                            No {activeFilter !== "All" && activeFilter} Promotion(s) found{activeFilter === "All" ? ", Please Request a New!" : "!"}
                                        </Typography>
                                    </>
                            ))}
                    </div>)}

                <BottomSheet isOpen={showFilters} onClose={() => setShowFilters(false)}>
                    <div className="p-3">
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={activeFilter === "All"}
                                        onChange={handleFilterChange}
                                        value="All"
                                    />
                                }
                                label="All"
                            />
                            {Object.values(AdsStatus).map((s) => (
                                <FormControlLabel
                                    key={s}
                                    control={
                                        <Radio
                                            checked={activeFilter === s}
                                            onChange={handleFilterChange}
                                            value={s}
                                        />
                                    }
                                    label={s}
                                />
                            ))}
                        </FormGroup>
                    </div>
                </BottomSheet>
            </div>
        </div>
    );
};

export default Promotions;
