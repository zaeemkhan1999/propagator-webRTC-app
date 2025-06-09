import { userStore } from "@/store/user";
import { UserTypes } from "@/types/user.type";
import { useSnapshot } from "valtio";

const useIsSuperAdminAndIsProfessionalAccount = () => {
    const user = useSnapshot(userStore.store).user;
    return [(user?.userTypes === UserTypes.SuperAdmin) || false, user?.professionalAccount || false];
}

export default useIsSuperAdminAndIsProfessionalAccount;
