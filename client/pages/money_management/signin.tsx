import Link from 'next/link';
import React from 'react';
import { Breadcrumbs, TextForm } from '@/common/component';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { SigninProps } from '@/common/types';
import { Avatar, Box, Button, Container, CssBaseline, TextField, Typography, Link as MuiLink } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { validationRules } from '@/common/vaildation';

const Sinin: React.FC = () => {
    const { control, handleSubmit, formState: { isValid } } = useForm<SigninProps>({
        mode: 'onChange', // ユーザーが入力するたびにバリデーション
        // mode: 'onBlur', // 入力フィールドがフォーカスを失ったときにバリデーション
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<SigninProps> = (data: SigninProps) => {
        console.log(`data: ${JSON.stringify(data)}`);
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
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
            <TextForm<SigninProps>
              name="email"
              label="メールアドレス"
              control={control}
              rules={validationRules.email}
            />

            {/* Passwordフィールド */}
            <TextForm<SigninProps>
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

export default Sinin;