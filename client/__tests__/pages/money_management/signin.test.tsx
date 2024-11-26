import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../../pages/money_management/signin';
import { useRouter } from 'next/router';
import ApiClient from '../../../src/common/apiClient';
import { ErrorResponse, OkResponse } from '../../../src/common/presenter'


// モックを定義
jest.mock('../../../src/common/apiClient');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


describe('Singin.tsx', () => {
    const mockPush = jest.fn();
    const mockedApiClient = jest.mocked(ApiClient);

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush});
        mockPush.mockClear();
        mockedApiClient.mockClear();
    })

    it('サインイン 入力フォームのレンダリングチェック', () => {
        render(<SignIn />)
        // メールアドレス入力フィールドの確認
        const emailInput = screen.getByLabelText('メールアドレス');
        expect(emailInput).toBeInTheDocument();
      
        // パスワード入力フィールドの確認
        const passwordInput = screen.getByLabelText('パスワード');
        expect(passwordInput).toBeInTheDocument();
      
        // サインインボタンの確認
        const signInButton = screen.getByRole('button', { name: 'SIGN IN' });
        expect(signInButton).toBeDisabled();
    })

    it('ボタン押下して成功したら、router.push が呼び出される', async() => {
        mockedApiClient.prototype.callApi.mockResolvedValue({
            status: 200,
            data: {
              result: [{ user_id: '1', user_name: 'test@example.com' }],
            },
        } as OkResponse);

        render(<SignIn />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'Test12345!' },
        });

        // `router.push` が呼び出されるかを確認
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));
            expect(mockPush).toHaveBeenCalledWith('/money_management')
        })
    })

    it('ボタン押して失敗したら、エラーメッセージがセットされる 1', async() => {
        mockedApiClient.prototype.callApi.mockResolvedValue({
            status: 401,
            data: { error_msg: 'テスト エラー' },
        } as ErrorResponse);

        render(<SignIn />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'Test12345!' },
        });

        // `router.push` が呼び出されるかを確認
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))
            expect(
                screen.getByText((content, element) => {
                    return content.includes('エラー内容：テスト エラー');
                })
            ).toBeInTheDocument();
        })
    })

    it('ボタン押して失敗したら、エラーメッセージがセットされる 2', async() => {
        mockedApiClient.prototype.callApi.mockResolvedValue({
            status: 401,
            data: {
                result: [
                    {
                        field: 'user_password',
                        message: 'パスワードが一致しません。'
                    }
                ]
            },
        } as ErrorResponse);

        render(<SignIn />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'Test12345!' },
        });

        // `router.push` が呼び出されるかを確認
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))
            expect(
                screen.getByText((content, element) => {
                    return content.includes('【user_password】');
                })
            ).toBeInTheDocument();
            expect(
                screen.getByText((content, element) => {
                    return content.includes('エラー内容：パスワードが一致しません。');
                })
            ).toBeInTheDocument();
        })
    })
})
