import { keepPreviousData, useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

// GraphQL query document for fetching links (removed skip and take parameters)
export const Link_GetLinksDocument = `
  query link_getLinks($searchTerm: String) {
    link_getLinks(searchTerm: $searchTerm) {
      result {
        items {
          url
          text
          createdDate
          linkType
        }
        totalCount
      }
      status
    }
  }
`;

// TypeScript interfaces for the response and variables
export interface LinkItem {
  url: string;
  text: string;
  createdDate: string;
  linkType: string;
  id: number;
}

interface LinkGetLinksResult {
  items: LinkItem[];
  totalCount: number;
}

interface LinkGetLinksQueryResponse {
  link_getLinks: {
    result: LinkGetLinksResult;
    status: string;
  };
}

interface LinkGetLinksQueryVariables {
  searchTerm: string;
}

// Custom hook for fetching links with pagination
export const useLink_GetLinksQuery = (
  variables: LinkGetLinksQueryVariables,
  options?: Partial<
    UseInfiniteQueryOptions<LinkGetLinksQueryResponse, Error, LinkItem[]>
  >
) =>
  useInfiniteQuery<LinkGetLinksQueryResponse, Error, LinkItem[]>({
    queryKey: ["link_getLinks", variables],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher<LinkGetLinksQueryResponse, LinkGetLinksQueryVariables>(
        Link_GetLinksDocument,
        {
          searchTerm: variables.searchTerm,
        }
      )();
    },
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.link_getLinks?.result?.totalCount;
      const totalFetchedCount = pages.reduce(
        (sum, page) => sum + page.link_getLinks.result.items.length,
        0
      );
      if (totalCount > totalFetchedCount) return totalFetchedCount;
      return undefined;
    },
    select: (data) =>
      data?.pages.flatMap((page) => page.link_getLinks.result.items),
    placeholderData: keepPreviousData,
    ...options,
    enabled: false,
  });