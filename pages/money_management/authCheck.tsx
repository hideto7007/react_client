import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Auth } from "@/src/common/const";
import { FABackDrop, FABox, FAToast } from "@/src/common/component";
// import { useCookies } from "react-cookie";
import ApiClient from "@/src/common/apiClient";
import Common from "@/src/common/common";

const AuthCheck: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  // const [cookies, setCookie, removeCookie] = useCookies([Auth.RefreshAuthToken]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const api = new ApiClient();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.callApi("/api/refresh_token", "get", {
          user_id: localStorage.getItem(Auth.UserId),
        });
        if (res.status !== 200) {
          const msg = res.data.error_msg;
          setOpen(true);
          setOverlayOpen(true);
          const consoleMsgInfo = Common.ErrorMsgInfo(true, msg);
          setErrorMsg(consoleMsgInfo);
        } else {
          console.log("Response結果:", res.data.result);
        }
      } catch (error) {
        console.error("サーバーエラー：", error);
        const consoleMsgInfo = Common.ErrorMsgInfo(false, error as string);
        setErrorMsg(consoleMsgInfo);
        setOpen(true);
        setOverlayOpen(true);
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
      <FABox sx={{ width: 500 }}>
        <FABackDrop overlayOpen={overlayOpen} />
        <FAToast
          open={open}
          handleClose={handleClose}
          vertical={"top"}
          horizontal={"center"}
          severity={"error"}
          message={errorMsg}
        />
      </FABox>
    </>
  );
};

export default AuthCheck;
