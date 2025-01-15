import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignIn from '../../../pages/money_management/signin'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../src/common/apiClient'
import {
  ErrorResponse,
  OkResponse,
  UserInfo,
} from '../../../src/common/presenter'

// モックを定義
jest.mock('@/src/common/apiClient')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Singin.tsx', () => {
  const mockPush = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)

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
    mockedApiClient.prototype.isOkResponse.mockReturnValue(true)
    const res: OkResponse<UserInfo[]> = {
      data: {
        result: [
          {
            user_id: '1',
            user_name: 'test@example.com',
          },
        ],
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

    // `router.push` が呼び出されるかを確認
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))
      expect(mockPush).toHaveBeenCalledWith('/money_management')
    })
  })

  it('Google サインインボタンをクリック', () => {
    render(<SignIn />)
    const googleButton = screen.getByText('Google')
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    fireEvent.click(googleButton)

    expect(window.location.href).toContain('auth/google/signin')
  })

  it('LINE サインインボタンをクリック', () => {
    render(<SignIn />)
    const lineButton = screen.getByText('Line')
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    fireEvent.click(lineButton)

    expect(window.location.href).toContain('auth/line/signin')
  })

  it('クエリパラメータでサインイン成功時にリダイレクト', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/money_management/signin?user_id=1&user_name=test@example.com&sign_type=external',
      },
      writable: true,
    })

    render(<SignIn />)

    expect(localStorage.getItem('user_id')).toBe('1')
    expect(localStorage.getItem('user_name')).toBe('test@example.com')
    expect(mockPush).toHaveBeenCalledWith('/money_management')
  })

  it('クエリパラメータにエラーが含まれる場合', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/money_management/signin?sign_type=external&error=認証エラー',
      },
      writable: true,
    })

    render(<SignIn />)

    expect(
      screen.getByText((content, element) => {
        return content.includes('エラー内容：認証エラー')
      })
    ).toBeInTheDocument()
    expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる サーバーエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 500,
      error_data: { error_msg: 'テスト エラー' },
    } as ErrorResponse)

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
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる 認証エラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 401,
      error_data: { error_msg: 'テスト エラー' },
    } as ErrorResponse)

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
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる バリデーションエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 400,
      error_data: {
        result: [
          {
            field: 'user_password',
            message: 'パスワードが一致しません。',
          },
        ],
      },
    } as ErrorResponse)

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
  })
})
