import React, { useState } from 'react'
import {
  TWToast,
  TWBackDrop,
  TWContainer,
  TWCssBaseline,
  TWBox,
  TWAvatar,
  TWTypography,
  TWButton,
  TWCommonCircularProgress,
  TWPasswordUpdateTextForm,
} from '@/src/common/component'
import { useForm, SubmitHandler } from 'react-hook-form'
import { validationRules } from '@/src/common/vaildation'
import {
  EmailAuthToastProps,
  NewPasswordUpdateProps,
  RequestNewPasswordUpdateProps,
} from '@/src/constants/entity'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { ApiClient } from '@/src/common/apiClient'
import { Auth } from '@/src/constants/const'
import { Utils } from '@/src/utils/utils'

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
  } = useForm<NewPasswordUpdateProps>({
    mode: 'onChange',
    defaultValues: {
      new_user_password: '',
      confirm_password: '',
    },
  })
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [successOverlayOpen, setSuccessOverlayOpen] = useState(false)
  const api = new ApiClient()

  // passwordフィールドの値を監視
  const newUserPassword = watch('new_user_password')

  const onSubmit: SubmitHandler<RequestNewPasswordUpdateProps> = async (
    data: RequestNewPasswordUpdateProps
  ) => {
    const url = new URL(location.href)
    const TokenId = url.searchParams.get(Auth.TokenId) || ''
    const dataReq: RequestNewPasswordUpdateProps = {
      token_id: TokenId,
      new_user_password: data.new_user_password,
      confirm_password: data.confirm_password || '',
    }
    setProgressOpen(true)
    const res = await api.callApi('/api/new_password_update', 'put', dataReq)

    if (res.status !== 200) {
      setErrorMsg(Utils.generateErrorMsg(res))
      setProgressOpen(false)
      setOpen(true)
    } else {
      // 成功時のレスポンスの場合
      setProgressOpen(false)
      setSuccessOpen(true)
      setSuccessOverlayOpen(true)
      setSuccessMsg('パスワード更新成功。')
    }
  }

  // トーストを閉じる処理
  const successHandleClose = () => {
    setSuccessOpen(false)
    setSuccessOverlayOpen(false)
    router.push('/money_management/signin')
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
            <WholesaleLine />
            {/* newUserPasswordフィールド */}
            <TWPasswordUpdateTextForm
              name="new_user_password"
              label="新しいパスワード"
              control={control}
              rules={validationRules.password}
            />

            {/* confirmPasswordフィールド */}
            <TWPasswordUpdateTextForm
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
        <EmailAuthToast
          successOverlayOpen={successOverlayOpen}
          successOpen={successOpen}
          successHandleClose={successHandleClose}
          successMsg={successMsg}
          overlayOpen={overlayOpen}
          open={open}
          handleClose={handleClose}
          msg={errorMsg}
        />
      </>
    </div>
  )
}

/**
 * メール認証トーストコンポーネント
 *
 * @param {EmailAuthToastProps} props - コンポーネントが受け取るprops
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const EmailAuthToast: React.FC<EmailAuthToastProps> = (
  props: EmailAuthToastProps
): JSX.Element => {
  const {
    successOverlayOpen,
    successOpen,
    successHandleClose,
    successMsg,
    overlayOpen,
    open,
    handleClose,
    msg,
  } = props
  const vertical = 'top'
  const center = 'center'
  const width = 500

  return (
    <div>
      <TWBox sx={{ width: width }}>
        <TWBackDrop overlayOpen={successOverlayOpen} />
        <TWToast
          open={successOpen}
          handleClose={successHandleClose}
          vertical={vertical}
          horizontal={center}
          severity={'success'}
          message={successMsg}
        />
      </TWBox>
      <TWBox sx={{ width: width }}>
        <TWBackDrop overlayOpen={overlayOpen} />
        <TWToast
          open={open}
          handleClose={handleClose}
          vertical={vertical}
          horizontal={center}
          severity={'error'}
          message={msg}
        />
      </TWBox>
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
