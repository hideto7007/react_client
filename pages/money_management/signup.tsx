import ApiClient from "@/src/common/apiClient";
import { TWBackDrop, TWBox, TWButton, TWCard, TWCardActions, TWCardContent, TWTextField, TWToast, TWTypography } from "@/src/common/component";
import { Auth } from "@/src/common/const";
import { RequestDataProps, SingUpProps } from "@/src/common/entity";
import Common from "@/src/common/common";
import React, { useRef, useState } from "react";
import { Message } from "@/src/common/message";
import { EmailAuthToken, ValidateError } from "@/src/common/presenter";
import { useRouter } from "next/router";


// const EmailAuth: React.FC = () => {

// };

const SignUp: React.FC = () => {
  const inputNum: number = 4;
  const [code, setCode] = useState<string[]>(Array(inputNum).fill(""));
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successOverlayOpen, setSuccessOverlayOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const router = useRouter();
  const api = new ApiClient();
  let errorMsgInfo: string;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEntryEmail = async(): Promise<void> => {
    const queryList: string[] = [];
    // 表示データの初期化
    queryList.push("redis_key=" + localStorage.getItem(Auth.RedisKey));
    queryList.push("user_name=" + localStorage.getItem(Auth.TmpUserName));
    queryList.push("nick_name=" + localStorage.getItem(Auth.TmpNickName));
    const fullPrames: string = "?" + queryList.join("&");
    const path = "api/retry_auth_email" + fullPrames;

    const res = await api.callApi<EmailAuthToken>(path, "get");

    if ("error_data" in res && res.status !== 200) {
      // エラーレスポンスの場合
      const errorData = res.error_data;
      if ("result" in errorData) {
        // バリデーションエラー
        const validateError = errorData as ValidateError;
        setErrorMsg(Common.ErrorMsgInfoArray(validateError));
      } else {
        if (res.status !== 401 && res.status !== 409) { 
          errorMsgInfo = Common.ErrorMsgInfo(Message.ServerError, errorData.error_msg);
        } else {
          errorMsgInfo = Common.ErrorMsgInfo(Message.AuthError, errorData.error_msg);
        }
        setErrorMsg(errorMsgInfo);
      }
      setOpen(true);
      setOverlayOpen(true);
    } else {
      // 成功時のレスポンスの場合
      if (api.isOkResponse(res)) {
        const emailAuthToken = res.data.result as EmailAuthToken;
        localStorage.setItem(Auth.RedisKey, emailAuthToken.redis_key);
        localStorage.setItem(Auth.TmpUserName, emailAuthToken.user_name);
        localStorage.setItem(Auth.TmpNickName, emailAuthToken.nick_name);
      }
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      let errorMsgInfo: string;
      if (code.every((c) => c !== "")) {
        const authCheck = localStorage.getItem(Auth.RedisKey)?.split(":");
        if (authCheck !== undefined && authCheck[0] === code.join("")) {
          const data: RequestDataProps<SingUpProps[]> = {
            data: [
              {
                redis_key: authCheck.join(":"),
                auth_email_code: code.join(""),
              },
            ],
          };
          const res = await api.callApi<string>("/api/signup", "post", data);

          if ("error_data" in res && res.status !== 200) {
            // エラーレスポンスの場合
            const errorData = res.error_data;
            if ("result" in errorData) {
              // バリデーションエラー
              const validateError = errorData as ValidateError;
              setErrorMsg(Common.ErrorMsgInfoArray(validateError));
            } else {
              if (res.status !== 401 && res.status !== 409) { 
                errorMsgInfo = Common.ErrorMsgInfo(Message.ServerError, errorData.error_msg);
              } else {
                errorMsgInfo = Common.ErrorMsgInfo(Message.AuthError, errorData.error_msg);
              }
              setErrorMsg(errorMsgInfo);
            }
            setOpen(true);
            setOverlayOpen(true);
          } else {
            // 成功時のレスポンスの場合
            setSuccessMsg("認証に成功しました。");
            setSuccessOpen(true);
            setSuccessOverlayOpen(true);
            // 仮登録情報削除
            localStorage.clear();
          }
        } else {
          errorMsgInfo = Common.ErrorMsgInfo(Message.AuthError, "認証コードが一致しません。");
          setErrorMsg(errorMsgInfo);
          setOpen(true);
          setOverlayOpen(true);
          setCode(Array(inputNum).fill(""));
        }
      }
    };
  
    fetchData();
  }, [code]);

  // トーストを閉じる処理
  const successHandleClose = () => {
    setSuccessOpen(false);
    setSuccessOverlayOpen(false);
    router.push("/money_management/signin");
  };

  const handleClose = () => {
    setOpen(false);
    setOverlayOpen(false);
  };

  return (
    <div>
      <TWCard
        sx={{
          maxWidth: 800,
          height: 500,
          margin: "auto",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TWCardContent>
        <br />
          <TWBox
            sx={{
              display: "flex",
              justifyContent: "center", // 水平方向の中央揃え
              alignItems: "center", // 垂直方向の中央揃え
            }}
          >
            <TWTypography
              variant="h4"
            >
              メール認証コード
            </TWTypography>
          </TWBox>
          <br />
          <br />
          <TWBox
            sx={{
              display: "flex",
              justifyContent: "center", // 水平方向の中央揃え
              alignItems: "center", // 垂直方向の中央揃え
            }}
          >
          {[...Array(inputNum)].map((_, i) => (
            <TWTextField
              key={i}
              autoFocus={i === 0}
              value={code[i]}
              type="tel"
              inputRef={(el) => (inputRefs.current[i] = el)}
              sx={{
                width: 50,
                marginRight: 4,
              }}
              onChange={(e) => {
                const newCode = [...code];
                newCode[i] = e.target.value;
                setCode(newCode);

                // 次の入力欄にフォーカス
                if (e.target.value !== "" && i < inputNum - 1) {
                  inputRefs.current[i + 1]?.focus();
                }
              }}
            />
          ))}
          </TWBox>
            <br />
            <br />
          <TWBox
            sx={{
              display: "flex",
              justifyContent: "center", // 水平方向の中央揃え
              alignItems: "center", // 垂直方向の中央揃え
            }}
          >
          <TWTypography
            variant="h6"
            component="div">
              仮サインアップ時に登録したメールアドレスに認証コードを送信しました。
          </TWTypography>
          </TWBox>
          <TWBox
            sx={{
              display: "flex",
              justifyContent: "center", // 水平方向の中央揃え
              alignItems: "center", // 垂直方向の中央揃え
            }}
          >
          <TWTypography
            variant="h6"
            component="div">
            続けるにはコードを入力してください。
          </TWTypography>
          </TWBox>
          </TWCardContent>
          <TWBox
            sx={{
              display: "flex",
              justifyContent: "center", // 水平方向の中央揃え
              alignItems: "center", // 垂直方向の中央揃え
            }}
          >
            <TWButton
              size="large"
              color="primary"
              onClick={handleEntryEmail}
            >コードを再送信</TWButton>
            </TWBox>
          <TWCardActions>
        </TWCardActions>
      </TWCard>
      <>
      <TWBox sx={{ width: 500 }}>
        <TWBackDrop overlayOpen={successOverlayOpen} />
        <TWToast
          open={successOpen}
          handleClose={successHandleClose}
          vertical={"top"}
          horizontal={"center"}
          severity={"success"}
          message={successMsg}
        />
      </TWBox>
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
  </div>
  );
};

export default SignUp;
