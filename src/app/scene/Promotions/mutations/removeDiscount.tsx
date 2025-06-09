import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { useSnackbar } from "notistack";

const REMOVE_DISCOUNT_MUTATION = `
  mutation discount_removeDiscount($entityId: Int!) {
    discount_removeDiscount(entityId: $entityId) {
      code
      value
    }
  }
`;

interface RemoveDiscountInput {
    entityId: number;
}

interface DiscountRemoveResponse {
    discount_removeDiscount: {
        code: number;
        value: string;
    };
}

export const useRemoveDiscount = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const removeDiscount = async (variables: RemoveDiscountInput, onSuccessCallback?: Function) => {
        setLoading(true);

        try {
            const getData = fetcher<DiscountRemoveResponse, RemoveDiscountInput>(REMOVE_DISCOUNT_MUTATION, variables);

            const result = await getData();

            if (result.discount_removeDiscount?.code === 1) {
                enqueueSnackbar(`Discount removed successfully`, { variant: "success", autoHideDuration: 3000, });
                onSuccessCallback?.();
            } else {
                enqueueSnackbar(`Failed to remove discount`, { variant: "error", autoHideDuration: 3000, });
            }
        } catch (err: any) {
            enqueueSnackbar(err?.discount_removeDiscount?.value || "Failed to remove discount", { variant: "error", autoHideDuration: 3000, });
        } finally {
            setLoading(false);
        }
    };

    return { removeDiscount, loading };
};
