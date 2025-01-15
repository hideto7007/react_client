import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignPasswordReset from '../../../pages/money_management/sign_password_reset'
import { useRouter } from 'next/router'
import { ApiClient } from '../../../src/common/apiClient'
import { ErrorResponse, OkResponse } from '../../../src/common/presenter'

// モックを定義
jest.mock('../../../src/common/apiClient')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('SignPasswordReset.tsx', () => {
  const mockPush = jest.fn()
  const mockedApiClient = jest.mocked(ApiClient)

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    mockPush.mockClear()
    mockedApiClient.mockClear()
    mockedApiClient.prototype.callApi.mockClear()
  })

  it('入力フォームのレンダリングチェック', () => {
    render(<SignPasswordReset />)

    const currentPassword = screen.getByLabelText('現在のパスワード')
    expect(currentPassword).toBeInTheDocument()

    const newPassword = screen.getByLabelText('新しいパスワード')
    expect(newPassword).toBeInTheDocument()

    const confirmPasswordInput = screen.getByLabelText('確認パスワード')
    expect(confirmPasswordInput).toBeInTheDocument()

    // 送信ボタンの確認
    const sendButton = screen.getByRole('button', { name: 'send' })
    expect(sendButton).toBeDisabled()
  })

  it('ボタン押下して更新が成功しrouter.push が呼び出される', async () => {
    mockedApiClient.prototype.isOkResponse.mockReturnValue(true)
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 200,
      data: {
        result: 'パスワード更新成功',
      },
    } as OkResponse<string>)

    render(<SignPasswordReset />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'Test123456!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test123456!' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'send' }))
      expect(mockPush).toHaveBeenCalled()
      const result: string[] = mockPush.mock.calls.map((call: any[]) => call[0])
      expect(result.every((r) => r === '/money_management/signin')).toBe(true)
    })
  })

  it('ボタン押して失敗したら、エラーメッセージがセットされる サーバーエラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 500,
      error_data: { error_msg: 'サーバーエラー' },
    } as ErrorResponse)

    render(<SignPasswordReset />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'Test123456!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test123456!' },
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
      error_data: {
        result: [
          {
            field: 'user_password',
            message: 'パスワードが一致しません。',
          },
        ],
      },
    } as ErrorResponse)

    render(<SignPasswordReset />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'Test123456!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test123456!' },
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'send' }))
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

  it('ボタン押して失敗したら、エラーメッセージがセットされる 認証エラー', async () => {
    mockedApiClient.prototype.callApi.mockResolvedValue({
      status: 401,
      error_data: { error_msg: '認証エラー' },
    } as ErrorResponse)

    render(<SignPasswordReset />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'Test12345!' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'Test123456!' },
    })
    fireEvent.change(screen.getByLabelText('確認パスワード'), {
      target: { value: 'Test123456!' },
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
