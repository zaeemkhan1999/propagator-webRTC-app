import { useState } from "react";
import { fetcher } from "@/graphql/fetcher";  // Assuming fetcher is correctly defined
import { useSnackbar } from "notistack";

const SWITCH_TO_PROFESSIONAL_MUTATION = `
  mutation user_switchToProfessional {
    user_switchToProfessional {
      result {
        professionalAccount
      }
      status
    }
  }
`;

interface SwitchToProfessionalResponse {
    user_switchToProfessional: {
        result: {
            professionalAccount: boolean;
        };
        status: any;
    };
}

export const useSwitchToProfessional = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const switchToProfessional = async (
        onSuccessCallback?: (professionalAccount: boolean) => void
    ) => {
        setLoading(true);

        try {
            const getData = fetcher<SwitchToProfessionalResponse, {}>(SWITCH_TO_PROFESSIONAL_MUTATION);

            const result = await getData();

            if (result.user_switchToProfessional.status) {
                enqueueSnackbar("Successfully switched to professional account", {
                    variant: "success",
                    autoHideDuration: 2000,
                });

                onSuccessCallback?.(result?.user_switchToProfessional?.result?.professionalAccount);
            } else {
                enqueueSnackbar("Failed to switch to professional account", {
                    variant: "error",
                    autoHideDuration: 2000,
                });
            }
        } catch (err: any) {
            enqueueSnackbar("An error occurred while switching account", {
                variant: "error",
                autoHideDuration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return { switchToProfessional, loading };
};
