import React from 'react'

/**
 * パスワード再設定コンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const Custom404: React.FC = (): JSX.Element => {
  return (
    <div>
      <h2>404 - ページが見つかりません</h2>
      <h2>urlが存在しないか、パスが間違っています。</h2>
    </div>
  )
}

export default Custom404
