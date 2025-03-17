import '@/styles/global.css' // スタイルを適用

import React from 'react'
import { AppProps } from 'next/app'
import ToolBar from './money_management/TooolBar'
import Footer from './money_management/Footer'
import AuthCheck from './money_management/AuthCheck'
import { useRouter } from 'next/router'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter() // ルーターを使って現在のパスを取得

  // 除外するパスのキーワードリスト
  const authPaths = ['sign', 'auth', 'google', 'line', 'callback']

  // 現在のパスに上記の単語のいずれかが含まれているかチェック
  const isAuthPage = authPaths.some((path) => router.pathname.includes(path))

  return (
    <div className="wrapper">
      <div className="content">
        {!isAuthPage && <ToolBar />}
        <Component {...pageProps} />
        {!isAuthPage && <AuthCheck />}
      </div>
      <Footer />
    </div>
  )
}

export default MyApp
