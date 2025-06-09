import { GraphQLClient } from "graphql-request";
import { Client, createClient } from "graphql-ws";
import config from "../config/index.dev";
import { userStore } from "../store/user";

const client = new GraphQLClient(`${config.apiUrl}/graphql`, {
  headers: { "Authorization": `Bearer ${getToken()}` }
});

export let wsClient: Client | null = null;

export function setAuthHeader(idToken: string) {
  client.setHeader("Authorization", `Bearer ${idToken}`);
}

export function getToken() {
  return userStore.store.authentication.access_Token;
}

export function initializeWsClient() {
  const token = getToken();
  wsClient = createClient({
    url: `${config.apiUrl.replace("http", "ws")}/graphql`,
    connectionParams: {
      "Authorization": `Bearer ${token}`,
    },
  });
}

export default client;
