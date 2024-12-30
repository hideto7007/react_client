import * as React from "react";
import { alpha } from "@mui/material/styles";
import {
  AvatarProps,
  Box,
  BoxProps,
  CssBaselineProps,
  TextFieldProps,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Button, { ButtonProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  AnnualIncomeManagementData,
  EnhancedTableProps,
  AnnualIncomeManagementKeyNotEdit,
  EnhancedTableToolbarProps,
  editDialogProps,
  Validate,
  TextFormProps,
  PasswordFormProps,
  SideBarProps,
  BreadcrumbsProps,
  FAToastProps,
  FABackdropProps,
  FABoxProps,
} from "@/src/common/entity";
import { columns } from "@/src/common/columns";
import ValidationCheck from "@/src/common/vaildation";
import { Mockresponse } from "@/src/common/data";
import {
  classificationListConst,
  LabelConst,
  pathMap,
} from "@/src/common/const";
import {
  Alert,
  Avatar,
  Backdrop,
  Container,
  ContainerProps,
  CssBaseline,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Snackbar,
  TextField,
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import ApiEndpoint from '@/common/apiEndpoint'

const getIncomeDataFetchData = async (
  startDate: string,
  endDate: string,
  userId: number,
): Promise<AnnualIncomeManagementData[] | undefined> => {
  const queryList: string[] = [];
  queryList.push("start_date=" + startDate);
  queryList.push("end_date=" + endDate);
  queryList.push("user_id=" + userId);
  const fullPrames: string = "?" + queryList.join("&");
  try {
    // const response = await ApiEndpoint.getIncomeData(fullPrames)
    const response = Mockresponse;
    const dataList = response.data.result;

    const res: AnnualIncomeManagementData[] = dataList.map(
      (data: any, idx: number) => ({
        id: idx + 1,
        income_forecast_id: data.IncomeForecastID,
        payment_date: data.PaymentDate.slice(0, 10),
        age: data.Age,
        industry: data.Industry,
        total_amount: data.TotalAmount,
        deduction_amount: data.DeductionAmount,
        take_home_amount: data.TakeHomeAmount,
        update_user: "",
        classification: data.Classification,
        user_id: data.UserID,
      }),
    );

    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
    return undefined;
  }
};

const create = async (
  row: AnnualIncomeManagementData | null,
): Promise<void> => {
  await console.log("create", row);
};

/**
 * reactコンポーネントラップ
 *
 * できる範囲でラップしバージョンアップした際にメンテナンスがしやすくするため
 *
 */
const FABox: React.FC<FABoxProps> = (props) => {
  return <Box {...props} />;
};

const FAButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};

const FACssBaseline: React.FC<CssBaselineProps> = (props) => {
  return <CssBaseline {...props} />;
};

const FATypography: React.FC<TypographyProps> = (props) => {
  return <Typography {...props} />;
};

const FAAvatar: React.FC<AvatarProps> = (props) => {
  return <Avatar {...props} />;
};

const FAContainer: React.FC<ContainerProps> = (props) => {
  return <Container {...props} />;
};

const FATextField: React.FC<TextFieldProps> = (props) => {
  return <TextField {...props} />;
};

/**
 * EnhancedTableHeadコンポーネント
 *
 * テーブルのヘッダーを表示するコンポーネントです。カラムごとのソート機能や全選択機能を提供します。
 *
 * @param {EnhancedTableProps} props - コンポーネントが受け取るprops
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onSelectAllClick - 全選択チェックボックスのクリックイベントハンドラ
 * @param {Order} props.order - 現在のソート順（'asc' または 'desc'）
 * @param {keyof AnnualIncomeManagementKeyNotEdit} props.orderBy - ソートの基準となるカラムのキー
 * @param {number} props.numSelected - 選択された行の数
 * @param {number} props.rowCount - 全行数
 * @param {(event: React.MouseEvent<unknown>, property: keyof AnnualIncomeManagementKeyNotEdit) => void} props.onRequestSort - ソートリクエスト時のイベントハンドラ
 *
 * @returns {JSX.Element} - テーブルのヘッダーを表すJSX要素を返します
 */

const EnhancedTableHead: React.FC<EnhancedTableProps> = (
  props: EnhancedTableProps,
): JSX.Element => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof AnnualIncomeManagementKeyNotEdit) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            padding={column.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <FABox component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </FABox>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

/**
 * EnhancedTableToolbarコンポーネント
 *
 * テーブルのツールバーを表示するコンポーネントです。選択された行の数を表示し、削除ボタンやフィルターボタンを提供します。
 *
 * @param {EnhancedTableToolbarProps} props - コンポーネントが受け取るprops
 * @param {number} props.numSelected - 選択された行の数
 * @param {readonly number[]} props.selected - 選択された行のIDを含む配列
 * @param {AnnualIncomeManagementDeleteData[]} props.data - テーブルの行データ
 * @param {(data: AnnualIncomeManagementDeleteData[], selected: readonly number[]) => void} props.onDelete - 削除時に呼ばれる関数
 * @param {string} props.checkboxLabel - チェックボックスのラベル
 * @param {boolean} props.checked - チェックボックスが選択されているかどうかのフラグ
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onCheckBox - チェックボックスの変更時に呼ばれる関数
 *
 * @returns {JSX.Element} - テーブルのツールバーを表すJSX要素を返します
 */
const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (
  props: EnhancedTableToolbarProps,
): JSX.Element => {
  const {
    numSelected,
    selected,
    data,
    onDelete,
    checkboxLabel,
    checked,
    onCheckBox,
  } = props;
  // const {
  //   numSelected, selected, data, onDelete, checkboxLabel,
  //   onCheckBox } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <FATypography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </FATypography>
      ) : (
        <FATypography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </FATypography>
      )}
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onCheckBox} />}
        // control={<Checkbox onChange={onCheckBox} />}
        label={checkboxLabel}
      />
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(data, selected)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

/**
 * EditDialogコンポーネント
 *
 * @param {editDialogProps} props - コンポーネントが受け取るprops
 * @param {string} props.editDialogLabel - ダイアログのタイトルラベル
 * @param {boolean} props.dialogOpen - ダイアログが開いているかどうかのフラグ
 * @param {AnnualIncomeManagementData | null} props.row - 編集する行のデータ
 * @param {() => void} props.handleClose - ダイアログを閉じるための関数
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const EditDialog: React.FC<editDialogProps> = (
  props: editDialogProps,
): JSX.Element => {
  const { editDialogLabel, dialogOpen, row, handleClose } = props;

  const errorObj = {
    payment_date: null,
    age: null,
    industry: null,
    total_amount: null,
    deduction_amount: null,
    take_home_amount: null,
    classification: null,
  };

  const [editRow, setEditRow] =
    React.useState<AnnualIncomeManagementData | null>(row);
  // 個々でバリデーションエラーを表示させるための状態管理
  const [errors, setErrors] = React.useState<Validate>(errorObj);
  // バリデーションエラーを格納させる状態管理
  const [submitFlag, setSubmitFlag] = React.useState<boolean>(true);

  /**
   * 都度レンダリングして行データをセットする
   */
  React.useEffect(() => {
    if (row) {
      setEditRow(row);
    }
  }, [row]);

  /**
   * 都度レンダリングしてバリデーションチェックを行う
   */
  React.useEffect(() => {
    const allValuesAreNull = Object.values(errors).every(
      (value) => value === null,
    );
    if (allValuesAreNull) {
      setSubmitFlag(true);
    } else {
      setSubmitFlag(false);
    }
  }, [errors]);

  /**
   * 総支給額 - 差引額で手取り額を算出
   * 総支給額又は差引額の状態が変更されるたびに再レンダリングする
   */
  React.useEffect(() => {
    if (editRow) {
      const takeHomeAmount: number =
        Number(editRow.total_amount | 0) - Number(editRow.deduction_amount | 0);
      if (takeHomeAmount !== Number(editRow.take_home_amount)) {
        setEditRow({ ...editRow, take_home_amount: takeHomeAmount });
        const validationError = ValidationCheck.check(
          "take_home_amount",
          takeHomeAmount,
        );
        const validationErrorResult =
          validationError === true ? null : validationError || null;
        setErrors((prev) => ({
          ...prev,
          take_home_amount: validationErrorResult,
        }));
      }
    }
  }, [editRow]);

  /**
   * フィールドのバリデーションと更新
   *
   * @param {keyof AnnualIncomeManagementData} field - カラム名を表す。これは、`AnnualIncomeManagementData`型のキーのいずれかです。
   * @param {string | number | Date} value - 各入力値を表す。
   */
  const handleFieldChange = (
    field: keyof AnnualIncomeManagementData,
    value: string | number | Date,
  ) => {
    let convertedValue: string | number | Date = value;

    // If the field is total_amount or deduction_amount, convert the value to a number
    if (
      field === "total_amount" ||
      field === "deduction_amount" ||
      field === "age" ||
      field === "take_home_amount"
    ) {
      convertedValue = Number(value);
    }
    setEditRow((prev) => (prev ? { ...prev, [field]: convertedValue } : prev));
    validateField(field, convertedValue);
  };

  /**
   * 各入力フォームのバリデーションチェック
   *
   * @param {keyof AnnualIncomeManagementData} field - カラム名を表す。これは、`AnnualIncomeManagementData`型のキーのいずれかです。
   * @param {string | number | Date} value - 各入力値を表す。
   */
  const validateField = (
    field: keyof AnnualIncomeManagementData,
    value: string | number | Date,
  ) => {
    let validationError: string | boolean = true;

    validationError = ValidationCheck.check(field, value);

    const validationErrorResult =
      validationError === true ? null : validationError || null;
    // []付けづにキー名を渡すと、'field'という文字列で渡してしまう
    // []をつければ動的なキー名で渡すことができる

    setErrors((prev) => ({ ...prev, [field]: validationErrorResult }));
  };

  /**
   * フォーム送信
   *
   * @param {AnnualIncomeManagementData | null} editRow - 編集する行データ
   */
  const handleSubmit = async (editRow: AnnualIncomeManagementData | null) => {
    const allValuesAreNull = Object.values(errors).every(
      (value) => value === null,
    );
    if (allValuesAreNull && editRow) {
      // 念の為送信前も型チェック
      Object.entries(editRow).forEach(([key, val]) => {
        if (
          key === "total_amount" ||
          key === "deduction_amount" ||
          key === "age" ||
          key === "take_home_amount"
        ) {
          if (typeof val === "string") {
            (editRow as any)[key] = Number(val);
          }
        }
      });
      await create(editRow);
      handleClose(); // ダイアログを閉じる
    }
  };

  /**
   * createHandleChange - 行データを処理する非同期関数
   *
   * @param {AnnualIncomeManagementData | null} row - 編集する行データ
   */
  const createHandleChange = async (row: AnnualIncomeManagementData | null) => {
    if (row) {
      await create(row);
    }
    handleClose(); // ダイアログを閉じる
  };

  /**
   * editCancel - 編集データをキャンセルして元に戻す
   *
   * @param {AnnualIncomeManagementData} row - 編集する行データ
   */
  const editCancel = (row: AnnualIncomeManagementData | null) => {
    setEditRow(row);
    console.log(row);
    setErrors(errorObj);
    handleClose(); // ダイアログを閉じる
  };

  /**
   * handleFromChange - 入力値を変更を処理する関数
   *
   * @param {string} field - 年齢が変更された時のイベント
   * @param {React.ChangeEvent<HTMLInputElement>} event - 入力フォームの値が変更された時のイベント
   */
  const handleFromChange = (
    field: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (editRow) {
      if (
        field === "age" ||
        field === "total_amount" ||
        field === "deduction_amount"
      ) {
        setEditRow({ ...editRow, [field]: event.target.valueAsNumber });
      } else {
        setEditRow({ ...editRow, [field]: event.target.value });
      }
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{editDialogLabel}</DialogTitle>
        <DialogContent>
          <FABox sx={{ display: "flex", flexWrap: "wrap" }}>
            <div>
              <FATextField
                label={LabelConst.PaymentDate}
                type="date"
                sx={{ m: 1, width: "25ch" }}
                value={editRow?.payment_date || ""}
                onChange={(e) =>
                  handleFieldChange("payment_date", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                error={!!errors.payment_date}
                helperText={errors.payment_date}
              />
              <FATextField
                label={LabelConst.Age}
                type="number"
                sx={{ m: 1, width: "25ch" }}
                value={editRow?.age || ""}
                onChange={(e) => handleFieldChange("age", e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.age}
                helperText={errors.age}
              />
              <FATextField
                label={LabelConst.Industry}
                type="string"
                sx={{ m: 1, width: "25ch" }}
                value={editRow?.industry || ""}
                onChange={(e) => handleFieldChange("industry", e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.industry}
                helperText={errors.industry}
              />
              <FATextField
                label={LabelConst.TotalAmount}
                type="number"
                sx={{ m: 1, width: "25ch" }}
                value={editRow?.total_amount || ""}
                onChange={(e) =>
                  handleFieldChange("total_amount", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                error={!!errors.total_amount}
                helperText={errors.total_amount}
              />
              <FATextField
                label={LabelConst.DeductionAmount}
                type="number"
                sx={{ m: 1, width: "25ch" }}
                value={editRow?.deduction_amount || ""}
                onChange={(e) =>
                  handleFieldChange("deduction_amount", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                error={!!errors.deduction_amount}
                helperText={errors.deduction_amount}
              />
              <FATextField
                label={LabelConst.TakeHomeAmount}
                type="number"
                sx={{ m: 1, width: "25ch" }}
                value={editRow?.take_home_amount || ""}
                InputLabelProps={{ shrink: true }}
                error={!!errors.take_home_amount}
                helperText={errors.take_home_amount}
                disabled
              />
              <FATextField
                label={LabelConst.Classification}
                select
                sx={{ m: 1, width: "25ch" }}
                value={editRow?.classification || ""}
                onChange={(e) =>
                  handleFieldChange("classification", e.target.value)
                }
                error={!!errors.classification}
                helperText={errors.classification}
              >
                {classificationListConst.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FATextField>
            </div>
          </FABox>
        </DialogContent>
        <DialogActions>
          <FAButton onClick={() => editCancel(row)}>キャンセル</FAButton>
          <FAButton
            onClick={() => handleSubmit(editRow)}
            autoFocus
            disabled={!submitFlag}
          >
            変更
          </FAButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

/**
 * Breadcrumbsコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = (props): JSX.Element => {
  // 現在のルート（URL）に関する情報を取得
  const router = useRouter();
  // 各パスセグメントを結合するための変数
  let joinedPath = "";

  return (
    <div className="flex items-center text-sm px-4 w-full">
      {/* ホームページにいない場合のみHomeを表示 */}
      {router.pathname !== "/money_management" ? (
        <Link href="/money_management">たくわえる</Link>
      ) : null}

      {/* 現在のURLを「/」で分割し、各パスセグメントを処理 */}
      {router.asPath
        .split("/")
        .filter((path) => path !== "money_management")
        .map((path, index) => {
          if (path) {
            joinedPath += path + "/";

            // パス名に対応する表示用タイトルを取得
            const title = path === "mypages" ? "マイページ" : path; // パスに対してカスタム名を定義

            return (
              <span key={index} className="flex items-center">
                <span className="mx-1">{" > "}</span>
                {/* 修正：相対パスにする */}
                <Link href={`/money_management/${joinedPath}`}>
                  <span className="text-gray-500 hover:text-gray-600 no-underline">
                    {title}
                  </span>
                </Link>
              </span>
            );
          }
          return null;
        })}
      <FABox sx={{ marginBottom: props.marginBottom }} />
    </div>
  );
};

/**
 * テキストフォームコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const FATextForm = <T extends FieldValues>({
  name,
  label,
  control,
  rules,
  fullWidth,
}: TextFormProps<T>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : null}
          fullWidth={fullWidth}
        />
      )}
    />
  );
};

/**
 * パスワードフォームコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const FAPasswordTextForm: React.FC<PasswordFormProps> = (
  props,
): JSX.Element => {
  const { name, control, rules, label } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <OutlinedInput
              {...field}
              id={name}
              label={label}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {/* エラーメッセージを表示 */}
            {fieldState.error && (
              <FormHelperText sx={{ color: "red" }}>
                {fieldState.error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
};

/**
 * リンク用のコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const LinkBar: React.FC<SideBarProps> = (props): JSX.Element => {
  const { name, link } = props;

  return (
    <Link href={link} passHref>
      <ListItem>
        <ListItemText primary={name} />
      </ListItem>
    </Link>
  );
};

/**
 * Box下側幅固定コンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const BoxLayoutPadding: React.FC<BoxProps> = (props) => {
  return (
    <FABox {...props}>
      {props.children} {/* 子要素を表示 */}
    </FABox>
  );
};

/**
 * トーストコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const FAToast: React.FC<FAToastProps> = (props): JSX.Element => {
  const { open, handleClose, vertical, horizontal, severity, message } = props;

  return (
    <>
      {/* Snackbar コンポーネントでトーストを実装 */}
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          <span dangerouslySetInnerHTML={{ __html: message }} />
        </Alert>
      </Snackbar>
    </>
  );
};

/**
 * 背景をグレーにするオーバーレイコンポーネント
 *
 * @returns {JSX.Element} - ダイアログのJSX要素を返す
 */
const FABackDrop: React.FC<FABackdropProps> = (props): JSX.Element => {
  const { overlayOpen } = props;

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // グレーの背景
      }}
      open={overlayOpen}
    />
  );
};

export {
  getIncomeDataFetchData,
  create,
  FABox,
  FAButton,
  FAContainer,
  FACssBaseline,
  FATypography,
  FAAvatar,
  EnhancedTableHead,
  EnhancedTableToolbar,
  EditDialog,
  Breadcrumbs,
  FATextForm,
  FAPasswordTextForm,
  LinkBar,
  BoxLayoutPadding,
  FAToast,
  FABackDrop,
};
