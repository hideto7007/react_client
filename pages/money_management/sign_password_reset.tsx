import React, { useState } from 'react'
import {
  TWPasswordTextForm,
  TWToast,
  TWBackDrop,
  TWContainer,
  TWCssBaseline,
  TWBox,
  TWAvatar,
  TWTypography,
  TWButton,
  TWCommonCircularProgress,
} from '@/src/common/component'
import { useForm, SubmitHandler } from 'react-hook-form'
import Common from '@/src/common/common'
import { validationRules } from '@/src/common/vaildation'
import { AuthFormProps, SigninResProps } from '@/src/common/entity'
import { RiLockPasswordLine } from 'react-icons/ri'
import { EmailAuthToken, ValidateError } from '@/src/common/presenter'
import { useRouter } from 'next/router'
import { ApiClient } from '@/src/common/apiClient'
import { Message } from '@/src/common/message'

/**
 * パスワード再設定コンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const SignPasswordReset: React.FC = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<AuthFormProps>({
    mode: 'onChange',
    defaultValues: {
      current_password: '',
      new_user_password: '',
      confirm_password: '',
    },
  })
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  let errorMsgInfo: string
  const api = new ApiClient()

  // passwordフィールドの値を監視
  const newUserPassword = watch('new_user_password')

  const onSubmit: SubmitHandler<AuthFormProps> = async (
    data: AuthFormProps
  ) => {
    const dataRes: SigninResProps = {
      data: [data],
    }
    setProgressOpen(true)
    const res = await api.callApi<EmailAuthToken>(
      '/api/sign_password_reset',
      'post',
      dataRes
    )

    if ('error_data' in res && res.status !== 200) {
      // エラーレスポンスの場合
      const errorData = res.error_data
      if ('result' in errorData) {
        // バリデーションエラー
        const validateError = errorData as ValidateError
        setErrorMsg(Common.ErrorMsgInfoArray(validateError))
      } else {
        if (res.status !== 401 && res.status !== 409) {
          errorMsgInfo = Common.ErrorMsgInfo(
            Message.ServerError,
            errorData.error_msg
          )
        } else {
          errorMsgInfo = Common.ErrorMsgInfo(
            Message.AuthError,
            errorData.error_msg
          )
        }
        setErrorMsg(errorMsgInfo)
      }
      setProgressOpen(false)
      setOpen(true)
      setOverlayOpen(true)
    } else {
      // 成功時のレスポンスの場合
      if (api.isOkResponse(res)) {
        // const emailAuthToken = res.data.result as EmailAuthToken
        // localStorage.setItem(Auth.RedisKey, emailAuthToken.redis_key)
        // localStorage.setItem(Auth.TmpUserName, emailAuthToken.user_name)
        // localStorage.setItem(Auth.TmpNickName, emailAuthToken.nick_name)
        setProgressOpen(false)
        router.push('/money_management/signup')
      }
    }
  }

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false)
    setOverlayOpen(false)
  }

  return (
    <div>
      <TWCommonCircularProgress open={progressOpen} />
      <TWContainer component="main" maxWidth="xs">
        <TWCssBaseline />
        <TWBox
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column', // 縦に並べる設定
            alignItems: 'center',
          }}
        >
          <TWAvatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <RiLockPasswordLine />
          </TWAvatar>
          <TWTypography component="h1" variant="h5">
            パスワード再設定
          </TWTypography>
          <TWBox
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 1,
              display: 'flex',
              flexDirection: 'column', // 入力フィールドを縦に並べる
              gap: 2, // 各要素間のスペースを追加
            }}
          >
            {/* currentPasswordフィールド */}
            <TWPasswordTextForm
              name="current_password"
              label="現在のパスワード"
              control={control}
              rules={validationRules.password}
            />
            <WholesaleLine />
            {/* newUserPasswordフィールド */}
            <TWPasswordTextForm
              name="new_user_password"
              label="新しいパスワード"
              control={control}
              rules={validationRules.password}
            />

            {/* confirmPasswordフィールド */}
            <TWPasswordTextForm
              name="confirm_password"
              label="確認パスワード"
              control={control}
              rules={validationRules.confirmPassword(newUserPassword)}
            />
            <TWButton
              type="submit"
              disabled={!isValid}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              send
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
            vertical={'top'}
            horizontal={'center'}
            severity={'error'}
            message={errorMsg}
          />
        </TWBox>
      </>
    </div>
  )
}

/**
 * 仕切り線コンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const WholesaleLine: React.FC = (): JSX.Element => {
  return (
    <TWBox
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        mt: 3,
        mb: 3,
      }}
    >
      <TWBox
        sx={{
          flex: 1,
          borderBottom: '1px solid black',
        }}
      />
      <TWBox
        sx={{
          flex: 1,
          borderBottom: '1px solid black',
        }}
      />
    </TWBox>
  )
}

export default SignPasswordReset
