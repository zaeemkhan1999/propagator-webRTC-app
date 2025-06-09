import { proxy, subscribe } from "valtio";
import { persistStore, loadPersistedStore } from "./persistor";
import { UserPermissions } from "@/app/scene/Admin/queries/getPermissions";

type PermissionStoreType = {
    permissions: [] | UserPermissions[];
};

const STORE_KEY = "permissionsStore";

const store = proxy<PermissionStoreType>({
    permissions: []
});

const setPermissions = (p: UserPermissions[] | []) => {
    store.permissions = p;
};

const clearPermissions = () => {
    store.permissions = [];
};

export const permissionsStore = {
    actions: { setPermissions, clearPermissions },
    store,
};

const persistedData = loadPersistedStore(STORE_KEY);
if (persistedData) {
    store.permissions = persistedData.permissions;
}

subscribe(store, () => {
    persistStore(STORE_KEY, store);
});
