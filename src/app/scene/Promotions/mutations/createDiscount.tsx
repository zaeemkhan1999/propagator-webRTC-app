import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";
import { enqueueSnackbar } from "notistack";

type Discount_CreateDiscountMutationVariables = {
    input: {
        amount: number;
        discountCode: string;
        percent: number;
        expireDate: string;
    };
};

type Discount_CreateDiscountMutation = {
    __typename?: "Mutation";
    discount_createDiscount?: {
        __typename?: "ResponseBase";
        result?: {
            id: number;
        };
        status: {
            code: number;
            value: string;
        };
    };
};

const Discount_CreateDiscountDocument = `
  mutation discount_createDiscount($input: DiscountInput) {
    discount_createDiscount(input: $input) {
      result {
        id
      }
      status
    }
  }
`;

export type CreateDiscountVariables = {
    amount: number;
    discountCode: string;
    percent: number;
    expireDate: string;
}

export const useCreateDiscount = () => {
    const [loading, setLoading] = useState(false);

    const createDiscount = async (input: CreateDiscountVariables, onSuccess?: Function) => {
        setLoading(true);

        try {
            const variables: Discount_CreateDiscountMutationVariables = { input };

            const discountFetcher = fetcher<Discount_CreateDiscountMutation, Discount_CreateDiscountMutationVariables>(
                Discount_CreateDiscountDocument,
                variables
            );
            const response = await discountFetcher();

            if (response.discount_createDiscount?.status?.code !== 1) {
                enqueueSnackbar(response.discount_createDiscount?.status?.value || "Failed to create discount", { variant: "error", autoHideDuration: 3000 });
            } else {
                onSuccess?.();
                enqueueSnackbar("Discount created successfully", { variant: "success", autoHideDuration: 3000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.discount_createDiscount?.status?.value || "Failed to create discount", { variant: "error", autoHideDuration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return { createDiscount, loading };
};
