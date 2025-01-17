import { ApiClient } from '@/src/common/apiClient'
import {
  TWBackDrop,
  TWBox,
  TWButton,
  TWCard,
  TWCardActions,
  TWCardContent,
  TWCommonCircularProgress,
  TWTextField,
  TWToast,
  TWTypography,
} from '@/src/common/component'
import { Auth } from '@/src/common/const'
import {
  RequestDataProps,
  SingUpProps,
  EmailAuthProps,
  EmailAuthToastProps,
} from '@/src/common/entity'
import Common from '@/src/common/common'
import React, { useRef, useState } from 'react'
import { Message } from '@/src/common/message'
import { EmailAuthToken } from '@/src/common/presenter'
import { useRouter } from 'next/router'
import { Utils } from '@/src/utils/utils'

/**
 * サインアップコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const SignUp: React.FC = (): JSX.Element => {
  const inputNum: number = 4
  const [code, setCode] = useState<string[]>(Array(inputNum).fill(''))
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [successOverlayOpen, setSuccessOverlayOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const router = useRouter()
  const api = new ApiClient()

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleEntryEmail = async (): Promise<void> => {
    setProgressOpen(true)
    const res = await api.callApi<EmailAuthToken>(
      'api/retry_auth_email',
      'get',
      {
        redis_key: localStorage.getItem(Auth.RedisKey),
        user_name: localStorage.getItem(Auth.TmpUserName),
        nick_name: localStorage.getItem(Auth.TmpNickName),
      }
    )

    if (res.status !== 200) {
      // エラーレスポンスの場合
      setErrorMsg(Utils.generateErrorMsg(res))
      setProgressOpen(false)
      setOpen(true)
    } else {
      // 成功時のレスポンスの場合
      const emailAuthToken = Utils.typeAssertion<EmailAuthToken>(res)
      localStorage.setItem(Auth.RedisKey, emailAuthToken.redis_key)
      localStorage.setItem(Auth.TmpUserName, emailAuthToken.user_name)
      localStorage.setItem(Auth.TmpNickName, emailAuthToken.nick_name)
    }
    setProgressOpen(false)
  }

  React.useEffect(() => {
    const fetchData = async () => {
      let errorMsgInfo: string
      if (code.every((c) => c !== '')) {
        const authCheck = localStorage.getItem(Auth.RedisKey)?.split(':')
        if (authCheck !== undefined && authCheck[0] === code.join('')) {
          const data: RequestDataProps<SingUpProps[]> = {
            data: [
              {
                redis_key: authCheck.join(':'),
                auth_email_code: code.join(''),
              },
            ],
          }
          setProgressOpen(true)
          const res = await api.callApi<string>('/api/signup', 'post', data)

          if (res.status !== 200) {
            // エラーレスポンスの場合
            setErrorMsg(Utils.generateErrorMsg(res))
            setOpen(true)
            setOverlayOpen(true)
            setCode(Array(inputNum).fill(''))
          } else {
            // 成功時のレスポンスの場合
            setSuccessMsg('認証に成功しました。')
            setSuccessOpen(true)
            setSuccessOverlayOpen(true)
            // 仮登録情報削除
            localStorage.clear()
          }
          setProgressOpen(false)
        } else {
          errorMsgInfo = Common.ErrorMsgInfo(
            Message.AuthError,
            '認証コードが一致しません。'
          )
          setErrorMsg(errorMsgInfo)
          setOpen(true)
          setOverlayOpen(true)
          setCode(Array(inputNum).fill(''))
          setIsDisabled(false)
        }
      }
    }

    fetchData()
  }, [code])

  // トーストを閉じる処理
  const successHandleClose = () => {
    setSuccessOpen(false)
    setSuccessOverlayOpen(false)
    router.push('/money_management/signin')
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
          <EmailAuth
            inputNum={inputNum}
            inputRefs={inputRefs}
            code={code}
            setCode={setCode}
            handleEntryEmail={handleEntryEmail}
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
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
 * メール認証コンポーネント
 *
 * @param {EmailAuthProps} props - コンポーネントが受け取るprops
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const EmailAuth: React.FC<EmailAuthProps> = (
  props: EmailAuthProps
): JSX.Element => {
  const {
    inputNum,
    inputRefs,
    code,
    setCode,
    handleEntryEmail,
    isDisabled,
    setIsDisabled,
  } = props

  const sx = {
    display: 'flex',
    justifyContent: 'center', // 水平方向の中央揃え
    alignItems: 'center', // 垂直方向の中央揃え
  }

  return (
    <div>
      <TWBox sx={sx}>
        <TWTypography variant="h4">メール認証コード</TWTypography>
      </TWBox>
      <br />
      <br />
      <TWBox sx={sx}>
        {[...Array(inputNum)].map((_, i) => (
          <TWTextField
            key={i}
            autoFocus={i === 0}
            value={code[i]}
            type="tel"
            inputRef={(el) => (inputRefs.current[i] = el)}
            disabled={isDisabled}
            sx={{
              width: 50,
              marginRight: 4,
            }}
            onChange={(e) => {
              const newCode = [...code]
              newCode[i] = e.target.value
              setCode(newCode)

              // 次の入力欄にフォーカス
              if (e.target.value !== '' && i < inputNum - 1) {
                inputRefs.current[i + 1]?.focus()
              }

              if (i == inputNum - 1) {
                setIsDisabled(true)
              }
            }}
          />
        ))}
      </TWBox>
      <br />
      <br />
      <TWBox sx={sx}>
        <TWTypography variant="h6">
          仮サインアップ時に登録したメールアドレスに認証コードを送信しました。
        </TWTypography>
      </TWBox>
      <TWBox sx={sx}>
        <TWTypography variant="h6">
          続けるにはコードを入力してください。
        </TWTypography>
      </TWBox>
      <TWBox sx={sx}>
        <TWButton size="large" color="primary" onClick={handleEntryEmail}>
          コードを再送信
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

export default SignUp
