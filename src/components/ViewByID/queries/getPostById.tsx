import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { PostData, PostItemString } from "@/types/Feed";

// TypeScript types based on the provided interfaces

type PostGetPostQueryVariables = {
    entityId: number;
};

type PostGetPostQuery = {
    post_getPost?: PostGetPostResponse;
};

interface PostStatus {
    code: number;
    value: string;
}

interface PostGetPostResponse {
    status?: PostStatus;
    result?: PostData;
}

const PostGetPostDocument = `
    query post_getPost($entityId: Int!) {
        post_getPost(entityId: $entityId) {
            result {
                post {
                    id
                    deletedBy
                    isPromote
                    postItemsString
                    location
                    postType
                    postedAt
                    yourMind
                    iconLayoutType
                    createdDate
                    allowDownload
                    isPin
                    isCreatedInGroup
                    bg
                    aspectRatio
                    poster {
                        imageAddress
                        username
                        id
                        legalName
                        displayName
                        isVerified
                    }
                }
                likeCount
                commentCount
                isLiked
                isSaved
            }
            status
        }
    }
`;

export const useGetPostById = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PostData | null>(null);
    const navigate = useNavigate();

    const fetchPost = async (entityId: number, onSuccess?: Function) => {
        setLoading(true);

        try {
            const variables: PostGetPostQueryVariables = {
                entityId,
            };

            const postFetcher = fetcher<PostGetPostQuery, PostGetPostQueryVariables>(
                PostGetPostDocument,
                variables
            );
            const response = await postFetcher();

            if (response.post_getPost?.status?.code === 1) {
                let newData = response?.post_getPost?.result ?? null;
                if (newData && !newData?.postItemsString) {
                    const parsedData = JSON.parse(newData?.post?.postItemsString as any);
                    newData.postItemsString = parsedData?.length ? parsedData[0] : [];
                }

                setData(newData);
                onSuccess?.();
            } else if (response.post_getPost?.status?.code === 2) {
                enqueueSnackbar("Post Not Found", { variant: "error", autoHideDuration: 1000 });
                navigate(-1);
            } else {
                enqueueSnackbar("Failed to fetch post", { variant: "error", autoHideDuration: 1000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.message || "Failed to fetch post", { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { fetchPost, loading, data };
};
