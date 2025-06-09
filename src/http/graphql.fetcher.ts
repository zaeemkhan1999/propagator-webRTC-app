import client, { getToken, setAuthHeader } from "./graphql.client";
import { RES_STATUS } from "./constant";
// import { enqueueSnackbar } from "notistack";

type QueryType = {
  res: any;
  args: any;
};

function handleResponse(res: any, resolve: any, reject: any) {
  const success = Object.keys(res).some((key: string) => {
    if (res[key]?.status?.value === RES_STATUS.success) return true;
    else if (res[key]?.value === RES_STATUS.success) return true;
    else return false;
  });

  if (success) {
    resolve(res);
  } else {
    reject(res);
  }
}

export function graphqlFetcher<T extends QueryType>(
  GQL: string,
  args?: T["args"]
) {
  return new Promise<T["res"]>(async (resolve, reject) => {
    try {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }

      const res: any = await client.request(GQL, args);

      const authFail = Object.keys(res).some(
        (key: string) => res[key]?.status === RES_STATUS.unauthorize
      );

      if (authFail) {
        document.location.href = `/${window.location.pathname.split("/")[1]}/signin/`;
        return;
      }

      if (
        "user_GetUser" in res &&
        (res.user_GetUser.result.deactivationDateTime ||
          res.user_GetUser.status === "USER_NOT_FOUND")
      ) {
        document.location.href = `/${window.location.pathname.split("/")[1]}/signin/`;
        return;
      }

      handleResponse(res, resolve, reject);

    } catch (err) {
      console.error("API Request Error:", err);
      // enqueueSnackbar("Something went wrong!", { autoHideDuration: 2500, variant: "error" });
      reject(new Error("Something went wrong!"));
    }
  });
}
