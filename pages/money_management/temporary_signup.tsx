import React, { useState } from "react";
import { useRouter } from "next/router"; // useRouterをインポート
import {
  TWTextForm,
  TWPasswordTextForm,
  TWButton,
  TWContainer,
  TWCssBaseline,
  TWBox,
  TWAvatar,
  TWTypography,
  TWBackDrop,
  TWToast,
} from "@/src/common/component";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthFormProps, TmpSignUpResProps } from "@/src/common/entity";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { validationRules } from "@/src/common/vaildation";
import ApiClient from "@/src/common/apiClient";
import Common from "@/src/common/common";
import { EmailAuthToken, ValidateError } from "@/src/common/presenter";
import { Message } from "@/src/common/message";
import { Auth } from "@/src/common/const";

const TemporarySignUp: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<AuthFormProps>({
    mode: "onChange",
    defaultValues: {
      user_name: "",
      user_password: "",
      confirm_password: "",
      nick_name: "",
    },
  });
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  let errorMsgInfo: string;

  // passwordフィールドの値を監視
  const password = watch("user_password");

  const onSubmit: SubmitHandler<AuthFormProps> = async (
    data: AuthFormProps,
  ) => {
    const dataRes: TmpSignUpResProps = {
      data: [data],
    };
    const api = new ApiClient();
    const res = await api.callApi<EmailAuthToken>("/api/temporay_signup", "post", dataRes);

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
      router.push("/money_management/signup");
    }
  };

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false);
    setOverlayOpen(false);
  };

  return (
    <div>
      <TWContainer component="main" maxWidth="xs">
        <TWCssBaseline />
        <TWBox
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column", // 縦に並べる設定
            alignItems: "center",
          }}
        >
          <TWAvatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddIcon />
          </TWAvatar>
          <TWTypography component="h1" variant="h5">
            仮サインアップ
          </TWTypography>
          <TWBox
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column", // 入力フィールドを縦に並べる
              gap: 2, // 各要素間のスペースを追加
            }}
          >
            {/* Emailフィールド */}
            <TWTextForm<AuthFormProps>
              name="nick_name"
              label="ニックネーム"
              control={control}
              rules={validationRules.nickName}
            />
            {/* Emailフィールド */}
            <TWTextForm<AuthFormProps>
              name="user_name"
              label="メールアドレス"
              control={control}
              rules={validationRules.email}
            />

            {/* Passwordフィールド */}
            <TWPasswordTextForm
              name="user_password"
              label="パスワード"
              control={control}
              rules={validationRules.password}
            />

            {/* confirmPasswordフィールド */}
            <TWPasswordTextForm
              name="confirm_password"
              label="確認パスワード"
              control={control}
              rules={validationRules.confirmPassword(password)}
            />
            <TWButton
              type="submit"
              disabled={!isValid}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              SIGN UP
            </TWButton>
          </TWBox>
        </TWBox>
      </TWContainer>
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
    </div>
  );
};

export default TemporarySignUp;
