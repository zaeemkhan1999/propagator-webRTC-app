import { graphqlFetcher } from "../http/graphql.fetcher";

export function fetcher<TData, TVariables>(
  query: string,
  variables?: TVariables
) {
  return async (): Promise<TData> => {
    const response = await graphqlFetcher(query, variables);

    return response;
  };
}
