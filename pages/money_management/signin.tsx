import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router'; // useRouterをインポート
import {
  FATextForm,
  FAPasswordTextForm,
  FAToast,
  FABackDrop,
  FAContainer,
  FACssBaseline,
  FABox,
  FAAvatar,
  FATypography,
  FAButton } from '@/src/common/component';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AuthFormProps, SinginResProps } from '@/src/common/entity';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { validationRules } from '@/src/common/vaildation';
import { Auth } from '@/src/common/const';
import ApiClient from '@/src/common/apiClient';
import Common from '@/src/common/common';

const SignIn: React.FC = () => {
    const { control, handleSubmit, formState: { isValid } } = useForm<AuthFormProps>({
        mode: 'onChange', // ユーザーが入力するたびにバリデーション
        // mode: 'onBlur', // 入力フィールドがフォーカスを失ったときにバリデーション
        defaultValues: {
            user_name: '',
            user_password: '',
        },
    });
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [open, setOpen] = useState(false);
    const [overlayOpen, setOverlayOpen] = useState(false);
    var errorMsgInfo: string;

    const onSubmit: SubmitHandler<AuthFormProps> = async(data: AuthFormProps) => {
      const dataRes: SinginResProps = {
        data: [data]
      }
      const api = new ApiClient()
      const res = await api.callApi("/api/singin", "post", dataRes);
      if (res.status !== 200) {
        if (res.data.error_msg) {
          errorMsgInfo = Common.ErrorMsgInfo(true, res.data.error_msg);
          setErrorMsg(errorMsgInfo);
        } else {
          const msg = res.data.result[0]
          errorMsgInfo = Common.ErrorMsgInfo(true, msg.field, msg.message);
          setErrorMsg(errorMsgInfo);
        }
        setOpen(true);
        setOverlayOpen(true);
      } else {
        localStorage.setItem(Auth.UserId, res.data.result[0].user_id)
        localStorage.setItem(Auth.UserName, res.data.result[0].user_name)
        router.push('/money_management');
      }
    };

    // トーストを閉じる処理
    const handleClose = () => {
      setOpen(false);
      setOverlayOpen(false);
    };

  return (
    <div>
      <FAContainer component='main' maxWidth='xs'>
        <FACssBaseline />
        <FABox
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column', // 縦に並べる設定
            alignItems: 'center',
          }}
        >
          <FAAvatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </FAAvatar>
          <FATypography component='h1' variant='h5'>
            Sign In
          </FATypography>
          <FABox
            component='form'
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 1,
              display: 'flex',
              flexDirection: 'column', // 入力フィールドを縦に並べる
              gap: 2, // 各要素間のスペースを追加
            }}
          >
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
            <FATypography>
                サインアップがまだの場合は
                <Link href="/money_management/signup">こちら</Link>
            </FATypography>
            <FAButton
              type="submit"
              disabled={!isValid}
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              SIGN IN
            </FAButton>
          </FABox>
        </FABox>
      </FAContainer>
      <>
        <FABox sx={{ width: 500 }}>
            <FABackDrop
              overlayOpen={overlayOpen}
            />
            <FAToast
              open={open}
              handleClose={handleClose}
              vertical={'top'}
              horizontal={'center'}
              severity={'error'}
              message={errorMsg}              
            />
        </FABox>
      </>
    </div>
  );
};

export default SignIn;