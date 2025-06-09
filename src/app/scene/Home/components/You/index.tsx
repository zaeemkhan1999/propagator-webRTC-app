import { useRef, useEffect, useState, memo, lazy } from "react";
import Feed from "@/components/Feed";
import { GetPostType } from "@//constants/storage/constant";
import FeedSkeleton from "@/components/Skeleton/FeedSkeleton";
import Lottie from "lottie-react";
import NoDataImg from "@/app/utility/Nodata.json";
import { PostData } from "@/types/Feed";
import { useInView } from "react-intersection-observer";
import useGetPostsInAdvancedWay, { PER_PAGE_COUNT } from "../../queries/getPostsInAdvanceWay";
import useGetFollowersPosts from "../../queries/getFollowersPosts";
import useAddWatchHistory from "../../mutations/addWatchHistory";
import useAddViewToPosts from "../../mutations/addViewToPost";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { parsePostItemsHome } from "@/helper";
import useIsSafari from "@/hooks/useIsSafari";
// import Promoted from "@/components/Promoted";
// import AdBanner from "@/components/AdComponent";

const LikesAndViews = lazy(() => import("@/components/Feed/LikesAndViews"));

interface Props {
  isStoriesPage?: boolean;
  isFollowingsPostsPage?: boolean;
  needWatchHistory?: boolean;
};

const You = memo(({ isStoriesPage, isFollowingsPostsPage, needWatchHistory }: Props) => {
  const userId = useSnapshot(userStore.store).user?.id;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const postId = searchParams.get("post");
  const page = searchParams.get("page");

  const [posts, setPosts] = useState<any[]>([]);
  const [showLikes, setShowLikes] = useState<null | { id: number, viewCount: number }>(null);

  const {
    data: postsData,
    getData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useGetPostsInAdvancedWay({
    skip: (page && +page > 1) ? (+page - 1) * PER_PAGE_COUNT : 0,
    getPostType: GetPostType.Recommended,
    where: {
      post: {
        isCreatedInGroup: { eq: false },
        ...(isStoriesPage && { isByAdmin: { eq: isStoriesPage } })
      },
    },
  });

  const {
    data: followersPostsData,
    getData: followersGetData,
    fetchNextPage: followersFetchNextPage,
    hasNextPage: followersHasNextPage,
    isFetching: followersIsFetching,
    isLoading: followersIsLoading,
  } = useGetFollowersPosts();

  useEffect(() => {
    !isFollowingsPostsPage
      ? getData()
      : followersGetData();
  }, [isFollowingsPostsPage]);

  useEffect(() => {
    setPosts(() => {
      if (!isFollowingsPostsPage) {
        return postsData.length ? postsData?.map(item => ({
          ...item,
          postItemsString: parsePostItemsHome(item?.postItemsString ?? null)
        })) : [];
      }
      else {
        return followersPostsData.length ? followersPostsData?.map(item => ({
          ...item,
          postItemsString: parsePostItemsHome(item?.post?.postItemsString ?? null)
        })) : [];
      }
    });
  }, [postsData, isFollowingsPostsPage, followersPostsData]);

  const { addWatchHistory } = useAddWatchHistory();
  const { addViewToPosts } = useAddViewToPosts();

  const { ref: lastPostRef } = useInView({
    triggerOnce: false,
    threshold: 0.8,
    onChange: inView => {
      if (!isFollowingsPostsPage) {
        if (inView && !isFetching && !isLoading && posts.length) {
          if (needWatchHistory) {
            const postIds: number[] = posts.map(p => p?.post?.id);
            Promise.all([
              addWatchHistory({ postIds }),
              addViewToPosts({ postIds })
            ]);
          };

          if (hasNextPage) {
            fetchNextPage();
          };
        };
      } else {
        if (inView && !followersIsFetching && !followersIsLoading && posts.length) {
          if (needWatchHistory) {
            const postIds: number[] = posts.map(p => p?.post?.id);
            Promise.all([
              addWatchHistory({ postIds }),
              addViewToPosts({ postIds })
            ]);
          };

          if (followersHasNextPage) {
            followersFetchNextPage();
          };
        };
      };
    },
  });

  useEffect(() => {
    const deleteSearchParams = () => {
      searchParams.delete('post');
      searchParams.delete('page');
      window.history.replaceState({}, '', window.location.pathname);
    };

    if (postId && containerRef.current) {
      const postElement = containerRef.current.querySelector(`[data-post-id="${postId}"]`);
      if (postElement) {
        postElement.scrollIntoView({ block: "start", behavior: "instant" });
        if (postId && page) {
          deleteSearchParams();
        };
      };
    };
  }, [postId]);

  const handleOnDelete = (postId: number) => {
    const newPosts = posts.filter((p: PostData) => p.post?.id !== postId);
    setPosts(newPosts);
  };

  const isSafari = useIsSafari();

  return (
    <div
      ref={containerRef}
      className="w-full h-dvh md:h-screen overflow-y-auto snap-y snap-mandatory bg-black"
      style={{ scrollBehavior: "smooth" }}
    >
      {(isLoading || isFetching || followersIsLoading || followersIsFetching)
        ? <div className="h-full">
          <FeedSkeleton />
          {/* <Promoted /> */}
          {/* <AdBanner /> */}
        </div>
        : posts?.length
          ? posts?.map((post, i: number) => (
            <div
              key={`${post?.post?.id}-${i}`}
              data-post-id={post?.post?.id}
            >
              <Feed
                post={post}
                onDelete={handleOnDelete}
                userId={userId}
                setShowLikes={setShowLikes}
                dontShowPoster={i === 0 || isSafari}
                isSafari={isSafari}
              />
            </div>
          ))
          : <NoData />}

      {(!isLoading && !isFetching && hasNextPage && posts?.length) ||
        (!followersIsLoading && !followersIsFetching && followersHasNextPage && posts?.length)
        ? <div ref={lastPostRef} className="h-full">
          <FeedSkeleton />
        </div>
        : null}

      {!!showLikes &&
        <LikesAndViews
          show={showLikes}
          setShow={setShowLikes}
          userId={userId!}
        />}
    </div>
  );
});

export default You;

export const NoData = () => {
  return <div className="flex flex-col h-full justify-center items-center">
    <Lottie
      loop
      animationData={NoDataImg}
      style={{
        width: "130px",
        height: "120px",
        margin: "0 auto",
      }}
    />
    <p className="text-white text-center italic">No Posts yet!</p>
  </div>
};
