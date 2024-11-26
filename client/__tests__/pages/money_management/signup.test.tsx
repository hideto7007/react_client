import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../../../pages/money_management/signup';
import { useRouter } from 'next/router';
import ApiClient from '../../../src/common/apiClient';
import { ErrorResponse, OkResponse } from '../../../src/common/presenter'


// モックを定義
jest.mock('../../../src/common/apiClient');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


describe('SignUp.tsx', () => {
    const mockPush = jest.fn();
    const mockedApiClient = jest.mocked(ApiClient);

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush});
        mockPush.mockClear();
        mockedApiClient.mockClear();
    })

    it('サインアップ 入力フォームのレンダリングチェック', () => {
        render(<SignUp />)

        // ニックネーム入力フィールドの確認
        const nikcNameInput = screen.getByLabelText('ニックネーム');
        expect(nikcNameInput).toBeInTheDocument();

        // メールアドレス入力フィールドの確認
        const emailInput = screen.getByLabelText('メールアドレス');
        expect(emailInput).toBeInTheDocument();
      
        // パスワード入力フィールドの確認
        const passwordInput = screen.getByLabelText('パスワード');
        expect(passwordInput).toBeInTheDocument();
      
        // 確認パスワード入力フィールドの確認
        const confirmPasswordInput = screen.getByLabelText('確認パスワード');
        expect(confirmPasswordInput).toBeInTheDocument();
      
        // サインアップボタンの確認
        const signUpButton = screen.getByRole('button', { name: 'SIGN UP' });
        expect(signUpButton).toBeDisabled();
    })

    it('ボタン押下して成功したら、router.push が呼び出される', async() => {
        mockedApiClient.prototype.callApi.mockResolvedValue({
            status: 200,
            data: {
              result: "サインアップに成功",
            },
        } as OkResponse);

        render(<SignUp />);

        fireEvent.change(screen.getByLabelText('ニックネーム'), {
            target: { value: 'test' }
        });
        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'Test12345!' },
        });
        fireEvent.change(screen.getByLabelText('確認パスワード'), {
            target: { value: 'Test12345!' },
        });
    
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }));
            expect(mockPush).toHaveBeenCalled();
            // expect(mockPush).toHaveBeenCalledWith('/signin');
            const result: string[] = mockPush.mock.calls.map((call: any[]) => call[0]);
            expect(result.every((r) => r === 'signin')).toBe(true)
        });
    })

    it('ボタン押して失敗したら、エラーメッセージがセットされる 1', async() => {
        mockedApiClient.prototype.callApi.mockResolvedValue({
            status: 401,
            data: { error_msg: '既に登録されたメールアドレスです。' },
        } as ErrorResponse);

        render(<SignUp />);

        fireEvent.change(screen.getByLabelText('ニックネーム'), {
            target: { value: 'test' }
        });
        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'Test12345!' },
        });
        fireEvent.change(screen.getByLabelText('確認パスワード'), {
            target: { value: 'Test12345!' },
        });

        // `router.push` が呼び出されるかを確認
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }))
            expect(
                screen.getByText((content, element) => {
                    return content.includes('エラー内容：既に登録されたメールアドレスです。');
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

        render(<SignUp />);

        fireEvent.change(screen.getByLabelText('ニックネーム'), {
            target: { value: 'test' }
        });
        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'Test12345!' },
        });
        fireEvent.change(screen.getByLabelText('確認パスワード'), {
            target: { value: 'Test12345!' },
        });

        // `router.push` が呼び出されるかを確認
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }))
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
