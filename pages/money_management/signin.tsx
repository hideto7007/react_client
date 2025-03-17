import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/router' // useRouterをインポート
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
  TWCommonCircularProgress,
  ExternalSignButton,
  TWExternalText,
} from '@/src/common/component'
import { UserInfo } from '@/src/constants/presenter'
import { useForm, SubmitHandler } from 'react-hook-form'
import { AuthFormProps, RequestSigninProps } from '@/src/constants/entity'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { validationRules } from '@/src/common/vaildation'
import { Response } from '@/src/constants/presenter'
import { Auth } from '@/src/constants/const'
import { ApiClient } from '@/src/common/apiClient'
import { google, line } from '@/pages/money_management/auth/ExternalAuth'
import Common from '@/src/common/common'
import { Message } from '@/src/config/message'
import { FcGoogle } from 'react-icons/fc'
import { FaLine } from 'react-icons/fa6'
import { Utils } from '@/src/utils/utils'

const SignIn: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AuthFormProps>({
    mode: 'onChange', // ユーザーが入力するたびにバリデーション
    // mode: 'onBlur', // 入力フィールドがフォーカスを失ったときにバリデーション
    defaultValues: {
      user_email: '',
      user_password: '',
    },
  })
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const api = new ApiClient()

  const handlerResult = (res: Response): void => {
    if (res.status !== 200) {
      setErrorMsg(Utils.generateErrorMsg(res))
      setProgressOpen(false)
      setOpen(true)
      setOverlayOpen(true)
    } else {
      // 成功時のレスポンスの場合
      const userInfo = Utils.typeAssertion<UserInfo>(res)
      localStorage.clear()
      localStorage.setItem(Auth.UserId, userInfo.user_id)
      localStorage.setItem(Auth.UserEmail, userInfo.user_email)
      setProgressOpen(false)
      router.push('/money_management')
    }
  }

  const onSubmit: SubmitHandler<AuthFormProps> = async (
    data: AuthFormProps
  ) => {
    const dataReq: RequestSigninProps = {
      user_email: data.user_email,
      user_password: data.user_password,
    }
    setProgressOpen(true)
    const res = await api.callApi('/api/signin', 'post', dataReq)
    handlerResult(res)
  }

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false)
    setOverlayOpen(false)
  }

  const googleHandler = async () => {
    setProgressOpen(true)
    // リダイレクト
    google.signIn()
  }

  const lineHandler = async () => {
    setProgressOpen(true)
    // リダイレクト
    line.signIn()
  }

  React.useEffect(() => {
    const url = new URL(location.href)

    const userId = url.searchParams.get(Auth.UserId)
    const UserEmail = url.searchParams.get(Auth.UserEmail)
    const signType = url.searchParams.get(Auth.SignType)
    const error = url.searchParams.get(Auth.Error)
    localStorage.clear()

    if (userId && UserEmail && signType) {
      localStorage.setItem(Auth.UserId, userId)
      localStorage.setItem(Auth.UserEmail, UserEmail)
      localStorage.setItem(Auth.SignType, signType)
      setProgressOpen(false)
      router.push('/money_management')
    } else if (error && signType) {
      setErrorMsg(Common.ErrorMsgInfo(Message.ExternalAuthError, error))
      setOpen(true)
      setOverlayOpen(true)
      // ページをリロードする
      router.push('/money_management/signin')
    }
  }, [])

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
              display: 'flex',
              flexDirection: 'column', // 入力フィールドを縦に並べる
              gap: 2, // 各要素間のスペースを追加
            }}
          >
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
            <TWTypography>
              サインアップがまだの場合は
              <Link href="/money_management/temporary_signup">こちら</Link>
            </TWTypography>
            <TWTypography sx={{ fontSize: '0.8rem' }}>
              <Link href="/money_management/sign_register_email_check_notice">
                サインインパスワード忘れた方
              </Link>
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
          <TWExternalText text="サインイン" />
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

export default SignIn
