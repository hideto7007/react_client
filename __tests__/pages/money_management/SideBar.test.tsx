import React from 'react'
import { render, screen } from '@testing-library/react'
import { SideBar } from '../../../pages/money_management/SideBar'
import { ClassesProps } from '../../../src/constants/entity'

describe('SideBar Component', () => {
  const mockToggleDrawer = jest.fn() // トグル関数のモック

  const mockProps: ClassesProps = {
    anchor: 'left', // 左側に表示されるように設定
    open: true, // サイドバーを開いた状態に設定
    toggleDrawer: mockToggleDrawer,
    classes: [
      { name: 'Home', link: '/' },
      { name: 'Profile', link: '/profile' },
    ],
  }

  test('サイドバーが正しくレンダリングされる', () => {
    render(<SideBar {...mockProps} />)

    // リンクが正しくレンダリングされていることを確認
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  test('リンクが正しいプロパティでレンダリングされる', () => {
    render(<SideBar {...mockProps} />)

    // 各リンクが正しいプロパティでレンダリングされていることを確認
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')

    const profileLink = screen.getByText('Profile').closest('a')
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute('href', '/profile')
  })
})
