import React from 'react'
import { AppProps } from 'next/app'
import ToolBar from './money_management/tooolBar' // ツールバーのパスを正しく指定
import AuthCheck from './money_management/authCheck'
import { useRouter } from 'next/router'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter() // ルーターを使って現在のパスを取得

  // signinとsignupのページではAuthCheckを表示しないようにする
  const isAuthPage = router.pathname.includes('sign')

  return (
    <>
      <ToolBar /> {/* どのページでもツールバーを表示 */}
      <Component {...pageProps} /> {/* 各ページのコンポーネントを表示 */}
      {/* signinとsignup以外のページでのみAuthCheckを表示 */}
      {!isAuthPage && <AuthCheck />}
    </>
  )
}

export default MyApp
