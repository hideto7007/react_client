import React, { useState } from "react";
import {
  Breadcrumbs,
  TWButton,
  TWBox,
  TWTextField,
  TWCard,
  TWCardContent,
  TWTypography,
  TWBackDrop,
  TWToast,
} from "@/src/common/component";
import { ApiClient } from "@/src/common/apiClient";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  RequestDepositCalculation,
  DepositCalculationFormProps,
  WholesaleLineProps,
} from "@/src/constants/entity";
import { validationRules } from "@/src/common/vaildation";
import { Amount } from "@/src/constants/presenter";
import { colors } from "@mui/material";
import { Utils } from "@/src/utils/utils";

const DepositCalculation: React.FC = () => {
  const style = {
    width: "10%",
    justifyContent: "center",
    paddingLeft: 2,
  };
  const api = new ApiClient();
  const DepositData: string = "deposit_data";
  const [amount, setAmount] = useState<Amount>({
    left_amount: 0,
    total_amount: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<RequestDepositCalculation>({
    mode: "onChange",
  });

  React.useEffect(() => {
    const depositDataString = localStorage.getItem(DepositData);
    if (!depositDataString) return;

    const data = JSON.parse(depositDataString);
    setValue("money_received", data.money_received);
    setValue("bouns", data.bouns);
    setValue("fixed_cost", data.fixed_cost);
    setValue("loan", data.loan);
    setValue("private", data.private);
    setValue("insurance", data.insurance);
  }, [setValue]);

  const onSubmit: SubmitHandler<RequestDepositCalculation> = async (data) => {
    localStorage.setItem(DepositData, JSON.stringify(data));
    setProgressOpen(true);
    const res = await api.callApi("/api/price", "get", {
      money_received: data.money_received,
      bouns: data.bouns,
      fixed_cost: data.fixed_cost,
      loan: data.loan,
      private: data.private,
      insurance: data.insurance,
    });

    if (res.status != 200) {
      setErrorMsg(Utils.generateErrorMsg(res));
      setOpen(true);
      setOverlayOpen(true);
    } else {
      setAmount(res.data.result);
    }
    setProgressOpen(false);
  };

  const clear = () => {
    const clearData: RequestDepositCalculation = {
      money_received: 0,
      bouns: 0,
      fixed_cost: 0,
      loan: 0,
      private: 0,
      insurance: 0,
    };
    setValue("money_received", clearData.money_received);
    setValue("bouns", clearData.bouns);
    setValue("fixed_cost", clearData.fixed_cost);
    setValue("loan", clearData.loan);
    setValue("private", clearData.private);
    setValue("insurance", clearData.insurance);
    localStorage.setItem(DepositData, JSON.stringify(clearData));
  };

  // トーストを閉じる処理
  const handleClose = () => {
    setOpen(false);
    setOverlayOpen(false);
  };

  return (
    <div>
      <Breadcrumbs marginBottom="5px" /> {/* パンくずを表示する */}
      <h1>貯金額算出</h1>
      <TWBox
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column", // 入力フィールドを縦に並べる
          gap: 2, // 各要素間のスペースを追加
        }}
      >
        <WholesaleLine name={"月々"} />
        <TWTextNumberForm
          name="money_received"
          label="手取り"
          control={control}
          rules={validationRules.numberCheck}
        />
        <TWTextNumberForm
          name="fixed_cost"
          label="固定費(家賃、光熱費、通信費、サブスクリプション、積み立て投資など・・・)"
          control={control}
          rules={validationRules.numberCheck}
        />
        <TWTextNumberForm
          name="loan"
          label="ローン(教育、車)"
          control={control}
          rules={validationRules.numberCheck}
        />
        <TWTextNumberForm
          name="private"
          label="プライベート(自身が自由に使える)"
          control={control}
          rules={validationRules.numberCheck}
        />
        <WholesaleLine name={"年間"} />
        <TWTextNumberForm
          name="bouns"
          label="ボーナス(1年の合計又は予測)"
          control={control}
          rules={validationRules.numberCheck}
        />
        <TWTextNumberForm
          name="insurance"
          label="保険(生命、自動車、任意、火災、保険など・・・・)"
          control={control}
          rules={validationRules.numberCheck}
        />
        <Stack spacing={2} direction="row">
          <TWButton
            disabled={!isValid}
            type="submit"
            color="success"
            variant="contained"
            sx={style}
          >
            計算結果
          </TWButton>
          <TWButton variant="contained" onClick={() => clear()} sx={style}>
            クリア
          </TWButton>
        </Stack>
      </TWBox>
      <TWCard
        sx={{
          maxWidth: 500,
          height: 120,
          margin: "auto",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00FF00",
        }}
      >
        <TWCardContent>
          <TWBox
            sx={{
              alignItems: "center",
              mt: 1,
              px: 1,
            }}
          >
            <TWTypography component="h3" variant="h5" sx={{ mb: 2 }}>
              月々の貯金額 ￥{amount.left_amount.toLocaleString()}
            </TWTypography>
            <TWTypography component="h3" variant="h5">
              年間の貯金額 ￥{amount.total_amount.toLocaleString()}
            </TWTypography>
          </TWBox>
        </TWCardContent>
      </TWCard>
      <>
        <TWBox sx={{ width: 500 }}>
          <TWBackDrop overlayOpen={overlayOpen} />
          <TWToast
            open={open}
            handleClose={handleClose}
            vertical={"top"}
            horizontal={"center"}
            severity={"error"}
            message={errorMsg}
          />
        </TWBox>
      </>
    </div>
  );
};

/**
 * 収入、支出入力フォームコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const TWTextNumberForm: React.FC<DepositCalculationFormProps> = (
  props
): JSX.Element => {
  const { name, label, control, rules } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={0}
      render={({ field, fieldState }) => (
        <TextField
          type="number"
          {...field}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
        />
      )}
    />
  );
};

/**
 * 仕切り線コンポーネント
 *
 * @param {WholesaleLineProps} props - コンポーネントが受け取るprops
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const WholesaleLine: React.FC<WholesaleLineProps> = (props): JSX.Element => {
  const { name } = props;
  return (
    <TWBox
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        mt: 3,
        mb: 3,
      }}
    >
      <TWBox
        sx={{
          flex: 1,
          borderBottom: "1px solid black",
        }}
      />
      {name}
      <TWBox
        sx={{
          flex: 1,
          borderBottom: "1px solid black",
        }}
      />
    </TWBox>
  );
};

export default DepositCalculation;
