import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../../http/graphql.fetcher';

interface Ads {
  id: number;
  type: string;
  postId?: number | null;
  ticketNumber: string;
  manualStatus: string;
  totlaAmount: number;
  visitType: string;
  latestPaymentIntentId: string;
  isCompletedPayment: boolean;
  discountCode: string;
  createdDate: string;
}

export interface Ad {
  adsDtoStatus: string;
  postItemsString: string;
  ads: Ads;
}

interface AdsResult {
  items: Ad[];
  totalCount: number;
}

interface AdsGetResponse {
  ads_getAdses: {
    result: AdsResult;
    status: string;
  };
}

export enum AdsStatus { ACTIVE = 'ACTIVE', COMPLETE = 'COMPLETE', REJECTED = 'REJECTED', SUSPENDED = 'SUSPENDED' }

const ADS_GET_ADSES_QUERY = gql`
   query ads_getAdses(
    $skip: Int,
    $take: Int,
    $where: AdsDtoFilterInput,
    $order: [AdsDtoSortInput!]
  ) {
    ads_getAdses {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        totalCount
        items {
          adsDtoStatus
          postItemsString
          ads {
            id
            type
            postId
            ticketNumber
            manualStatus
            totlaAmount
            visitType
            latestPaymentIntentId
            isCompletedPayment
            discountCode
            createdDate
          }
        }
      }
      status
    }
  }
`;

export const useGetAds = ({
  userId,
  isCompletedPayment,
  adsDtoStatus,
  skip = 0,
  take = 10,
}: {
  userId: number;
  isCompletedPayment?: boolean;
  adsDtoStatus?: AdsStatus;
  skip?: number;
  take?: number;
}) => {
  return useInfiniteQuery<AdsGetResponse, Error>({
    queryKey: ['ads_getAdses', userId, isCompletedPayment, adsDtoStatus],
    queryFn: ({ pageParam = skip }) =>
      graphqlFetcher(ADS_GET_ADSES_QUERY, {
        skip: pageParam,
        take: take,
        where: {
          ads: {
            ...(isCompletedPayment && { isCompletedPayment: { eq: isCompletedPayment } }),
            user: { id: { eq: userId } },
          },
          ...(adsDtoStatus && { adsDtoStatus: { eq: adsDtoStatus } }),
        },
        order: [{ ads: { createdDate: 'DESC' } }],
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalAds = lastPage?.ads_getAdses?.result?.totalCount || 0;
      const currentCount = pages.length * take;
      return currentCount < totalAds ? currentCount : undefined;
    },
    initialPageParam: skip,
    enabled: false,
  });
};
