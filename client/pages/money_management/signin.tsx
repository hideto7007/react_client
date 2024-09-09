import Link from 'next/link';
import React from 'react';
import { Breadcrumbs } from '@/common/component';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Signin } from '@/common/types';
import { Avatar, Box, Button, Container, CssBaseline, TextField, Typography, Link as MuiLink } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { validationRules } from '@/common/vaildation';

const Sinin: React.FC = () => {
    const { control, handleSubmit, formState: { isValid } } = useForm<Signin>({
        mode: 'onChange', // ユーザーが入力するたびにバリデーション
        // mode: 'onBlur', // 入力フィールドがフォーカスを失ったときにバリデーション
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<Signin> = (data: Signin) => {
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
            {/* EmailフィールドのController */}
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  error={!!error}
                  helperText={error ? error.message : null}
                  fullWidth
                />
              )}
            />

            {/* PasswordフィールドのController */}
            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Password"
                  error={!!error}
                  autoComplete="current-password"
                  helperText={error ? error.message : null}
                  fullWidth
                />
              )}
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