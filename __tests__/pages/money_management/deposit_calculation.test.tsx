import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DepositCalculation from "../../../pages/money_management/deposit_calculation";
import { useRouter } from "next/router";
import { ApiClient } from "../../../src/common/apiClient";
import { Response, OkResponse } from "../../../src/constants/presenter";
import { Auth } from "../../../src/constants/const";

// モックを定義
jest.mock("../../../src/common/apiClient");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("DepositCalculation.tsx", () => {
  const mockPushCode = jest.fn();
  const mockedApiClientCode = jest.mocked(ApiClient);

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPushCode,
      asPath: "/money_management/deposit_calculation",
    });
    jest.clearAllMocks();
    mockPushCode.mockClear();
    mockedApiClientCode.mockClear();
    mockedApiClientCode.prototype.callApi.mockClear();
  });

  it("計算実行失敗 バリデーションエラー", async () => {
    mockedApiClientCode.prototype.callApi.mockResolvedValue({
      status: 400,
      data: {
        result: [
          {
            field: "bouns",
            message: "ボーナスは整数値のみです。",
          },
        ],
      },
    } as Response);

    render(<DepositCalculation />);

    // ボタンを取得してクリック
    const resultButton = screen.getByRole("button", {
      name: "計算結果",
    });

    await waitFor(() => {
      fireEvent.click(resultButton);
      expect(
        screen.getByText((content) =>
          content.includes("エラー内容：ボーナスは整数値のみです。")
        )
      ).toBeInTheDocument();
    });

    // ボタンを取得してクリック
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    // ステートがリセットされていることを確認
    expect(screen.queryByText("Error message")).not.toBeInTheDocument();
  });

  it("計算実行失敗 サーバーエラー", async () => {
    mockedApiClientCode.prototype.callApi.mockResolvedValue({
      status: 500,
      data: {
        result: "サーバーエラー",
      },
    } as Response);

    render(<DepositCalculation />);

    // ボタンを取得してクリック
    const resultButton = screen.getByRole("button", {
      name: "計算結果",
    });
    await waitFor(() => {
      fireEvent.click(resultButton);
      expect(
        screen.getByText((content) =>
          content.includes("エラー内容：サーバーエラー")
        )
      ).toBeInTheDocument();
    });

    // ボタンを取得してクリック
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    // ステートがリセットされていることを確認
    expect(screen.queryByText("Error message")).not.toBeInTheDocument();
  });

  it("入力フォームでのバリデーションエラーが発生すること", async () => {
    render(<DepositCalculation />);

    const moneyReceived = screen.getByLabelText("手取り") as HTMLInputElement;
    fireEvent.change(moneyReceived, { target: { value: "0123" } });

    // エラーメッセージの出力を検証
    await waitFor(() => {
      expect(screen.getByText("整数を入力してください")).toBeInTheDocument();
    });
  });

  it("各値がクリアできること", async () => {
    render(<DepositCalculation />);

    const moneyReceived = screen.getByLabelText("手取り") as HTMLInputElement;
    const fixedCost = screen.getByLabelText(
      "固定費(家賃、光熱費、通信費、サブスクリプション、積み立て投資など・・・)"
    ) as HTMLInputElement;
    const loan = screen.getByLabelText("ローン(教育、車)") as HTMLInputElement;
    const privateData = screen.getByLabelText(
      "プライベート(自身が自由に使える)"
    ) as HTMLInputElement;
    const insurance = screen.getByLabelText(
      "保険(生命、自動車、任意、火災、保険など・・・・)"
    ) as HTMLInputElement;
    const bonus = screen.getByLabelText(
      "ボーナス(1年の合計又は予測)"
    ) as HTMLInputElement;

    // テスト用に値を入力
    const value: string = "1234";
    fireEvent.change(moneyReceived, { target: { value: value } });
    fireEvent.change(fixedCost, { target: { value: value } });
    fireEvent.change(loan, { target: { value: value } });
    fireEvent.change(privateData, { target: { value: value } });
    fireEvent.change(insurance, { target: { value: value } });
    fireEvent.change(bonus, { target: { value: value } });

    expect(moneyReceived.value).toBe(value);
    expect(fixedCost.value).toBe(value);
    expect(loan.value).toBe(value);
    expect(privateData.value).toBe(value);
    expect(insurance.value).toBe(value);
    expect(bonus.value).toBe(value);

    // 「クリア」ボタンを押す（ボタンのラベルで探す）
    const clearButton = screen.getByRole("button", { name: "クリア" });
    fireEvent.click(clearButton);

    // 各フィールドが "0" に戻っていることを確認
    const result: string = "0";
    expect(moneyReceived.value).toBe(result);
    expect(fixedCost.value).toBe(result);
    expect(loan.value).toBe(result);
    expect(privateData.value).toBe(result);
    expect(insurance.value).toBe(result);
    expect(bonus.value).toBe(result);
  });

  it("正しく計算ができること", async () => {
    mockedApiClientCode.prototype.callApi.mockResolvedValue({
      status: 200,
      data: {
        result: {
          left_amount: 10000,
          total_amount: 120000,
        },
      },
    } as Response);

    render(<DepositCalculation />);

    const moneyReceived = screen.getByLabelText("手取り") as HTMLInputElement;
    const fixedCost = screen.getByLabelText(
      "固定費(家賃、光熱費、通信費、サブスクリプション、積み立て投資など・・・)"
    ) as HTMLInputElement;
    const loan = screen.getByLabelText("ローン(教育、車)") as HTMLInputElement;
    const privateData = screen.getByLabelText(
      "プライベート(自身が自由に使える)"
    ) as HTMLInputElement;
    const insurance = screen.getByLabelText(
      "保険(生命、自動車、任意、火災、保険など・・・・)"
    ) as HTMLInputElement;
    const bonus = screen.getByLabelText(
      "ボーナス(1年の合計又は予測)"
    ) as HTMLInputElement;

    // テスト用に値を入力
    fireEvent.change(moneyReceived, { target: { value: 10000 } });
    fireEvent.change(fixedCost, { target: { value: 4000 } });
    fireEvent.change(loan, { target: { value: 2000 } });
    fireEvent.change(privateData, { target: { value: 2000 } });
    fireEvent.change(insurance, { target: { value: 1000 } });
    fireEvent.change(bonus, { target: { value: 1000 } });

    expect(moneyReceived.value).toBe("10000");
    expect(fixedCost.value).toBe("4000");
    expect(loan.value).toBe("2000");
    expect(privateData.value).toBe("2000");
    expect(insurance.value).toBe("1000");
    expect(bonus.value).toBe("1000");

    const depositCalcButton = screen.getByRole("button", { name: "計算結果" });

    await waitFor(() => {
      fireEvent.click(depositCalcButton);
      expect(
        screen.getByText((content, element) => {
          return content.includes("月々の貯金額 ￥10,000");
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText((content, element) => {
          return content.includes("年間の貯金額 ￥120,000");
        })
      ).toBeInTheDocument();
    });
  });
});
