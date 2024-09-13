import React from 'react';
import { AppProps } from 'next/app';
import ToolBar from './money_management/tooolBar'; // ツールバーのパスを正しく指定

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ToolBar /> {/* どのページでもツールバーを表示 */}
      <Component {...pageProps} /> {/* 各ページのコンポーネントを表示 */}
    </>
  );
};

export default MyApp;
