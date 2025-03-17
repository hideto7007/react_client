/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  TWBox,
  TWButton,
  TWBackDrop,
  TWToast,
  TWCommonCircularProgress,
} from '@/src/common/component'

import {
  line,
  LINE_SIGNUP_REDIRECT_URL,
} from '@/pages/money_management/auth/ExternalAuth'
import { ApiClient } from '@/src/common/apiClient'
import { RequestExternalAuth, SignUpToastProps } from '@/src/constants/entity'
import { Utils } from '@/src/utils/utils'
import { Auth } from '@/src/constants/const'
import { UserInfo } from '@/src/constants/presenter'
import Common from '@/src/common/common'
import { jwtDecode } from 'jwt-decode'

const LineSignUpCallback: React.FC = (): JSX.Element => {
  const router = useRouter()
  const [userUserEmail, setUserEmail] = useState<string>('')
  const [userUserName, setUserName] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const api = new ApiClient()

  useEffect(() => {
    const fetchToken = async () => {
      const { code } = router.query
      if (!code) return

      try {
        const res = await line.getToken(code, LINE_SIGNUP_REDIRECT_URL)

        // jwtDecodeの要素には標準仕様のものしか含まれていない
        // なので、any型にしてフルアクセスできるようにする
        const decoded: any = jwtDecode(res.data.id_token)

        if (decoded.email === undefined) {
          const msg = Common.ErrorMsgInfo(
            '認証エラー',
            '対象のLineアカウントにはメールアドレスが登録されていません。'
          )
          setErrorMsg(msg)
          setOpen(true)
          setOverlayOpen(true)
        } else {
          setUserEmail(decoded.email)
          setUserName(decoded.name)

          router.replace(router.pathname, undefined, { shallow: true })
        }
      } catch (error) {
        console.error(error)
        const msg = Common.ErrorMsgInfo('認証エラー', 'Line外部認証エラー')
        setErrorMsg(msg)
        setOpen(true)
        setOverlayOpen(true)
      }
    }

    fetchToken()
  }, [router.query])

  const onExternalAuth = async (email: string, name: string) => {
    setProgressOpen(true)
    const params: RequestExternalAuth = {
      user_email: email,
      user_name: name,
    }

    const res = await api.callApi('/api/line/signup/callback', 'get', params)

    setProgressOpen(false)

    if (res.status !== 200) {
      setErrorMsg(Utils.generateErrorMsg(res))
      setOpen(true)
      setOverlayOpen(true)
    } else {
      // 成功時のレスポンスの場合
      const userInfo = Utils.typeAssertion<UserInfo>(res)
      localStorage.clear()
      localStorage.setItem(Auth.UserId, userInfo.user_id)
      localStorage.setItem(Auth.UserEmail, userInfo.user_email)
      router.push('/money_management')
    }
  }

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false)
    setOverlayOpen(false)
    router.push('/money_management/signin')
  }

  // 認証中に何かしらの不具合が発生した際のボタン
  const onReturn = () => {
    setOpen(false)
    setOverlayOpen(false)
    router.push('/money_management/temporary_signup')
  }

  return (
    <div>
      <TWCommonCircularProgress open={progressOpen} />
      <TWBox
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column', // 縦に並べる設定
          alignItems: 'center',
        }}
      >
        {userUserEmail ? (
          <>
            <p>{userUserEmail}で新規登録しますか？</p>
            <TWButton
              variant="contained"
              onClick={() => onExternalAuth(userUserEmail, userUserName)}
              sx={{
                width: '20%',
                justifyContent: 'center', // コンテンツ全体を左寄せ
                paddingLeft: 2, // 左余白を追加してアイコンを見やすくする
              }}
            >
              登録して続行
            </TWButton>
          </>
        ) : (
          <>
            <p>認証中。。。</p>
            <p>
              画面に認証情報が表示されない場合はお手数ですが最初からやり直してください。
            </p>
            <TWButton
              variant="contained"
              onClick={() => onReturn()}
              sx={{
                width: '5%',
                justifyContent: 'center', // コンテンツ全体を左寄せ
                paddingLeft: 2, // 左余白を追加してアイコンを見やすくする
              }}
            >
              戻る
            </TWButton>
          </>
        )}
      </TWBox>
      <CallbackSignUpToast
        overlayOpen={overlayOpen}
        open={open}
        handleClose={handleClose}
        msg={errorMsg}
      />
    </div>
  )
}

/**
 * トーストコンポーネント
 *
 * @param {SignUpToastProps} props - コンポーネントが受け取るprops
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const CallbackSignUpToast: React.FC<SignUpToastProps> = (
  props: SignUpToastProps
): JSX.Element => {
  const { overlayOpen, open, handleClose, msg } = props
  const vertical = 'top'
  const center = 'center'
  const width = 500

  return (
    <div>
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

export default LineSignUpCallback
