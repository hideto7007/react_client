import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SingIn from '../../../pages/money_management/signin';
import { describe, it, expect } from 'jest';
import { useRouter } from 'next/router';
import ApiClient from '../../../src/common/apiClient';
import React from 'react';


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
        render(<SingIn />)
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
        });

        render(<SingIn />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))

        // `router.push` が呼び出されるかを確認
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/money_management'))
    })

    it('ボタン押して失敗したら、エラーメッセージがセットされる', async() => {
        mockedApiClient.prototype.callApi.mockResolvedValue({
            status: 401,
            data: { error_msg: 'テスト エラー' },
        });

        render(<SingIn />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))

        // `router.push` が呼び出されるかを確認
        await waitFor(() => expect(screen.getByText('テスト エラー')).toBeInTheDocument())
    })

    it('handleClose が呼び出され、トーストが閉じる', async() => {
        mockedApiClient.prototype.callApi.mockResolvedValue({
            status: 401,
            data: { error_msg: 'リフレッシュトークンがありません。再ログインしてください。' },
        });

        render(<SingIn />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }))

        // トーストが表示されることを確認
        const toast = await screen.findByRole('alert');
        expect(toast).toBeInTheDocument();
        expect(toast).toHaveTextContent('リフレッシュトークンがありません。再ログインしてください。');

        // トーストの閉じるボタンを押下
        fireEvent.click(screen.getByRole('button', { name: /×/ }));

        // トーストが非表示になることを確認
        await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    })
})

function expect(emailInput: HTMLElement) {
    throw new Error('Function not implemented.');
}
