import { ApiClient } from '../../../src/common/apiClient'
import { useRouter } from 'next/router'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthCheck from '../../../pages/money_management/AuthCheck'
import { Response, ValidateError } from '../../../src/constants/presenter'

// モックを定義
jest.mock('../../../src/common/apiClient')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('AuthCheck API テスト', () => {
  const mockedApiClient = jest.mocked(ApiClient)
  const mockPush = jest.fn()
  const apiInstance = new ApiClient()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('リフレッシュトークンが成功した場合', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 200,
      data: {
        result: '新しいトークンを取得しました',
      },
    } as Response)

    const res = await apiInstance.callApi('/api/refresh_token', 'get', {
      user_id: '1',
    })

    expect(res.status).toBe(200)
    expect(mockedApiClient.prototype.callApi).toHaveBeenCalledWith(
      '/api/refresh_token',
      'get',
      { user_id: '1' }
    )
    expect(res.data.result).toBe('新しいトークンを取得しました')
  })

  it('リフレッシュトークンがバリデーションエラーの場合', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 400,
      data: {
        result: [
          {
            field: 'user_email',
            message: 'メールアドレスは必須です。',
          },
        ],
      },
    } as Response)

    const res = await apiInstance.callApi('/api/refresh_token', 'get', {
      user_id: '1',
    })

    expect(res.status).toBe(400)
    expect(mockedApiClient.prototype.callApi).toHaveBeenCalledWith(
      '/api/refresh_token',
      'get',
      { user_id: '1' }
    )
    expect(res.data.result[0].message).toBe('メールアドレスは必須です。')
  })

  it('リフレッシュトークンがサーバーエラーの場合', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 500,
      data: {
        result: 'サーバーエラー',
      },
    } as Response)

    const res = await apiInstance.callApi('/api/refresh_token', 'get', {
      user_id: '1',
    })

    expect(res.status).toBe(500)
    expect(mockedApiClient.prototype.callApi).toHaveBeenCalledWith(
      '/api/refresh_token',
      'get',
      { user_id: '1' }
    )
    expect(res.data.result).toBe('サーバーエラー')
  })

  it('トーストが閉じられるとrouter.pushが呼び出される 認証エラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 401,
      data: { result: '認証エラー' },
    } as Response)

    render(<AuthCheck />)

    // トーストのエラーメッセージを確認
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('認証エラー'))
      ).toBeInTheDocument()
    })

    // トーストを閉じるボタンをクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // router.pushが呼び出されることを確認
    expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
  })

  it('トーストが閉じられるとrouter.pushが呼び出される バリデーションエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 400,
      data: {
        result: [
          {
            field: 'user_email',
            message: 'メールアドレスは必須です。',
          },
        ],
      },
    } as Response)

    render(<AuthCheck />)

    // トーストのエラーメッセージを確認
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes('メールアドレスは必須です。')
        )
      ).toBeInTheDocument()
    })

    // トーストを閉じるボタンをクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // router.pushが呼び出されることを確認
    expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
  })

  it('トーストが閉じられるとrouter.pushが呼び出される サーバーエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 500,
      data: { result: 'サーバーエラー' },
    } as Response)

    render(<AuthCheck />)

    // トーストのエラーメッセージを確認
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('サーバーエラー'))
      ).toBeInTheDocument()
    })

    // トーストを閉じるボタンをクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // router.pushが呼び出されることを確認
    expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
  })
})
