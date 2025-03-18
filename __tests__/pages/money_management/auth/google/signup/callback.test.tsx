import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import GoogleSignUpCallback from '../../../../../../pages/money_management/auth/google/signup/callback'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../../../../src/common/apiClient'
import { google } from '../../../../../../pages/money_management/auth/ExternalAuth'
import { Response } from '../../../../../../src/constants/presenter'

// モックを定義
jest.mock('@/src/common/apiClient')
jest.mock('@/pages/money_management/auth/ExternalAuth', () => {
  return {
    google: {
      getToken: jest.fn(),
      getInfo: jest.fn(),
    },
  }
})
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('google/signup/callback.tsx', () => {
  const mockPush = jest.fn()
  const mockReplace = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)
  const mockedGoogleGetToken = google.getToken as jest.Mock
  const mockedGoogleGetInfo = google.getInfo as jest.Mock

  beforeEach(() => {
    mockedApiClient.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
    mockPush.mockClear()
    mockedGoogleGetToken.mockClear()
    mockedGoogleGetInfo.mockClear()
    localStorage.clear()
  })

  it('Google外部認証エラーが発生', async () => {
    // useRouterのモック設定
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { code: 'test-code' },
      replace: mockReplace,
    })

    mockedGoogleGetToken.mockRejectedValue(Error('テストエラー'))

    render(<GoogleSignUpCallback />)

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：Google外部認証エラー')
        })
      ).toBeInTheDocument()
    })

    await waitFor(() => {
      // ボタンを取得してクリック
      const closeButton = screen.getByRole('button', { name: 'Close' })
      fireEvent.click(closeButton)
      // サインイン画面に遷移
      expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
    })

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('既に登録ユーザーが存在し認証が失敗してサインイン画面に遷移する', async () => {
    // useRouterのモック設定
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { code: 'test-code' },
      replace: mockReplace,
    })

    mockedGoogleGetToken.mockResolvedValue({
      data: {
        access_token: 'sample_token',
      },
    } as Response)

    mockedGoogleGetInfo.mockResolvedValue({
      data: {
        email: 'test@example.com',
        name: 'test',
      },
    } as Response)

    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 409,
      data: {
        result: '既に登録ユーザー済みのユーザーです。',
      },
    } as Response)

    render(<GoogleSignUpCallback />)

    await waitFor(() => {
      // 登録メールアドレスを取得しDOMでテキスト取得
      expect(
        screen.getByText((content, element) => {
          return content.includes('test@example.comで新規登録しますか？')
        })
      ).toBeInTheDocument()
      // ボタンを取得してクリック
      fireEvent.click(screen.getByRole('button', { name: '登録して続行' }))
      // エラートースト
      expect(
        screen.getByText((content, element) => {
          return content.includes('既に登録ユーザー済みのユーザーです。')
        })
      ).toBeInTheDocument()
      // ボタンを取得してクリック
      const closeButton = screen.getByRole('button', { name: 'Close' })
      fireEvent.click(closeButton)
      // サインイン画面に遷移
      expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
    })

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('認証が成功してホーム画面に遷移できる', async () => {
    // useRouterのモック設定
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { code: 'test-code' },
      replace: mockReplace,
    })

    mockedGoogleGetToken.mockResolvedValue({
      data: {
        access_token: 'sample_token',
      },
    } as Response)

    mockedGoogleGetInfo.mockResolvedValue({
      data: {
        email: 'test@example.com',
        name: 'test',
      },
    } as Response)

    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 200,
      data: {
        result: {
          user_id: 1,
          user_email: 'test@example.com',
        },
      },
    } as Response)

    render(<GoogleSignUpCallback />)

    await waitFor(() => {
      // 登録メールアドレスを取得しDOMでテキスト取得
      expect(
        screen.getByText((content, element) => {
          return content.includes('test@example.comで新規登録しますか？')
        })
      ).toBeInTheDocument()
      // ボタンを取得してクリック
      fireEvent.click(screen.getByRole('button', { name: '登録して続行' }))
      // ホーム画面に遷移
      expect(mockPush).toHaveBeenCalledWith('/money_management')
    })
  })
})
