import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router'; // useRouterをインポート
import { Breadcrumbs, TextForm, PasswordTextForm } from '@/common/component';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AuthFormProps } from '@/common/types';
import { Avatar, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { validationRules } from '@/common/vaildation';
import { Auth } from '@/common/const';

const SignIn: React.FC = () => {
    const { control, handleSubmit, formState: { isValid } } = useForm<AuthFormProps>({
        mode: 'onChange', // ユーザーが入力するたびにバリデーション
        // mode: 'onBlur', // 入力フィールドがフォーカスを失ったときにバリデーション
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const router = useRouter();

    const res = {
        // "status": 200,
        "status_code": 200,
        "message": "アカウントかパスワードが違います"
    }

    const onSubmit: SubmitHandler<AuthFormProps> = (data: AuthFormProps) => {
        console.log(`data: ${JSON.stringify(data)}`);
        if (res.status_code !== 200) {
            alert(res.message)
        } else {
            localStorage.setItem(Auth.AuthToken, 'dummy_token');
            router.push('/money_management');
        }
    };

  return (
    <div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column', // 縦に並べる設定
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign In
          </Typography>
          <Box
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
            <TextForm<AuthFormProps>
              name="email"
              label="メールアドレス"
              control={control}
              rules={validationRules.email}
            />

            {/* Passwordフィールド */}
            <PasswordTextForm
              name="password"
              label="パスワード"
              control={control}
              rules={validationRules.password}
            />
            <Typography>
                サインアップがまだの場合は
                <Link href="/money_management/signup">こちら</Link>
            </Typography>
            <Button
              type="submit"
              disabled={!isValid}
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              SIGN IN
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default SignIn;