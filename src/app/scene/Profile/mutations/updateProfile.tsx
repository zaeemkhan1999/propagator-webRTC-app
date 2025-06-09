import { useState } from "react";
import { fetcher } from "../../../../graphql/fetcher";
import { enqueueSnackbar } from "notistack";

// GraphQL mutation document for updating a user profile
const USER_UPDATE_PROFILE_DOCUMENT = `
  mutation user_updateProfile($input: UserInput) {
    user_updateProfile(input: $input) {
      status
    }
  }
`;

// Define types for the update profile mutation result and variables
export type User_UpdateProfileMutation = {
    user_updateProfile?: {
        status: {
            code: number;
            value: string
        } | null;
    };
};

export interface User_UpdateProfileMutationVariables {
    input: {
        id: number;
        bio: string;
        displayName: string;
        username: string;
        dateOfBirth: string | null;
        imageAddress: string | null;
        cover: string | null;
        location: string;
        gender: string;
        enableTwoFactorAuthentication: boolean;
        linkBio: string;
        phoneNumber: string;
        countryCode: string;
    };
}

// Custom hook
export const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);

    // Function to execute the update profile mutation
    const updateProfile = async (
        variables: User_UpdateProfileMutationVariables,
        onSuccess: () => void
    ) => {
        setLoading(true);

        try {
            const fetchUpdateProfile = fetcher<
                User_UpdateProfileMutation,
                User_UpdateProfileMutationVariables
            >(USER_UPDATE_PROFILE_DOCUMENT, variables);
            await fetchUpdateProfile();
            enqueueSnackbar("Profile updated successfully", { variant: "success", autoHideDuration: 2000 });
            onSuccess();
        } catch (err: any) {
            enqueueSnackbar(err?.message, { variant: "error", autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading };
};
