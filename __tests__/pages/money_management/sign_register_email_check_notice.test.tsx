import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignRegisterEmailCheckNotice from '../../../pages/money_management/sign_register_email_check_notice'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../src/common/apiClient'
import { Response, OkResponse } from '../../../src/common/presenter'

// モックを定義
jest.mock('../../../src/common/apiClient')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('SignRegisterEmailCheckNotice.tsx', () => {
  const mockPush = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    mockPush.mockClear()
    mockedApiClient.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
  })

  it('入力フォームのレンダリングチェック', () => {
    render(<SignRegisterEmailCheckNotice />)

    const email = screen.getByLabelText('メールアドレス')
    expect(email).toBeInTheDocument()

    // 送信ボタンの確認
    const sendButton = screen.getByRole('button', { name: 'send' })
    expect(sendButton).toBeDisabled()
  })

  it('ボタン押下して送信成功', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 200,
      data: {
        result: '送信成功',
      },
    } as OkResponse<string>)

    render(<SignRegisterEmailCheckNotice />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'send' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes('送信に成功しました。')
        })
      ).toBeInTheDocument()
    })

    // ボタンを取得してクリック
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる サーバーエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 500,
      data: { error_msg: 'サーバーエラー' },
    } as Response<unknown>)

    render(<SignRegisterEmailCheckNotice />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'send' }))
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
            field: 'user_email',
            message: 'メールアドレスは必須です。',
          },
        ],
      },
    } as Response<unknown>)

    render(<SignRegisterEmailCheckNotice />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'send' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes('【user_email】')
        })
      ).toBeInTheDocument()
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：メールアドレスは必須です。')
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
      data: { error_msg: '認証エラー' },
    } as Response<unknown>)

    render(<SignRegisterEmailCheckNotice />)

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'send' }))
      expect(
        screen.getByText((content, element) => {
          return content.includes('エラー内容：認証エラー')
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
