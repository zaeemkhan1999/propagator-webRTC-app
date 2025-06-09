import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";

export type SecurityQuestion_GetSecurityQuestionsQuery = {
  __typename?: "Query";
  securityQuestion_getSecurityQuestions?: {
    __typename?: "ListResponseBaseOfSecurityQuestion";
    status?: { code: number, value: string } | null;
    result?: {
      __typename?: "SecurityQuestionCollectionSegment";
      totalCount: number;
      items?: Array<{
        __typename?: "SecurityQuestion";
        id: number;
        question?: string | null;
      } | null> | null;
    } | null;
  } | null;
};

// The security questions query
const SecurityQuestion_GetSecurityQuestionsDocument = `
  query SecurityQuestion_getSecurityQuestions {
    securityQuestion_getSecurityQuestions {
      result {
        totalCount
        items {
          question
          id
          isDeleted
          createdDate
          lastModifiedDate
        }
      }
      status
    }
  }
`;

// TODO: use react-query
export const useSecurityQuestion_GetSecurityQuestionsQuery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] =
    useState<SecurityQuestion_GetSecurityQuestionsQuery | null>(null);

  const fetchSecurityQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the fetcher function to perform the GraphQL query
      const securityQuestionsFetcher = fetcher<SecurityQuestion_GetSecurityQuestionsQuery, undefined>(SecurityQuestion_GetSecurityQuestionsDocument);

      let response = await securityQuestionsFetcher(); // Execute the fetcher
      const questions = response.securityQuestion_getSecurityQuestions?.result?.items?.map((el: any) => ({
        ...el,
        value: el?.question,
        label: el?.question,
      }));

      if (response.securityQuestion_getSecurityQuestions?.result) {
        response.securityQuestion_getSecurityQuestions.result.items = questions;
        setData(response); // Store the response data
      }
    } catch (err: any) {
      setError(err); // Handle the error
    } finally {
      setLoading(false);
    }
  };

  return { fetchSecurityQuestions, loading, error, data };
};
