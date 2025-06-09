import { useInfiniteQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlFetcher } from '../../../../http/graphql.fetcher';

export interface Discount {
    id: number;
    discountCode: string;
    percent: number;
    amount: number;
    expireDate: string;
}

interface DiscountResult {
    items: Discount[];
    totalCount: number;
}

interface DiscountGetResponse {
    discount_getDiscountes: {
        result: DiscountResult;
        status: {
            code: number;
            value: string;
        }
    };
}

const DISCOUNT_GET_DISCOUNTES_QUERY = gql`
  query discount_getDiscountes($skip: Int, $take: Int, $where: DiscountFilterInput) {
    discount_getDiscountes {
      result(
      skip: $skip,
      take: $take,
      where: $where) {
        totalCount
        items {
          id
          discountCode
          percent
          amount
          expireDate
        }
      }
      status
    }
  }
`;

export const useGetDiscounts = ({
    code,
    skip = 0,
    take = 10,
}: {
    code?: string;
    skip?: number;
    take?: number;
}) => {
    return useInfiniteQuery<DiscountGetResponse, Error>({
        queryKey: ['discount_getDiscountes'],
        queryFn: ({ pageParam = skip }) =>
            graphqlFetcher(DISCOUNT_GET_DISCOUNTES_QUERY, {
                skip: pageParam,
                take: take,
                where: {
                    ...(code && { discountCode: { eq: code } }),
                    expireDate: { gt: new Date() },
                    isDeleted: { eq: false },
                },
            }),
        getNextPageParam: (lastPage, pages) => {
            const totalDiscounts = lastPage?.discount_getDiscountes?.result?.totalCount || 0;
            const currentCount = pages.length * take;
            return currentCount < totalDiscounts ? currentCount : undefined;
        },
        initialPageParam: skip,
        enabled: false,
    });
};
