import { useInfiniteQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlFetcher } from "@/http/graphql.fetcher";

interface Seller {
  id: number
  displayName: string;
  username: string;
  imageAddress: string;
};

interface Review {
  totalReviews: number;
  averageRating: number;
};

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  currency: string;
  images: { url: string }[];
  productReview: Review;
  seller: Seller
};

interface ProductResult {
  items: Product[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
  };
};

interface ProductGetResponse {
  product_getAllProducts: {
    result: ProductResult;
    status: {
      code: number;
      value: string;
    };
  };
};

const GET_ALL_PRODUCTS_QUERY = gql`
  query product_getAllProducts($skip: Int, $take: Int, $where: ProductsDtoFilterInput, $order: [ProductsDtoSortInput!]) {
    product_getAllProducts {
      result(skip: $skip, take: $take, where: $where, order: $order) {
        totalCount
        pageInfo {
          hasNextPage
        }
        items {
          id
          name
          description
          price
          stock
          currency
          images {
            url
          }
          productReview {
          totalReviews
          averageRating
          }
          seller {
          id
          displayName
          username
          imageAddress
          }
        }
      }
      status
    }
  }
`;

const useGetAllProducts = (sellerId?: number, searchTerm?: string) => {
  return useInfiniteQuery<ProductGetResponse, Error, Product[]>({
    queryKey: ["product_getAllProducts", sellerId, searchTerm],
    queryFn: ({ pageParam = 0 }) =>
      graphqlFetcher(GET_ALL_PRODUCTS_QUERY, {
        skip: pageParam,
        take: 20,
        order: [{ id: "DESC" }],
        ...(sellerId && { where: { sellerId: { eq: sellerId } } }),
        ...(searchTerm && {
          where: {
            or: [
              { name: { contains: searchTerm } },
              { description: { contains: searchTerm } },
              { seller: { username: { contains: searchTerm } } },
              { price: { in: !isNaN(Number(searchTerm)) ? [+searchTerm] : [] } },
            ]
          }
        })
      }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.product_getAllProducts?.result?.pageInfo?.hasNextPage ? pages.length * 20 : undefined;
    },
    select: data => data?.pages?.flatMap(page => page?.product_getAllProducts?.result?.items || []) || [],
    initialPageParam: 0,
    enabled: false,
  });
};

export default useGetAllProducts;
