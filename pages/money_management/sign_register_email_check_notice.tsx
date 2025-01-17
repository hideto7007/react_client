import { SubmitHandler, useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { ApiClient } from '@/src/common/apiClient'
import {
  TWBackDrop,
  TWBox,
  TWTextForm,
  TWButton,
  TWCard,
  TWCardActions,
  TWCardContent,
  TWCommonCircularProgress,
  TWToast,
  TWTypography,
} from '@/src/common/component'
import {
  EmailSendProps,
  EmailAuthToastProps,
  EmailCheckProps,
} from '@/src/common/entity'
import { validationRules } from '@/src/common/vaildation'
import { Response } from '@/src/common/presenter'
import { Utils } from '@/src/utils/utils'

/**
 * 登録済みのメールアドレスチェックし通知するコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const SignRegisterEmailCheckNotice: React.FC = (): JSX.Element => {
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [successOverlayOpen, setSuccessOverlayOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<EmailCheckProps>({
    mode: 'onChange', // ユーザーが入力するたびにバリデーション
    // mode: 'onBlur', // 入力フィールドがフォーカスを失ったときにバリデーション
    defaultValues: {
      user_name: '',
    },
  })
  const api = new ApiClient()

  const handlerResult = (res: Response<string> | Response<unknown>): void => {
    if (res.status !== 200 && !Utils.isOkResponse(res)) {
      setErrorMsg(Utils.generateErrorMsg(res))
      setProgressOpen(false)
      setOpen(true)
    } else {
      // 成功時のレスポンスの場合
      setProgressOpen(false)
      setSuccessOpen(true)
      setSuccessOverlayOpen(true)
      setSuccessMsg('送信に成功しました。')
    }
  }

  const onSubmit: SubmitHandler<EmailCheckProps> = async (
    data: EmailCheckProps
  ): Promise<void> => {
    setProgressOpen(true)
    const res = await api.callApi<string>(
      '/api/register_email_check_notice',
      'get',
      {
        user_name: data.user_name,
      }
    )
    handlerResult(res)
  }

  // トーストを閉じる処理
  const successHandleClose = () => {
    setSuccessOpen(false)
    setSuccessOverlayOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
    setOverlayOpen(false)
  }

  return (
    <div>
      <TWCommonCircularProgress open={progressOpen} />
      <TWCard
        sx={{
          maxWidth: 800,
          height: 500,
          margin: 'auto',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TWCardContent>
          <EmailSend
            handleSubmit={handleSubmit}
            control={control}
            isValid={isValid}
            onSubmit={onSubmit}
          />
        </TWCardContent>
        <br />
        <TWCardActions></TWCardActions>
      </TWCard>
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
 * メール送信コンポーネント
 *
 * @param {EmailSendProps} props - コンポーネントが受け取るprops
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const EmailSend: React.FC<EmailSendProps> = (
  props: EmailSendProps
): JSX.Element => {
  const { handleSubmit, control, isValid, onSubmit } = props

  const sx = {
    display: 'flex',
    justifyContent: 'left', // 水平方向の中央揃え
    alignItems: 'center', // 垂直方向の中央揃え
  }

  return (
    <div>
      <TWBox sx={sx}>
        <TWTypography variant="h5">パスワード再設定</TWTypography>
      </TWBox>
      <br />
      <br />
      <TWTypography>
        たくわえるにサインインするためのパスワードを忘れた場合、以下の入力フォームにご登録いただいてるメールアドレスを入力してください。
        <br />
        入力後、送信することでパスワード再発行のメールを送信いたします。
      </TWTypography>
      <br />
      <br />
      <TWBox
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          mt: 1,
          display: 'flex',
          flexDirection: 'column', // 入力フィールドを縦に並べる
          maxWidth: 500,
          gap: 2, // 各要素間のスペースを追加
          margin: '0 auto', // フォームを中央揃え
        }}
      >
        {/* Emailフィールド */}
        <TWTextForm<EmailCheckProps>
          name="user_name"
          label="メールアドレス"
          control={control}
          rules={validationRules.email}
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

export default SignRegisterEmailCheckNotice
