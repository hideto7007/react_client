import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import LineSignUpCallback from '../../../../../../pages/money_management/auth/line/signup/callback'
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

describe('line/signup/callback.tsx', () => {
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

    render(<LineSignUpCallback />)

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

    render(<LineSignUpCallback />)

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

  it('既に登録ユーザーが存在し認証が失敗してサインイン画面に遷移する', async () => {
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
      status: 409,
      data: {
        result: '既に登録ユーザー済みのユーザーです。',
      },
    } as Response)

    render(<LineSignUpCallback />)

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

  it('lineの認証情報から登録ユーザーが取得できなかった場合、仮サインアップ画面に遷移する', async () => {
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
      email: null,
      name: 'test',
    })

    render(<LineSignUpCallback />)

    await waitFor(() => {
      // 登録メールアドレスを取得できなく認証中のまま
      expect(
        screen.getByText((content, element) => {
          return content.includes('認証中。。。')
        })
      ).toBeInTheDocument()
      // ボタンを取得してクリック
      fireEvent.click(screen.getByRole('button', { name: '戻る' }))
      // 仮サインアップ画面に遷移
      expect(mockPush).toHaveBeenCalledWith(
        '/money_management/temporary_signup'
      )
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

    render(<LineSignUpCallback />)

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
