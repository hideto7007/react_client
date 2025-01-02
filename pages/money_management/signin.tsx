import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router"; // useRouterをインポート
import {
  TWTextForm,
  TWPasswordTextForm,
  TWToast,
  TWBackDrop,
  TWContainer,
  TWCssBaseline,
  TWBox,
  TWAvatar,
  TWTypography,
  TWButton,
} from "@/src/common/component";
import { ErrorResponse, UserInfo, ValidateError } from "@/src/common/presenter";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthFormProps, SigninResProps } from "@/src/common/entity";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { validationRules } from "@/src/common/vaildation";
import { Auth } from "@/src/common/const";
import ApiClient from "@/src/common/apiClient";
import Common from "@/src/common/common";
import { Message } from "@/src/common/message";

const SignIn: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AuthFormProps>({
    mode: "onChange", // ユーザーが入力するたびにバリデーション
    // mode: 'onBlur', // 入力フィールドがフォーカスを失ったときにバリデーション
    defaultValues: {
      user_name: "",
      user_password: "",
    },
  });
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  let errorMsgInfo: string;

  const onSubmit: SubmitHandler<AuthFormProps> = async (
    data: AuthFormProps,
  ) => {
    const dataRes: SigninResProps = {
      data: [data],
    };
    const api = new ApiClient();
    const res = await api.callApi<UserInfo[]>("/api/signin", "post", dataRes);

    if (res.status === 404) {
      errorMsgInfo = Common.ErrorMsgInfo(Message.NotFound, Message.NotFoundText);
      setErrorMsg(errorMsgInfo);
      setOpen(true);
      setOverlayOpen(true);
      return;
    }

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
        const userInfo = res.data.result[0] as UserInfo;
        localStorage.setItem(Auth.UserId, userInfo.user_id);
        localStorage.setItem(Auth.UserName, userInfo.user_name);
        router.push("/money_management");
      }
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
            <LockOutlinedIcon />
          </TWAvatar>
          <TWTypography component="h1" variant="h5">
            サインイン
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
            <TWTypography>
              サインアップがまだの場合は
              <Link href="/money_management/temporary_signup">こちら</Link>
            </TWTypography>
            <TWButton
              type="submit"
              disabled={!isValid}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              SIGN IN
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

export default SignIn;
