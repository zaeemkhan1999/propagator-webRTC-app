import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../../http/graphql.fetcher';

interface StripeSessionResponse {
    status: {
        code: number;
        value: string;
    };
    result: string;
}

interface Payment_GetStripeSessionResponse {
    payment_getStripeSession: StripeSessionResponse;
}

const GET_STRIPE_SESSION_QUERY = gql`
  query payment_getStripeSession($userId: String, $baseurl: String!, $priceid: String!) {
    payment_getStripeSession(userId: $userId, baseurl: $baseurl, priceid: $priceid) {
      status
      result
    }
  }
`;

export const useGetStripeSession = (userId: string, baseurl: string, priceid: string) => {
    return useQuery<Payment_GetStripeSessionResponse, Error>({
        queryKey: ['payment_getStripeSession', baseurl, priceid],
        queryFn: () =>
            graphqlFetcher(GET_STRIPE_SESSION_QUERY, {
                userId,
                baseurl,
                priceid,
            }),
        enabled: false
    });
};
