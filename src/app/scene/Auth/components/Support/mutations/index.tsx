import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";
import { useNavigate } from "react-router-dom";
import {
  Exact,
  InputMaybe,
  VerificationRequestInput,
} from "../../../../../../types/general";
import { userStore } from "../../../../../../store/user";

export type VerificationRequest_CreateVerificationRequestMutationVariables =
  Exact<{
    input?: InputMaybe<VerificationRequestInput>;
  }>;

export type VerificationRequest_CreateVerificationRequestMutation = {
  __typename?: "Mutation";
  verificationRequest_CreateVerificationRequest?: {
    __typename?: "ResponseBaseOfVerificationRequest";
    status?: { code: number, value: string } | null;
  } | null;
};

// The GraphQL mutation for creating a verification request
const VerificationRequest_CreateVerificationRequestDocument = `
  mutation verificationRequest_CreateVerificationRequest($input: VerificationRequestInput!) {
    verificationRequest_CreateVerificationRequest(input: $input) {
      status
    }
  }
`;

// TODO: use react-query
export const useVerificationRequest_CreateVerificationRequestMutation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] =
    useState<VerificationRequest_CreateVerificationRequestMutation | null>(
      null
    );

  const createVerificationRequest = async (
    variables: VerificationRequest_CreateVerificationRequestMutationVariables
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Use the fetcher function to perform the GraphQL mutation
      const verificationRequestFetcher = fetcher<
        VerificationRequest_CreateVerificationRequestMutation,
        VerificationRequest_CreateVerificationRequestMutationVariables
      >(VerificationRequest_CreateVerificationRequestDocument, variables);

      const response = await verificationRequestFetcher(); // Execute the mutation
      if (
        response.verificationRequest_CreateVerificationRequest?.status?.code
      ) {
        const isLoggedIn = userStore.store.authentication.status === "loggedIn";
        if (isLoggedIn) {
          navigate("/specter/home");
        } else {
          navigate("/auth/signin");
        }
      }
      setData(response); // Store the response data
    } catch (err: any) {
      setError(err); // Handle errors
    } finally {
      setLoading(false);
    }
  };

  return { createVerificationRequest, loading, error, data };
};
