import { useCallback } from "react";
import { CommonResponse } from "../types/graphql.type";

type HandleResult = {
  req: any;
  res: CommonResponse<any>;
  key: string;
  successMsg?: string;
  failMsg?: string;
  onSuccessCallback?: () => void;
  onFailCallback?: () => void;
};

export function useHandleResult(withSnackbar = false) {
  const handleResult = useCallback(
    ({ req, res, key, onSuccessCallback, onFailCallback }: HandleResult) => {
      if (res[key].result) {
        // if (withSnackbar) enqueueSnackbar(successMsg, { variant: "success" });
        onSuccessCallback?.();

        return { success: true, res, req };
      } else {
        // enqueueSnackbar(failMsg || res?.createConsultation?.message, {
        //   variant: "error",
        // });
        onFailCallback?.();
        return { success: false, res, req };
      }
    },
    [withSnackbar]
  );

  return { handleResult };
}
