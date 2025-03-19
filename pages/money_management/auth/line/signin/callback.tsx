/* eslint @typescript-eslint/no-explicit-any: off */
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  TWBox,
  TWCommonCircularProgress,
  TWBackDrop,
  TWToast,
  TWTypography,
} from '@/src/common/component'

import {
  line,
  LINE_SIGNIN_REDIRECT_URL,
} from '@/pages/money_management/auth/ExternalAuth'
import { ApiClient } from '@/src/common/apiClient'
import Common from '@/src/common/common'
import { RequestExternalAuth, SignInToastProps } from '@/src/constants/entity'
import { Utils } from '@/src/utils/utils'
import { UserInfo } from '@/src/constants/presenter'
import { Auth } from '@/src/constants/const'
import { jwtDecode } from 'jwt-decode'

const LineSignInCallback: React.FC = (): JSX.Element => {
  const router = useRouter()
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
        const getToken = await line.getToken(code, LINE_SIGNIN_REDIRECT_URL)

        // jwtDecodeの要素には標準仕様のものしか含まれていない
        // なので、any型にしてフルアクセスできるようにする
        const decoded: any = jwtDecode(getToken.data.id_token)

        if (decoded.email === undefined) {
          const msg = Common.ErrorMsgInfo(
            '認証エラー',
            '対象のLineアカウントにはメールアドレスが登録されていません。'
          )
          setErrorMsg(msg)
          setOpen(true)
          setOverlayOpen(true)
        } else {
          setProgressOpen(true)
          const params: RequestExternalAuth = {
            user_email: decoded.email,
            user_name: decoded.name,
          }

          const res = await api.callApi(
            '/api/line/signin/callback',
            'get',
            params
          )

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

          setProgressOpen(false)
        }
        router.replace(router.pathname, undefined, { shallow: true })
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

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false)
    setOverlayOpen(false)
    router.push('/money_management/signin')
  }

  return (
    <div>
      <TWCommonCircularProgress open={progressOpen} />
      <TWBox
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TWTypography component="h1" variant="h5">
          認証中。。。
        </TWTypography>
      </TWBox>
      <CallbackSignInToast
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
 * @param {SignInToastProps} props - コンポーネントが受け取るprops
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const CallbackSignInToast: React.FC<SignInToastProps> = (
  props: SignInToastProps
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

export default LineSignInCallback
