/* eslint-disable */
import {
  CircularProgress,
  Typography,
} from "@mui/material";
import Scroll from "@/components/Scroll";
import { useState, memo, useEffect, useRef, lazy } from "react";
import {
  ArticleItem,
  usePost_GetArticlesQuery,
} from "../../../Explore/queries/getExploreScrolls";
import { CommentType } from "@/constants/storage/constant";
import { useAddScrollComment } from "./mutations/addScrollComment";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { useGetScrollComments } from "./queries/getScrollComments";
import { useLikeScroll } from "./mutations/likeScrolls";
import { useUnLikeScroll } from "./mutations/unlikeScroll";
import NoData from "../../../../utility/Nodata.json";
import Lottie from "lottie-react";
import ScrollSkeleton from "@/components/Skeleton/ScrollSkeleton";
import { useRemoveScroll } from "./mutations/removeScroll";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { IsPermissionEnable } from "@/app/utility/permission.helper";
import { permissionsENUM } from "@/constants/permissions";
import Header from "@/components/Header";
import { useNavigate } from "react-router";

const FullScreenPost = lazy(() => import("./components/FullScreenPost"));
const CommentSection = lazy(() => import("./components/CommentSection"));

interface PropTypes {
  setSelectedFullScrollPost?: any;
  yourArticle?: boolean;
  scrollId?: number;
  isCreatedInGroup?: boolean;
  groupArticles?: ArticleItem[] | [];
  isNewsPage?: boolean;
  searchTerm?: string;
};

const Scrolls = memo(({ setSelectedFullScrollPost, yourArticle, scrollId, isCreatedInGroup, groupArticles, isNewsPage, searchTerm }: PropTypes) => {
  const user = useSnapshot(userStore.store);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  const [selectedFullPost, setSelectedFullPost] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [replyText, setReplyText] = useState<string>("");
  const [totalComments, setTotalComments] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isContentUploading, setIsContentUploading] = useState(0);

  const { addScrollComment, loading: addingComment } = useAddScrollComment();

  const handleBookmark = () => setIsBookmarked(!isBookmarked);

  useEffect(() => {
    setSelectedFullScrollPost?.(selectedFullPost === null ? false : true);
  }, [selectedFullPost]);

  const {
    data: scrollsData,
    isFetching,
    isLoading,
    refetch: refetchScrollData,
    fetchNextPage,
    hasNextPage,
  } = usePost_GetArticlesQuery({
    skip: 0,
    take: 10,
    ...(scrollId
      ? {
        where:
          { article: { id: { eq: scrollId } } }
      }
      : yourArticle
        ? {
          where: {
            isYourArticle: { eq: true },
            article: { isCreatedInGroup: { eq: false } },
            ...(searchTerm && {
              or: [
                { article: { title: { contains: searchTerm } } },
                { article: { subTitle: { contains: searchTerm } } },
                { article: { author: { contains: searchTerm } } },
              ]
            })
          }
        }
        : {
          where: {
            article: {
              isCreatedInGroup: { eq: false },
              ...(isNewsPage && { isByAdmin: { eq: isNewsPage } })
            },
            ...(searchTerm && {
              or: [
                { article: { title: { contains: searchTerm } } },
                { article: { subTitle: { contains: searchTerm } } },
                { article: { author: { contains: searchTerm } } },
              ]
            })
          }
        })
  });

  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(refetchScrollData, 500);
      return () => clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    !(isCreatedInGroup && groupArticles) && refetchScrollData();
  }, []);

  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (!(isCreatedInGroup && groupArticles) && lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  const scrollStringData: any = (scroll: any) =>
    scroll?.articleItemsString
      ? (JSON.parse(scroll?.articleItemsString as string) || [])?.map(
        (data: any) => data,
      )
      : [];

  const commentsVariables = {
    skip: 0,
    take: 10,
    loadDeleted: false,
    order: {
      articleComment: { id: "DESC" }
    },
    where: {
      ...(yourArticle && { isYourArticle: { eq: true } }),
      articleComment: {
        articleId: { eq: selectedFullPost?.article?.id },
        parentId: { eq: null },
      }
    }
  };

  const {
    data: commentsData,
    loading: loadingComments,
    refetch: refetchComments,
  } = useGetScrollComments();

  useEffect(() => {
    if (isBottomSheetOpen) refetchComments(commentsVariables);
    if (selectedFullPost) setTotalComments(selectedFullPost?.commentCount);
  }, [isBottomSheetOpen, selectedFullPost, scrollsData]);

  useEffect(() => {
    if (commentsData?.articleComment_getArticleComments?.result?.items) {
      const c =
        commentsData?.articleComment_getArticleComments?.result?.items || [];
      setComments(c);
      setTotalComments(c.length);
    }
  }, [commentsData]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setNewComment("");
      addScrollComment({
        input: {
          text: newComment.trim(),
          articleId: Number(selectedFullPost?.article?.id),
          parentId: null,
          commentType: CommentType.Text,
          contentAddress: "",
        },
      }).then(() => {
        refetchComments(commentsVariables);
      });
    }
  };

  const handleAddReply = (commentId: any) => {
    if (replyText.trim()) {
      setReplyText("");
      setReplyCommentId(null);
      addScrollComment({
        input: {
          text: replyText,
          articleId: Number(selectedFullPost?.article?.id),
          parentId: Number(replyCommentId),
          commentType: CommentType.Text,
          contentAddress: "",
        },
      }).then(() => {
        refetchComments(commentsVariables);
      });
    }
  };

  const handleAddContent = (contentAddress: any) => {
    setNewComment("");
    addScrollComment({
      input: {
        text: "",
        articleId: Number(selectedFullPost?.article?.id),
        parentId: Number(replyCommentId),
        commentType: CommentType.File,
        contentAddress,
      },
    }).then(() => {
      setIsContentUploading(0);
      refetchComments(commentsVariables);
    });
  };

  const { likeScroll } = useLikeScroll();
  const { unLikeScroll } = useUnLikeScroll();

  const handleLike = (id: number, liked: boolean) => {
    liked
      ? unLikeScroll({ articleId: id })
      : likeScroll({ articleId: id, liked: !liked });
  };

  const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();

  const canRemove = IsPermissionEnable(permissionsENUM.DeleteEntities);

  const { removeScroll, loading: removingScroll } = useRemoveScroll();

  const handleRemove = (id: number) => {
    !removingScroll && removeScroll({ entityId: id }, () => {
      refetchScrollData();
      selectedFullPost && setSelectedFullPost(null);
    });
  };

  useEffect(() => {
    if (selectedFullPost) {
      document.body.classList.add("fullscroll");
      searchParams.set('fullscreen', '1');
      window.history.pushState({}, '', `?${searchParams.toString()}`);
    } else {
      document.body.classList.remove("fullscroll");
      searchParams.delete('fullscreen');
      window.history.pushState({}, '', `?${searchParams.toString()}`);

      setSelectedFullPost(null);
      setSelectedFullScrollPost?.(null);
    }

    return () => {
      setSelectedFullScrollPost?.(null);
    };
  }, [selectedFullPost]);


  useEffect(() => {
    searchParams.get('fullscreen') !== '1' && setSelectedFullPost(null);
  }, [searchParams.toString()]);

  return (
    <>
      {scrollId &&
        <Header
          text="Scroll"
          textColor="black"
          handleBack={() => navigate('/specter/home')}
        />}

      {/* Full Scroll Post */}
      {selectedFullPost &&
        <FullScreenPost
          selectedFullPost={selectedFullPost}
          setSelectedFullPost={setSelectedFullPost}
          scrollStringData={scrollStringData}
          handleLike={handleLike}
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          isBookmarked={isBookmarked}
          handleBookmark={handleBookmark}
          totalComments={totalComments}
          canRemove={(isSuperAdmin || canRemove)}
          handleRemove={handleRemove}
          userId={user?.user?.id!}
        />}

      {/* Scroll List */}
      {!selectedFullPost &&
        <div className={`mt-4 w-full relative h-screen pb-20 snap-y snap-mandatory bg-gray-100 p-1 pt-0 overflow-y-auto`}>
          {isLoading
            ? <ScrollSkeleton />
            : (!isCreatedInGroup && !groupArticles)
              ? scrollsData?.pages?.flatMap((page) =>
                page.article_getArticles.result.items.length
                  ? page.article_getArticles.result.items
                    ?.map((scroll: ArticleItem) => (
                      <Scroll
                        key={scroll.article.id}
                        setSelectedFullPost={setSelectedFullPost}
                        scroll={scroll}
                        handleLike={handleLike}
                        canRemove={(isSuperAdmin || canRemove)}
                        handleRemove={handleRemove}
                        userId={user?.user?.id!}
                      />
                    ))
                  : <NoScroll isNewsPage={isNewsPage} />)
              : groupArticles?.length
                ? groupArticles?.map(scroll => (
                  <Scroll
                    key={scroll?.article?.id}
                    setSelectedFullPost={setSelectedFullPost}
                    scroll={scroll}
                    handleLike={handleLike}
                    canRemove={(isSuperAdmin || canRemove)}
                    handleRemove={handleRemove}
                    userId={user?.user?.id!}
                  />
                ))
                : <NoScroll />}

          <div ref={lastElementRef}></div>
          {isFetching && !isLoading && <div className="text-center"><CircularProgress /></div>}
        </div>}

      {isBottomSheetOpen &&
        <CommentSection
          isBottomSheetOpen={isBottomSheetOpen}
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          loadingComments={loadingComments}
          comments={comments}
          showMoreReplies={showMoreReplies}
          setPostReplies={setComments}
          setShowMoreReplies={setShowMoreReplies}
          user={user}
          replyCommentId={replyCommentId}
          setReplyText={() => { }}
          setNewComment={setNewComment}
          handleAddReply={handleAddReply}
          handleAddComment={handleAddComment}
          setReplyCommentId={setReplyCommentId}
          replyText={replyText}
          newComment={newComment}
          isContentUploading={isContentUploading}
          handleAddContent={handleAddContent}
          setIsContentUploading={setIsContentUploading}
          addingComment={addingComment}
        />}
    </>
  );
});

export default Scrolls;

const NoScroll = ({ isNewsPage }: { isNewsPage?: boolean }) => {
  return <>
    <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
    <Typography className='text-md text-center italic'>
      No {isNewsPage ? "News" : "Scroll(s)"} yet!
    </Typography>
  </>
};
