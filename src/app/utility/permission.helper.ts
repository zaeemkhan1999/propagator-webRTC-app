import { permissionsStore } from "@/store/permissions";
import { useSnapshot } from "valtio";

export const IsPermissionEnable = (type: string) => {
    const perm = useSnapshot(permissionsStore.store).permissions;
    const foundPerm = perm.find(p => p.type === type);
    return foundPerm?.value === 'true';
};
