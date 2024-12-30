import React, { useState } from "react";
import { useRouter } from "next/router"; // useRouterをインポート
import {
  FATextForm,
  FAPasswordTextForm,
  FAButton,
  FAContainer,
  FACssBaseline,
  FABox,
  FAAvatar,
  FATypography,
  FABackDrop,
  FAToast,
} from "@/src/common/component";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthFormProps, SignUpResProps } from "@/src/common/entity";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { validationRules } from "@/src/common/vaildation";
import ApiClient from "@/src/common/apiClient";
import Common from "@/src/common/common";

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
    // console.log(`data: ${JSON.stringify(data)}`);
    const dataRes: SignUpResProps = {
      data: [data],
    };
    const api = new ApiClient();
    const res = await api.callApi("/api/temporay_signup", "post", dataRes);
    if (res.status !== 200) {
      if (res.data.error_msg) {
        errorMsgInfo = Common.ErrorMsgInfo(true, res.data.error_msg);
        setErrorMsg(errorMsgInfo);
      } else {
        const msg = res.data.result[0];
        errorMsgInfo = Common.ErrorMsgInfo(true, msg.field, msg.message);
        setErrorMsg(errorMsgInfo);
      }
      setOpen(true);
      setOverlayOpen(true);
    } else {
      router.push("signup");
    }
  };

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false);
    setOverlayOpen(false);
  };

  return (
    <div>
      <FAContainer component="main" maxWidth="xs">
        <FACssBaseline />
        <FABox
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column", // 縦に並べる設定
            alignItems: "center",
          }}
        >
          <FAAvatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddIcon />
          </FAAvatar>
          <FATypography component="h1" variant="h5">
            仮サインアップ
          </FATypography>
          <FABox
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
            <FATextForm<AuthFormProps>
              name="nick_name"
              label="ニックネーム"
              control={control}
              rules={validationRules.nickName}
            />
            {/* Emailフィールド */}
            <FATextForm<AuthFormProps>
              name="user_name"
              label="メールアドレス"
              control={control}
              rules={validationRules.email}
            />

            {/* Passwordフィールド */}
            <FAPasswordTextForm
              name="user_password"
              label="パスワード"
              control={control}
              rules={validationRules.password}
            />

            {/* confirmPasswordフィールド */}
            <FAPasswordTextForm
              name="confirm_password"
              label="確認パスワード"
              control={control}
              rules={validationRules.confirmPassword(password)}
            />
            <FAButton
              type="submit"
              disabled={!isValid}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              SIGN UP
            </FAButton>
          </FABox>
        </FABox>
      </FAContainer>
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
    </div>
  );
};

export default TemporarySignUp;
