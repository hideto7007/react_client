/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TemporarySignUp from '../../../pages/money_management/temporary_signup'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../src/common/apiClient'
import { Response } from '../../../src/constants/presenter'
import { google, line } from '../../../pages/money_management/auth/ExternalAuth'

// モックを定義
jest.mock('@/src/common/apiClient')
jest.mock('@/pages/money_management/auth/ExternalAuth', () => {
  return {
    google: {
      signUp: jest.fn(),
    },
    line: {
      signUp: jest.fn(),
    },
  }
})
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('TemporarySignUp.tsx', () => {
  const mockPush = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)
  const mockedGoogleSignUp = google.signUp as jest.Mock
  const mockedLineSignUp = line.signUp as jest.Mock

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    mockPush.mockClear()
    mockedApiClient.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
  })

  it('サインアップ 入力フォームのレンダリングチェック', () => {
    render(<TemporarySignUp />)

    // ユーザー名入力フィールドの確認
    const nikcNameInput = screen.getByLabelText('ユーザー名')
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
    } as Response)

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ユーザー名'), {
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
      const result: string[] = mockPush.mock.calls.map((call: any[]) => call[0])
      expect(result.every((r) => r === '/money_management/signup')).toBe(true)
    })
  })

  it('Google サインアップボタンをクリック', () => {
    render(<TemporarySignUp />)
    mockedGoogleSignUp.mockImplementation(() => {})
    const googleButton = screen.getByText('Google')
    fireEvent.click(googleButton)

    expect(mockedGoogleSignUp).toHaveBeenCalled()
  })

  it('LINE サインアップボタンをクリック', () => {
    render(<TemporarySignUp />)
    mockedLineSignUp.mockImplementation(() => {})
    const lineButton = screen.getByText('Line')
    fireEvent.click(lineButton)

    expect(mockedLineSignUp).toHaveBeenCalled()
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる コンフリクトエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 409,
      data: { result: '既に登録されたメールアドレスです。' },
    } as Response)

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ユーザー名'), {
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
      data: { result: 'サーバーエラー' },
    } as Response)

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ユーザー名'), {
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

    render(<TemporarySignUp />)

    fireEvent.change(screen.getByLabelText('ユーザー名'), {
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
    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })
})
