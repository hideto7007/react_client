import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignIn from '../../../pages/money_management/signin'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../src/common/apiClient'
import { google, line } from '../../../pages/money_management/auth/ExternalAuth'
import { Response } from '../../../src/constants/presenter'

// モックを定義
jest.mock('@/src/common/apiClient')
jest.mock('@/pages/money_management/auth/ExternalAuth', () => {
  return {
    google: {
      signIn: jest.fn(),
    },
    line: {
      signIn: jest.fn(),
    },
  }
})
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Singin.tsx', () => {
  const mockPush = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)
  const mockedGoogleSignIn = google.signIn as jest.Mock
  const mockedLineSignIn = line.signIn as jest.Mock

  ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  beforeEach(() => {
    mockedApiClient.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
    mockPush.mockClear()
    localStorage.clear()
  })

  it('サインイン 入力フォームのレンダリングチェック', () => {
    render(<SignIn />)
    // メールアドレス入力フィールドの確認
    const emailInput = screen.getByLabelText('メールアドレス')
    expect(emailInput).toBeInTheDocument()

    // パスワード入力フィールドの確認
    const passwordInput = screen.getByLabelText('パスワード')
    expect(passwordInput).toBeInTheDocument()

    // サインインボタンの確認
    const signInButton = screen.getByRole('button', { name: 'SIGN IN' })
    expect(signInButton).toBeDisabled()
  })

  it('ボタン押下して成功したら、router.push が呼び出される', async () => {
    const res: Response = {
      data: {
        result: {
          user_id: '1',
          user_email: 'test@example.com',
        },
      },
      status: 200,
    }
    mockedApiClient.prototype.callApi.mockResolvedValue(res)

    render(<SignIn />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))
      expect(mockPush).toHaveBeenCalledWith('/money_management')
    })
  })

  it('Google サインインボタンをクリック', () => {
    render(<SignIn />)
    mockedGoogleSignIn.mockImplementation(() => {})
    const googleButton = screen.getByText('Google')
    fireEvent.click(googleButton)

    expect(mockedGoogleSignIn).toHaveBeenCalled()
  })

  it('LINE サインインボタンをクリック', () => {
    render(<SignIn />)
    mockedLineSignIn.mockImplementation(() => {})
    const lineButton = screen.getByText('Line')
    fireEvent.click(lineButton)

    expect(mockedLineSignIn).toHaveBeenCalled()
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる サーバーエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 500,
      data: { result: 'テスト エラー' },
    } as Response)

    render(<SignIn />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })

    // `router.push` が呼び出されるかを確認
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：テスト エラー')
        })
      ).toBeInTheDocument()
    })
    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる 認証エラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 401,
      data: { result: 'テスト エラー' },
    } as Response)

    render(<SignIn />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })

    // `router.push` が呼び出されるかを確認
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：テスト エラー')
        })
      ).toBeInTheDocument()
    })
    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる バリデーションエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 400,
      data: {
        result: [
          {
            field: 'user_password',
            message: 'パスワードが一致しません。',
          },
        ],
      },
    } as Response)

    render(<SignIn />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })

    // `router.push` が呼び出されるかを確認
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes('【user_password】')
        })
      ).toBeInTheDocument()
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：パスワードが一致しません。')
        })
      ).toBeInTheDocument()
    })
    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })
})
