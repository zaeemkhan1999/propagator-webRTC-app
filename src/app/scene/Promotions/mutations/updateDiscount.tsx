import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

const UPDATE_DISCOUNT_MUTATION = `
  mutation discount_updateDiscount($input: DiscountInput!) {
    discount_updateDiscount(input: $input) {
      result {
        id
      }
      status
    }
  }
`;

interface DiscountInput {
    id: number;
    amount: number;
    percent: number;
    discountCode: string;
    expireDate: string;
}

interface DiscountUpdateResponse {
    discount_updateDiscount: {
        result: {
            id: number;
        };
        status: {
            code: number;
            value: string;
        };
    };
}

export const useUpdateDiscount = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const updateDiscount = async (variables: DiscountInput, onSuccessCallback?: Function) => {
        setLoading(true);

        try {
            const getData = fetcher<DiscountUpdateResponse, { input: DiscountInput }>(UPDATE_DISCOUNT_MUTATION, { input: variables });

            const result = await getData();

            if (result?.discount_updateDiscount?.status?.code === 1) {
                enqueueSnackbar(`Discount updated successfully`, { variant: "success", autoHideDuration: 3000 });
                onSuccessCallback?.();
            } else {
                enqueueSnackbar(`Failed to update discount`, { variant: "error", autoHideDuration: 3000 });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.discount_updateDiscount?.status?.value || "Failed to update discount", { variant: "error", autoHideDuration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return { updateDiscount, loading };
};
