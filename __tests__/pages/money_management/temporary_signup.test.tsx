import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TemporarySignUp from '../../../pages/money_management/temporary_signup'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../src/common/apiClient'
import { Response, OkResponse } from '../../../src/common/presenter'

// モックを定義
jest.mock('../../../src/common/apiClient')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('TemporarySignUp.tsx', () => {
  const mockPush = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    mockPush.mockClear()
    mockedApiClient.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
  })

  it('サインアップ 入力フォームのレンダリングチェック', () => {
    render(<TemporarySignUp />)

    // ニックネーム入力フィールドの確認
    const nikcNameInput = screen.getByLabelText('ニックネーム')
    expect(nikcNameInput).toBeInTheDocument()

    // メールアドレス入力フィールドの確認
    const emailInput = screen.getByLabelText('メールアドレス')
    expect(emailInput).toBeInTheDocument()

    // パスワード入力フィールドの確認
    const passwordInput = screen.getByLabelText('パスワード')
    expect(passwordInput).toBeInTheDocument()

    // 確認パスワード入力フィールドの確認
    const confirmPasswordInput = screen.getByLabelText('確認パスワード')
    expect(confirmPasswordInput).toBeInTheDocument()

    // サインアップボタンの確認
    const signUpButton = screen.getByRole('button', { name: 'SIGN UP' })
    expect(signUpButton).toBeDisabled()
  })

  it('ボタン押下して成功したら、router.push が呼び出される', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 200,
      data: {
        result: 'サインアップに成功',
      },
    } as OkResponse<string>)

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ニックネーム'), {
      target: { value: 'test' },
    })
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test12345!' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }))
      expect(mockPush).toHaveBeenCalled()
      // expect(mockPush).toHaveBeenCalledWith('/signin');
      const result: string[] = mockPush.mock.calls.map((call: any[]) => call[0])
      expect(result.every((r) => r === '/money_management/signup')).toBe(true)
    })
  })

  it('Google サインインボタンをクリック', () => {
    render(<TemporarySignUp />)
    const googleButton = screen.getByText('Google')
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    fireEvent.click(googleButton)

    expect(window.location.href).toContain('auth/google/signup')
  })

  it('LINE サインインボタンをクリック', () => {
    render(<TemporarySignUp />)
    const lineButton = screen.getByText('Line')
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    fireEvent.click(lineButton)

    expect(window.location.href).toContain('auth/line/signup')
  })

  it('クエリパラメータでサインイン成功時にリダイレクト', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/money_management/temporary_signup?sign_type=external',
      },
      writable: true,
    })

    render(<TemporarySignUp />)

    expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
  })

  it('クエリパラメータにエラーが含まれる場合', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/money_management/temporary_signup?sign_type=external&error=認証エラー',
      },
      writable: true,
    })

    render(<TemporarySignUp />)

    expect(
      screen.getByText((content, element) => {
        return content.includes('認証エラー')
      })
    ).toBeInTheDocument()
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる コンフリクトエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 409,
      data: { error_msg: '既に登録されたメールアドレスです。' },
    } as Response<unknown>)

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ニックネーム'), {
      target: { value: 'test' },
    })
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test12345!' },
    })

    // `router.push` が呼び出されるかを確認
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes(
            'エラー内容：既に登録されたメールアドレスです。'
          )
        })
      ).toBeInTheDocument()
    })
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる サーバーエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 500,
      data: { error_msg: 'サーバーエラー' },
    } as Response<unknown>)

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ニックネーム'), {
      target: { value: 'test' },
    })
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test12345!' },
    })

    // `router.push` が呼び出されるかを確認
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：サーバーエラー')
        })
      ).toBeInTheDocument()
    })
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
    } as Response<unknown>)

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ニックネーム'), {
      target: { value: 'test' },
    })
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test12345!' },
    })

    // `router.push` が呼び出されるかを確認
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }))
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
