import React, { useState } from 'react'
import { useRouter } from 'next/router' // useRouterをインポート
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
  TWCommonCircularProgress,
  ExternalSignButton,
  TWExternalText,
} from '@/src/common/component'
import { useForm, SubmitHandler } from 'react-hook-form'
import { AuthFormProps, RequestTmpSignUpResProps } from '@/src/constants/entity'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { validationRules } from '@/src/common/vaildation'
import { ApiClient } from '@/src/common/apiClient'
import { google, line } from '@/pages/money_management/auth/ExternalAuth'
import { EmailAuthToken } from '@/src/constants/presenter'
import { Auth } from '@/src/constants/const'
import { FcGoogle } from 'react-icons/fc'
import { FaLine } from 'react-icons/fa6'
import { Utils } from '@/src/utils/utils'

/**
 * 仮サインアップコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const TemporarySignUp: React.FC = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<AuthFormProps>({
    mode: 'onChange',
    defaultValues: {
      user_email: '',
      user_password: '',
      confirm_password: '',
      user_name: '',
    },
  })
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const api = new ApiClient()

  // passwordフィールドの値を監視
  const password = watch('user_password')

  const onSubmit: SubmitHandler<AuthFormProps> = async (
    data: AuthFormProps
  ) => {
    const dataReq: RequestTmpSignUpResProps = {
      user_email: data.user_email,
      user_password: data.user_password,
      confirm_password: data.confirm_password,
      user_name: data.user_name,
    }
    setProgressOpen(true)
    const res = await api.callApi('/api/temporary_signup', 'post', dataReq)

    if (res.status !== 200) {
      // エラーレスポンスの場合
      setErrorMsg(Utils.generateErrorMsg(res))
      setProgressOpen(false)
      setOpen(true)
    } else {
      // 成功時のレスポンスの場合
      const emailAuthToken = Utils.typeAssertion<EmailAuthToken>(res)
      localStorage.setItem(Auth.RedisKey, emailAuthToken.redis_key)
      localStorage.setItem(Auth.TmpUserEmail, emailAuthToken.user_email)
      localStorage.setItem(Auth.TmpUserName, emailAuthToken.user_name)
      setProgressOpen(false)
      router.push('/money_management/signup')
    }
  }

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false)
    setOverlayOpen(false)
  }

  const googleHandler = async () => {
    setProgressOpen(true)
    // リダイレクト
    google.signUp()
  }

  const lineHandler = async () => {
    setProgressOpen(true)
    // リダイレクト
    line.signUp()
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
              display: 'flex',
              flexDirection: 'column', // 入力フィールドを縦に並べる
              gap: 2, // 各要素間のスペースを追加
            }}
          >
            {/* UserNameフィールド */}
            <TWTextForm<AuthFormProps>
              name="user_name"
              label="ユーザー名"
              control={control}
              rules={validationRules.UserName}
            />
            {/* Emailフィールド */}
            <TWTextForm<AuthFormProps>
              name="user_email"
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
          <TWExternalText text="サインアップ" />
          <ExternalSignButton
            icon={<FcGoogle />}
            label="Google"
            onClick={googleHandler}
          />
          <TWBox sx={{ mt: 2 }} />
          <ExternalSignButton
            icon={<FaLine />}
            label="Line"
            onClick={lineHandler}
          />
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

export default TemporarySignUp
