import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Auth } from "@/src/common/const";
import { TWBackDrop, TWBox, TWToast } from "@/src/common/component";
import { ApiClient } from "@/src/common/apiClient";
import Common from "@/src/common/common";
import { ValidateError } from "@/src/common/presenter";
import { Message } from "@/src/common/message";

const AuthCheck: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  let errorMsgInfo: string;
  const api = new ApiClient();

  useEffect(() => {
    (async () => {
      const res = await api.callApi<string>("/api/refresh_token", "get", {
        user_id: localStorage.getItem(Auth.UserId),
      });
      if ("error_data" in res && res.status !== 200) {
        // エラーレスポンスの場合
        const errorData = res.error_data;
        if ("result" in errorData) {
          // バリデーションエラー
          const validateError = errorData as ValidateError;
          setErrorMsg(Common.ErrorMsgInfoArray(validateError));
        } else {
          if (res.status !== 401 && res.status !== 409) {
            errorMsgInfo = Common.ErrorMsgInfo(
              Message.ServerError,
              errorData.error_msg,
            );
          } else {
            errorMsgInfo = Common.ErrorMsgInfo(
              Message.AuthError,
              errorData.error_msg,
            );
          }
          setErrorMsg(errorMsgInfo);
        }
        setOpen(true);
        setOverlayOpen(true);
      } else {
        // 成功時のレスポンスの場合
        if (api.isOkResponse(res)) {
          const result = res.data.result as string;
          console.log(result);
        }
      }
    })();
  }, [router]);

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false);
    setOverlayOpen(false);
    router.push("/money_management/signin");
  };

  return (
    <>
      <TWBox sx={{ width: 500 }}>
        <TWBackDrop overlayOpen={overlayOpen} />
        <TWToast
          open={open}
          handleClose={handleClose}
          vertical={"top"}
          horizontal={"center"}
          severity={"error"}
          message={errorMsg}
        />
      </TWBox>
    </>
  );
};

export default AuthCheck;
