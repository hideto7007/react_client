import React from 'react';
import { Breadcrumbs, TextForm, PasswordTextForm } from '@/common/component';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AuthFormProps } from '@/common/types';
import { Avatar, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { validationRules } from '@/common/vaildation';

const SignUp: React.FC = () => {
    const { control, handleSubmit, watch, formState: { isValid } } = useForm<AuthFormProps>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
    });

    // passwordフィールドの値を監視
    const password = watch('password');

    const res = {
        // "status": 200,
        "status_code": 400,
        "message": "アカウントが既に登録済みです"
        // "message": "以前登録されたパスワードです"
    }

    const onSubmit: SubmitHandler<AuthFormProps> = (data: AuthFormProps) => {
        console.log(`data: ${JSON.stringify(data)}`);
        if (res.status_code !== 200) {
            alert(res.message)
        }
    };

  return (
    <div>
      <Breadcrumbs />  {/* Include Breadcrumbs at the top */}
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
            <PersonAddIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign Up
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

            {/* confirmPasswordフィールド */}
            <PasswordTextForm
              name="confirmPassword"
              label="確認パスワード"
              control={control}
              rules={validationRules.confirmPassword(password)}
            />
            <Button
              type="submit"
              disabled={!isValid}
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              SIGN UP
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default SignUp;