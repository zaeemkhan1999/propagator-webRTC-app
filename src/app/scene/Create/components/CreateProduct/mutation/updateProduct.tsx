import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import config from "@/config/index.dev";
import { getToken } from "@/http/graphql.client";

const useUpdateProduct = () => {
    const [loading, setLoading] = useState(false);

    const updateProduct = async (formData: FormData, onSuccess?: Function) => {
        setLoading(true);
        try {
            const response = await fetch(config.apiUrl + '/Product/UpdateProduct', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: formData
            });

            if (response.status === 200) {
                enqueueSnackbar("Success", { autoHideDuration: 3000, variant: "success" });
                onSuccess?.();
            } else {
                enqueueSnackbar("Something went wrong", { autoHideDuration: 3000, variant: "error" });
            };
        } catch (err: any) {
            enqueueSnackbar(err?.message || "Something went wrong", { autoHideDuration: 3000, variant: "error" });
        } finally {
            setLoading(false);
        };
    };

    return { loading, updateProduct };
};

export default useUpdateProduct;
