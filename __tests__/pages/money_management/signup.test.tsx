import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUp from '../../../pages/money_management/signup'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../src/common/apiClient'
import { Response, OkResponse } from '../../../src/constants/presenter'
import { Auth } from '../../../src/constants/const'

// モックを定義
jest.mock('../../../src/common/apiClient')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('SignUp.tsx コード再送信', () => {
  const mockPushCode = jest.fn()
  const mockedApiClientCode = jest.mocked(ApiClient)
  localStorage.setItem(
    Auth.RedisKey,
    '9876:7ef76a51-6dc2-48ca-a611-b89cba563f1c'
  )
  localStorage.setItem(Auth.TmpUserEmail, 'test_code@example.com')
  localStorage.setItem(Auth.TmpUserName, 'test_code')

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPushCode })
    jest.clearAllMocks()
    mockPushCode.mockClear()
    mockedApiClientCode.mockClear()
    mockedApiClientCode.prototype.callApi.mockClear()
  })

  it('メール再送信ができること', async () => {
    mockedApiClientCode.prototype.callApi.mockResolvedValueOnce({
      status: 200,
      data: {
        result: {
          redis_key: localStorage.getItem(Auth.RedisKey),
          user_email: localStorage.getItem(Auth.TmpUserEmail),
          user_name: localStorage.getItem(Auth.TmpUserName),
        },
      },
    })

    render(<SignUp />)

    // ボタンを取得してクリック
    const codeSendButton = screen.getByRole('button', {
      name: 'コードを再送信',
    })
    fireEvent.click(codeSendButton)
  })

  it('メール再送信が失敗 バリデーションエラー', async () => {
    mockedApiClientCode.prototype.callApi.mockResolvedValueOnce({
      status: 400,
      data: {
        result: [
          {
            field: 'user_email',
            message: 'メールアドレスは必須です。',
          },
        ],
      },
    } as Response<unknown>)

    render(<SignUp />)

    // ボタンを取得してクリック
    const codeSendButton = screen.getByRole('button', {
      name: 'コードを再送信',
    })
    await waitFor(() => {
      fireEvent.click(codeSendButton)
    })

    expect(
      screen.getByText((content) =>
        content.includes('エラー内容：メールアドレスは必須です。')
      )
    ).toBeInTheDocument()

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('メール再送信が失敗 認証エラー', async () => {
    mockedApiClientCode.prototype.callApi.mockResolvedValueOnce({
      status: 401,
      data: {
        error_msg: '認証エラー',
      },
    } as Response<unknown>)

    render(<SignUp />)

    // ボタンを取得してクリック
    const codeSendButton = screen.getByRole('button', {
      name: 'コードを再送信',
    })
    await waitFor(() => {
      fireEvent.click(codeSendButton)
    })

    expect(
      screen.getByText((content) => content.includes('エラー内容：認証エラー'))
    ).toBeInTheDocument()

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('メール再送信が失敗 サーバーエラー', async () => {
    mockedApiClientCode.prototype.callApi.mockResolvedValueOnce({
      status: 500,
      data: {
        error_msg: 'サーバーエラー',
      },
    } as Response<unknown>)

    render(<SignUp />)

    // ボタンを取得してクリック
    const codeSendButton = screen.getByRole('button', {
      name: 'コードを再送信',
    })
    await waitFor(() => {
      fireEvent.click(codeSendButton)
    })

    expect(
      screen.getByText((content) =>
        content.includes('エラー内容：サーバーエラー')
      )
    ).toBeInTheDocument()

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })
})

describe('SignUp.tsx 認証コード', () => {
  const mockPush = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)
  localStorage.setItem(
    Auth.RedisKey,
    '3456:7ef09a51-6dc2-48ba-a611-b89cbd563f1c'
  )
  localStorage.setItem(Auth.TmpUserEmail, 'test@example.com')
  localStorage.setItem(Auth.TmpUserName, 'test')

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    jest.clearAllMocks()
    mockPush.mockClear()
    mockedApiClient.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
  })

  it('サインアップ 認証コード入力欄が4つあること', () => {
    render(<SignUp />)

    // 認証コードの入力フィールドが正しくレンダリングされていることを確認
    const inputFields = screen.getAllByRole('textbox')
    expect(inputFields.length).toBe(4)

    // 再送信ボタンが存在することを確認
    expect(
      screen.getByRole('button', { name: 'コードを再送信' })
    ).toBeInTheDocument()
  })

  it('認証コードの不一致', async () => {
    render(<SignUp />)

    const inputFields = screen.getAllByRole('textbox')
    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } })
    })

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes('エラー内容：認証コードが一致しません。')
        )
      ).toBeInTheDocument()
    })

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('登録処理APIが呼ばれ、成功すること', async () => {
    mockedApiClient.prototype.callApi.mockClear()
    localStorage.setItem(
      Auth.RedisKey,
      '1234:7ef09a51-6dc2-48ba-a611-b89cbd563f1c'
    )
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 200,
      data: {
        result: '認証に成功しました。',
      },
    } as OkResponse<string>)

    render(<SignUp />)

    const inputFields = screen.getAllByRole('textbox')
    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } })
    })

    // サインインページへのリダイレクトを確認
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('認証に成功しました。'))
      ).toBeInTheDocument()
    })

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(mockPush).toHaveBeenCalledWith('/money_management/signin')
  })

  it('登録処理APIでエラーになること バリデーションエラー', async () => {
    mockedApiClient.prototype.callApi.mockClear()
    localStorage.setItem(
      Auth.RedisKey,
      '1234:7ef09a51-6dc2-48ba-a611-b89cbd563f1c'
    )
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 400,
      data: {
        result: [
          {
            field: 'redisキー',
            message: 'redisキーは必須です。',
          },
        ],
      },
    } as Response<unknown>)

    render(<SignUp />)

    const inputFields = screen.getAllByRole('textbox')
    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } })
    })

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes('エラー内容：redisキーは必須です。')
        )
      ).toBeInTheDocument()
    })

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('登録処理APIでエラーになること 認証エラー', async () => {
    mockedApiClient.prototype.callApi.mockClear()
    localStorage.setItem(
      Auth.RedisKey,
      '1234:7ef09a51-6dc2-48ba-a611-b89cbd563f1c'
    )
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 401,
      data: { error_msg: 'Invalid Code' },
    })

    render(<SignUp />)

    const inputFields = screen.getAllByRole('textbox')
    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } })
    })

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes('エラー内容：Invalid Code')
        )
      ).toBeInTheDocument()
    })

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('登録処理APIでエラーになること サーバーエラー', async () => {
    mockedApiClient.prototype.callApi.mockClear()
    localStorage.setItem(
      Auth.RedisKey,
      '1234:7ef09a51-6dc2-48ba-a611-b89cbd563f1c'
    )
    mockedApiClient.prototype.callApi.mockResolvedValueOnce({
      status: 500,
      data: { error_msg: 'サーバーエラー' },
    })

    render(<SignUp />)

    const inputFields = screen.getAllByRole('textbox')
    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } })
    })

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes('エラー内容：サーバーエラー')
        )
      ).toBeInTheDocument()
    })

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // ステートがリセットされていることを確認
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })
})
