import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import LineSignInCallback from '../../../../../../pages/money_management/auth/line/signin/callback'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../../../../src/common/apiClient'
import { line } from '../../../../../../pages/money_management/auth/ExternalAuth'
import { Response } from '../../../../../../src/constants/presenter'
import { jwtDecode } from 'jwt-decode'

// モックを定義
jest.mock('jwt-decode')
jest.mock('@/src/common/apiClient')
jest.mock('@/pages/money_management/auth/ExternalAuth', () => {
  return {
    line: {
      getToken: jest.fn(),
    },
  }
})
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('line/signin/callback.tsx', () => {
  const mockPush = jest.fn()
  const mockedJwtDecode = jest.mocked(jwtDecode)
  const mockReplace = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)
  const mockedLineGetToken = line.getToken as jest.Mock

  beforeEach(() => {
    mockedApiClient.mockClear()
    mockedJwtDecode.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
    mockPush.mockClear()
    mockedLineGetToken.mockClear()
    localStorage.clear()
  })

  it('Line外部認証エラーが発生', async () => {
    // useRouterのモック設定
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { code: 'test-code' },
      replace: mockReplace,
    })

    mockedLineGetToken.mockRejectedValue(Error('テストエラー'))

    render(<LineSignInCallback />)

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：Line外部認証エラー')
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

  it('対象のラインアカウントにメールアドレスが登録されてなく認証失敗してサインイン画面に遷移する', async () => {
    // useRouterのモック設定
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { code: 'test-code' },
      replace: mockReplace,
    })

    mockedLineGetToken.mockResolvedValue({
      data: {
        id_token: 'sample_token',
      },
    } as Response)

    mockedJwtDecode.mockReturnValue({
      name: 'test',
    })

    render(<LineSignInCallback />)

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return content.includes(
            'エラー内容：対象のLineアカウントにはメールアドレスが登録されていません。'
          )
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

  it('認証失敗してサインイン画面に遷移する', async () => {
    // useRouterのモック設定
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { code: 'test-code' },
      replace: mockReplace,
    })

    mockedLineGetToken.mockResolvedValue({
      data: {
        id_token: 'sample_token',
      },
    } as Response)

    mockedJwtDecode.mockReturnValue({
      email: 'test@example.com',
      name: 'test',
    })

    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 401,
      data: {
        result: 'テストエラー',
      },
    } as Response)

    render(<LineSignInCallback />)

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：テストエラー')
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

  it('認証が成功してホーム画面に遷移できる', async () => {
    // useRouterのモック設定
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { code: 'test-code' },
      replace: mockReplace,
    })

    mockedLineGetToken.mockResolvedValue({
      data: {
        id_token: 'sample_token',
      },
    } as Response)

    mockedJwtDecode.mockReturnValue({
      email: 'test@example.com',
      name: 'test',
    })

    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 200,
      data: {
        result: {
          user_id: 1,
          user_email: 'test@example.com',
        },
      },
    } as Response)

    render(<LineSignInCallback />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/money_management')
    })
  })
})
