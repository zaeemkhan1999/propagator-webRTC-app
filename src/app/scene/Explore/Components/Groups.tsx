import Lottie from "lottie-react";
import NoData from "../../../utility/Nodata.json";
import { useEffect, useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { useGetGroups } from "../../Groups/queries/getGroup.query";
import GroupCard from "../../Groups/components/GroupCard";
import { useNavigate } from "react-router";
import { CircularProgress } from "@mui/material";

function Groups({ searchTerm }: { searchTerm?: string }) {
    const navigate = useNavigate();
    const user = useSnapshot(userStore.store).user;

    const { data, isFetching, fetchNextPage, refetch } = useGetGroups({
        skip: 0,
        take: 10,
        where: {
            isPrivate: { eq: false },
            isMemberOfGroup: { eq: false },
            ...(searchTerm && {
                or: [
                    { groupName: { contains: searchTerm } },
                    { groupDescription: { contains: searchTerm } },
                ],
            })
        },
        userId: user?.id
    });

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        const timer = setTimeout(refetch, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (!isFetching && entries[0].isIntersecting) fetchNextPage();
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 1.0,
            }
        );

        const sentinel = sentinelRef.current;
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [isFetching, fetchNextPage]);

    const groups = useMemo(() => data?.pages?.flatMap(page => (
        page?.message_getGroups?.result?.items?.filter(g => !g.isPrivate) || []
    )), [data]);

    return (
        <div className="w-full h-screen overflow-y-auto pb-20 snap-y snap-mandatory bg-gray-100 p-1 pt-0">
            <div>
                {groups?.length
                    ? groups?.map(g => (
                        <GroupCard
                            key={g.conversationId}
                            group={g}
                            onClick={() => navigate('/specter/groups/' + g.conversationId, { state: { props: { group: g } } })}
                        />
                    ))
                    : <Lottie
                        loop
                        animationData={NoData}
                        style={{ width: "200px", height: "200px", margin: "0 auto" }}
                    />}

                <div ref={sentinelRef} className="h-px" />
                {isFetching &&
                    <div className="flex items-center justify-center h-full w-full">
                        <CircularProgress />
                    </div>}
            </div>
        </div>
    );
}

export default Groups;
