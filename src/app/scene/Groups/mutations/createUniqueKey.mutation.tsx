// import { useState } from 'react';
// import { fetcher } from '../../../../graphql/fetcher'; // Adjust path as needed
// import { Message_GenerateUniqueKeyForGroupQuery, Message_GenerateUniqueKeyForGroupQueryVariables } from '../../../../types/general';

// // The GraphQL query document for generating a unique key for a group
// const MESSAGE_GENERATE_UNIQUE_KEY_FOR_GROUP_DOCUMENT = `
//   query message_generateUniqueKeyForGroup($groupId: Int!) {
//     message_generateUniqueKeyForGroup(groupId: $groupId) {
//       status
//       result
//     }
//   }
// `;

// // Custom hook for the generate unique key query
// export const useGenerateUniqueKeyForGroupQuery = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [data, setData] = useState<Message_GenerateUniqueKeyForGroupQuery | null>(null);

//   const generateUniqueKey = async (
//     variables: Message_GenerateUniqueKeyForGroupQueryVariables
//   ) => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Call the fetcher function to send the query request
//       const getData = fetcher<
//         Message_GenerateUniqueKeyForGroupQuery,
//         Message_GenerateUniqueKeyForGroupQueryVariables
//       >(MESSAGE_GENERATE_UNIQUE_KEY_FOR_GROUP_DOCUMENT, variables);

//       const result = await getData(); // Wait for the query result

//       setData(result); // Set the result data into state
//     } catch (err: any) {
//       setError(err); // Set error if something goes wrong
//     } finally {
//       setLoading(false); // Stop loading once the query is done
//     }
//   };

//   return { generateUniqueKey, loading, error, data };
// };
