import { proxy, subscribe } from "valtio";
import { User } from "../types/util.type";
import { persistStore, loadPersistedStore } from "./persistor";

type UserStoreType = {
  user: User | null;
  authentication: {
    access_Token: string | null;
    refresh_Token: string | null;
    status: "loggedOut" | "loggedIn" | "loggingIn" | "loggingOut";
  };
};

const STORE_KEY = "userStore";

const store = proxy<UserStoreType>({
  user: null,
  authentication: {
    access_Token: null,
    refresh_Token: null,
    status: "loggedOut",
  },
});

const setUser = (userData: User) => {
  store.user = userData;
  store.authentication.status = "loggedIn";
};

const setToken = (
  access_Token: UserStoreType["authentication"]["access_Token"],
  refresh_Token?: UserStoreType["authentication"]["refresh_Token"]
) => {
  store.authentication.access_Token = access_Token;
  if (refresh_Token) {
    store.authentication.refresh_Token = refresh_Token;
  }
};

const clearUser = () => {
  store.user = null;
  store.authentication.status = "loggedOut";
  store.authentication.refresh_Token = null;
  store.authentication.access_Token = null;
};

export const userStore = {
  actions: { setUser, clearUser, setToken },
  store,
};

const persistedData = loadPersistedStore(STORE_KEY);
if (persistedData) {
  store.user = persistedData.user;
  store.authentication = persistedData.authentication;
}

subscribe(store, () => {
  persistStore(STORE_KEY, store);
});
