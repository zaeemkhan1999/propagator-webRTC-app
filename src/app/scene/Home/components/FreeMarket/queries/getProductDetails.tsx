import { gql } from "graphql-request";
import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

const GET_PRODUCT_DETAILS = gql`
  query product_GetProductDetails($id: Int!) {
    product_GetProductDetails(id: $id) {
      status
      result {
        items {
          id
          seller {
            id
            username
            imageAddress
          }
          productReview {
            averageRating
            totalReviews
          }
          name
          description
          currency
          price
          stock
          reviews {
            id
            description
            createdDate
            rating
            user {
              id
              username
              imageAddress
            }
          }
          images {
            id
            url
          }
        }
      }
    }
  }
`;

interface Variables {
  id?: number;
};

interface Response {
  product_GetProductDetails: {
    result: {
      items: ProdDetail[];
    };
    status: {
      code: number;
      value: string;
    };
  };
};

export interface Image {
  id: number;
  url: string;
};

interface User {
  id: number;
  username: string;
  imageAddress: string;
};

export interface Review {
  id: number;
  description: string;
  rating: number;
  user: User;
  createdDate: string;
};

export interface ProdDetail {
  id: number;
  name: string;
  description: string;
  images: Image[];
  price: number;
  currency: string;
  stock: number;
  reviews: Review[];
  seller: User;
  createdDate: string;
  productReview: {
    averageRating: number;
    totalReviews: number;
  };
};

const useGetProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | ProdDetail>(null);

  const getDetails = async (variables: Variables) => {
    setLoading(true);
    try {
      const getDetails = fetcher<Response, Variables>(GET_PRODUCT_DETAILS, variables);
      const result = await getDetails();

      if (result?.product_GetProductDetails?.status?.code === 1) {
        setData(result?.product_GetProductDetails?.result?.items[0] || null);
      };
    } catch (err: any) {
      enqueueSnackbar(err?.product_GetProductDetails?.status?.value || "Something went wrong", { variant: "error", autoHideDuration: 3000 });
    } finally {
      setLoading(false);
    };
  };

  return { getDetails, loading, data, setData };
};

export default useGetProductDetails;
