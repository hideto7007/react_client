import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ToolBar from '../../../pages/money_management/TooolBar'
import { SIDEBARWIDTH } from '../../../pages/money_management/SideBar'

describe('ToolBar Component', () => {
  const open = `width: calc(100% - ${SIDEBARWIDTH}px)`
  const close = 'width: 100%'

  test('ツールバーが正しくレンダリングされる', () => {
    render(<ToolBar />)

    // リンクが正しくレンダリングされていることを確認
    expect(screen.getByText('たくわえる')).toBeInTheDocument()
  })

  test('ツールバーのメニューが正しく開閉すること', () => {
    render(<ToolBar />)

    // メニューボタンを取得
    const menuButton = screen.getByLabelText('menu')

    // 初期状態ではサイドバーは閉じている
    const appBar = screen.getByRole('banner')
    expect(appBar).toHaveStyle(close)

    // メニューボタンをクリックしてサイドバーを開く
    fireEvent.click(menuButton)

    // サイドバーが開いていることを確認
    expect(appBar).toHaveStyle(open)

    // サイドバー外をクリックして閉じる
    const backdrop = document.querySelector('.MuiBackdrop-root')
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    // サイドバーが閉じていることを確認
    expect(appBar).toHaveStyle(close)
  })

  test('ツールバーのアカウントメニューが正しく開閉すること', () => {
    render(<ToolBar />)

    // フェイスボタンを取得
    const faceButton = screen.getByTestId('FaceIcon')

    // 初期状態ではサイドバーは閉じている
    const appBar = screen.getByRole('banner')
    expect(appBar).toHaveStyle(close)

    // フェイスボタンをクリックしてサイドバーを開く
    fireEvent.click(faceButton)

    // サイドバーが開いていることを確認
    expect(appBar).toHaveStyle(open)

    // サイドバー外をクリックして閉じる
    const backdrop = document.querySelector('.MuiBackdrop-root')
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    // サイドバーが閉じていることを確認
    expect(appBar).toHaveStyle(close)
  })
})
