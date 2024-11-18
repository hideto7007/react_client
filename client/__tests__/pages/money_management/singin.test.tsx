import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SingIn from '../../../pages/money_management/signin';
import test, { beforeEach, describe, it } from 'node:test';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import ApiClient from '../../../src/common/apiClient';


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
        expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
        expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'SIGN IN' })).toBeDisabled();
    })
})