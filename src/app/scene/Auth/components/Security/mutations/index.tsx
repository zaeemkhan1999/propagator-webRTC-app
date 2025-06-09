import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";
import { useNavigate } from "react-router-dom";
import { Exact, InputMaybe, Scalars } from "../../../../../../types/general";
import { userStore } from "../../../../../../store/user";
import { enqueueSnackbar } from "notistack";

export type User_RegisterUserSecurityAnswerMutation = {
  __typename?: "Mutation";
  user_registerUserSecurityAnswer?: {
    __typename?: "ResponseBaseOfTokens";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "Tokens";
      access_Token?: string | null;
      refresh_Token?: string | null;
    } | null;
  } | null;
};

export type RegisterWithSecurityAnswerInput = {
  answer?: InputMaybe<Scalars["String"]["input"]>;
  questionId: Scalars["Int"]["input"];
};

export type User_RegisterUserSecurityAnswerMutationVariables = Exact<{
  input?: InputMaybe<
    | Array<InputMaybe<RegisterWithSecurityAnswerInput>>
    | InputMaybe<RegisterWithSecurityAnswerInput>
  >;
  username?: InputMaybe<Scalars["String"]["input"]>;
}>;

// The GraphQL mutation for registering user security answers
const User_RegisterUserSecurityAnswerDocument = `
  mutation user_registerUserSecurityAnswer($input: [RegisterWithSecurityAnswerInput!], $username: String!) {
    user_registerUserSecurityAnswer(input: $input, username: $username) {
      status
    }
  }
`;

// TODO: use react-query
export const useUser_RegisterUserSecurityAnswerMutation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const registerUserSecurityAnswer = async (
    variables: User_RegisterUserSecurityAnswerMutationVariables,
    tokens?: { access_Token?: string, refresh_Token?: string }
  ) => {
    setLoading(true);

    try {
      // Use the fetcher function to perform the GraphQL mutation
      const registerUserSecurityAnswerFetcher = fetcher<
        User_RegisterUserSecurityAnswerMutation,
        User_RegisterUserSecurityAnswerMutationVariables
      >(User_RegisterUserSecurityAnswerDocument, variables);

      const response = await registerUserSecurityAnswerFetcher(); // Execute the mutation

      if (
        response?.user_registerUserSecurityAnswer?.status?.code === 1 &&
        tokens?.access_Token &&
        tokens?.refresh_Token
      ) {
        userStore.actions.setToken(tokens.access_Token, tokens.refresh_Token);
        userStore.store.authentication.status = "loggedIn";
        setTimeout(() => navigate("/specter/home", { replace: true }), 200);
      }
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error", autoHideDuration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return { registerUserSecurityAnswer, loading };
};
