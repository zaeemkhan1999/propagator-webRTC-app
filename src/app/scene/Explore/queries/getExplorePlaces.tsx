import {
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { fetcher } from "../../../../graphql/fetcher";

// GraphQL query document for fetching places
export const Place_GetPlacesDocument = `
  query place_getPlaces($skip: Int, $take: Int, $where: PlaceFilterInput) {
    place_getPlaces {
      result(skip: $skip, take: $take, where: $where) {
        items {
          id
          location
          isDeleted
        }
      }
      status
    }
  }
`;


// Structure of the query result
// Individual place item
export interface PlaceItem {
  id: number; // Unique identifier for the place
  location: string; // Location name
  isDeleted: boolean; // Indicates if the place is deleted
}

// Structure of the query result
interface Place_GetPlacesResult {
  items: PlaceItem[]; // List of place items
}

// Full query response format
export interface Place_GetPlacesQueryResponse {
  place_getPlaces: {
    result: Place_GetPlacesResult;
    status: string; // Status of the query
  };
}

// Variables for the query
interface Place_GetPlacesQueryVariables {
  skip?: number; // Optional offset for pagination
  take: number; // Number of items to fetch per request
  where?: {
    location?: {
      contains: string; // Optional search term for location
    };
  };
}

// Hook for fetching places
export const usePlace_GetPlacesQuery = (
  variables: Place_GetPlacesQueryVariables,
  options?: Partial<
    UseInfiniteQueryOptions<
      Place_GetPlacesQueryResponse,
      Error,
      PlaceItem[]
    >
  >
) =>
  useInfiniteQuery<
    Place_GetPlacesQueryResponse,
    Error,
    PlaceItem[]
  >({
    queryKey: ["place_getPlaces", variables],
    initialPageParam: 0, // Initial offset
    queryFn: ({ pageParam }) =>
      fetcher<Place_GetPlacesQueryResponse, Place_GetPlacesQueryVariables>(
        Place_GetPlacesDocument,
        {
          ...variables,
          skip: pageParam as number,
        }
      )(),
    getNextPageParam: (lastPage, pages) => {
      const items = lastPage?.place_getPlaces?.result?.items ?? [];
      return items.length === variables.take ? pages.length * variables.take : undefined;
    },
    placeholderData: keepPreviousData,
    select: (data) =>
      data?.pages
        .map((page) => page.place_getPlaces?.result.items)
        .flat(1),
    ...options,
    enabled: false,
  });