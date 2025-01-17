import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Auth } from '@/src/common/const'
import { TWBackDrop, TWBox, TWToast } from '@/src/common/component'
import { ApiClient } from '@/src/common/apiClient'
import { Utils } from '@/src/utils/utils'

const AuthCheck: React.FC = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const api = new ApiClient()

  useEffect(() => {
    ;(async () => {
      const res = await api.callApi<string>('/api/refresh_token', 'get', {
        user_id: localStorage.getItem(Auth.UserId),
      })
      if (res.status !== 200) {
        // エラーレスポンスの場合
        setErrorMsg(Utils.generateErrorMsg(res))
        setOpen(true)
        setOverlayOpen(true)
      }
    })()
  }, [router])

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false)
    setOverlayOpen(false)
    router.push('/money_management/signin')
  }

  return (
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
  )
}

export default AuthCheck
