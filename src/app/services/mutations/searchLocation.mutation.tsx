import { useState } from "react";
import { fetcher } from "../../../graphql/fetcher";
import {
  Place_GetPlacesQuery,
  Place_GetPlacesQueryVariables,
} from "../../../types/general";

// The GraphQL query document
const PLACE_GET_PLACES_DOCUMENT = `
  query place_getPlaces($skip: Int, $take: Int, $where: PlaceFilterInput, $order: [PlaceSortInput!]) {
    place_getPlaces {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        items {
          id
          location
        }
        totalCount
      }
      status
    }
  }
`;
//TODO: use react-query
// Custom hook for fetching places
export const usePlaceGetPlaces = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Place_GetPlacesQuery | null>(null);

  const fetchPlaces = async (variables: Place_GetPlacesQueryVariables) => {
    setLoading(true);
    setError(null);

    try {
      const getData = fetcher<
        Place_GetPlacesQuery,
        Place_GetPlacesQueryVariables
      >(PLACE_GET_PLACES_DOCUMENT, variables);
      const result = await getData();

      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchPlaces, loading, error, data };
};
