import {
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

export const Tag_GetTagsDocument = `
  query tag_getTags($skip: Int, $take: Int, $where: TagFilterInput, $order: [TagSortInput!]) {
    tag_getTags {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          id
          text
          hits
          usesCount
          likesCount
          createdDate
          lastModifiedDate
        }

        totalCount
      }
      status
    }
  }`
  ;

// TypeScript interfaces for the response and variables

// UserViewTag associated with a tag
export interface UserViewTag {
  tagId: number; // Associated tag ID
  userId: number; // User ID
  tag: {
    text: string; // Tag text
    hits: number; // Tag hits
    usesCount: number; // Number of uses
  };
}

// Individual item in the tag results
export interface TagItem {
  id: number; // Unique tag identifier
  text: string; // Tag text
  hits: number; // Number of hits
  usesCount: number; // Number of uses
  likesCount: number; // Number of likes
  lastModifiedDate: string; // Last modification date
  createdDate: string; // Creation date
  userViewTags: UserViewTag[]; // User-specific tag views
}

// Structure of the response's result
interface Tag_GetTagsResult {
  items: TagItem[]; // List of tags
  totalCount: number; // Total count of tags
}

// Full query response format
export interface Tag_GetTagsQueryResponse {
  tag_getTags: {
    result: Tag_GetTagsResult;
    status: {
      code: number; // Status code
      value: string; // Status message
    };
  };
}

// Variables required by the query
interface Tag_GetTagsQueryVariables {
  skip?: number; // Optional offset for pagination
  take: number; // Number of items to fetch per request
  where?: {
    text?: {
      contains?: string; // Supports search for "contains" functionality
    };
  }; // Optional filter input
  order?: Record<string, unknown>[]; // Optional sorting input
}

export const useTag_GetTagsQuery = (
  variables: Tag_GetTagsQueryVariables,
  options?: Partial<
    UseInfiniteQueryOptions<
      Tag_GetTagsQueryResponse,
      Error,
      TagItem[]
    >
  >
) =>
  useInfiniteQuery<
    Tag_GetTagsQueryResponse,
    Error,
    TagItem[]
  >({
    queryKey: ["tag_getTags", variables],
    initialPageParam: 0, // Initial skip value
    queryFn: ({ pageParam }) =>
      fetcher<Tag_GetTagsQueryResponse, Tag_GetTagsQueryVariables>(
        Tag_GetTagsDocument,
        {
          ...variables,
          skip: pageParam as number, // Pagination
        }
      )(),
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.tag_getTags?.result?.totalCount;
      const totalFetchedCount = pages.reduce(
        (sum, page) => sum + page.tag_getTags.result.items.length,
        0
      );
      if (totalCount > totalFetchedCount) return totalFetchedCount;
      return undefined;
    },
    select: (data) =>
      data?.pages
        .map((page) => page.tag_getTags?.result.items)
        .flat(1),
    placeholderData: keepPreviousData,
    ...options,
    enabled: false
  });