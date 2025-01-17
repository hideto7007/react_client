import React from 'react'
import { AppProps } from 'next/app'
import ToolBar from './money_management/tooolBar' // ツールバーのパスを正しく指定
import AuthCheck from './money_management/authCheck'
import { useRouter } from 'next/router'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter() // ルーターを使って現在のパスを取得

  const isAuthPage = router.pathname.includes('sign')

  return (
    <>
      {!isAuthPage && <ToolBar />} {/* 認証画面では表示させないようにする */}
      <Component {...pageProps} /> {/* 各ページのコンポーネントを表示 */}
      {/* signinとsignup以外のページでのみ認証チェックを行う */}
      {!isAuthPage && <AuthCheck />}
    </>
  )
}

export default MyApp
