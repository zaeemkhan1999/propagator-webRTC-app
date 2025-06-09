import { useState } from "react";
import { fetcher } from "../../../../../../graphql/fetcher";
import { useNavigate } from "react-router-dom";
import { userStore } from "@/store/user";
import { permissionsStore } from "@/store/permissions";
import { enqueueSnackbar } from "notistack";

const User_LogOutDocument = `
  mutation user_logOut {
    user_logOut {
      result
      status
    }
  }
`;

type User_LogOutMutation = {
  __typename?: "Mutation";
  user_logOut?: {
    __typename?: "ResponseBaseOfBoolean";
    result: boolean;
    status?: any | null;
  } | null;
};

export const useUser_LogOutMutation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const logOutFetcher = fetcher<User_LogOutMutation, any>(User_LogOutDocument, null);
      await logOutFetcher();
      localStorage.clear();
      userStore.actions.clearUser();
      permissionsStore.actions.clearPermissions();
      navigate("/auth/signin");
    } catch (err: any) {
      enqueueSnackbar(err?.message || "Something went wrong", { autoHideDuration: 3000, variant: "error" })
    } finally {
      setLoading(false);
    }
  };

  return { logOut, loading };
};
