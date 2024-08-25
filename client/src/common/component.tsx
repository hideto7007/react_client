import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


import {
  AnnualIncomeManagementData,
  EnhancedTableProps, AnnualIncomeManagementKeyNotEdit,
  EnhancedTableToolbarProps, editDialogProps,
  Validate } from '@/common/types'
import { columns } from '@/common/columns';
import ValidationCheck from '@/common/vaildation';
import { Mockresponse } from '@/common/data';
import { classificationListConst, LabelConst } from '@/common/const';
import { MenuItem, TextField } from '@mui/material';
// import ApiEndpoint from '@/common/apiEndpoint'


const getIncomeDataFetchData = async(startDate: string, endDate: string, userId: number): Promise<AnnualIncomeManagementData[] | void> => {
    const queryList: string[] = []
    queryList.push("start_date=" + startDate)
    queryList.push("end_date=" + endDate)
    queryList.push("user_id=" + userId)
    const fullPrames: string = "?" + queryList.join('&')
    try {
      // const response = await ApiEndpoint.getIncomeData(fullPrames)
      const response = Mockresponse
      const dataList = response.data.result
    
      const res: AnnualIncomeManagementData[] = dataList.map((data: any, idx: number) => ({
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
      }));
  
      return res
    
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  const create = async(row: AnnualIncomeManagementData | null): Promise<void> => {
    await console.log("create", row)
  }


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

const EnhancedTableHead: React.FC<EnhancedTableProps> = (props: EnhancedTableProps) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler =
      (property: keyof AnnualIncomeManagementKeyNotEdit) => (event: React.MouseEvent<unknown>) => {
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
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.align}
              padding={column.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
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
  const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (props: EnhancedTableToolbarProps) => {
    const {
      numSelected, selected, data, onDelete, checkboxLabel,
      checked, onCheckBox } = props;
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
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Nutrition
          </Typography>
        )}
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={onCheckBox} />}
            // control={<Checkbox onChange={onCheckBox} />}
            label={checkboxLabel}
          />
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton
              onClick={() => onDelete(data, selected)}>
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
  }
  
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
  const EditDialog: React.FC<editDialogProps> = (props: editDialogProps) => {
    const { editDialogLabel, dialogOpen, row, handleClose } = props;
  
    const errorObj = {
      payment_date: null,
      age: null,
      industry: null,
      total_amount: null,
      deduction_amount: null,
      take_home_amount: null,
      classification: null
    };
  
    const [editRow, setEditRow] = React.useState<AnnualIncomeManagementData | null>(row);
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
      const allValuesAreNull = Object.values(errors).every(value => value === null);
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
        const takeHomeAmount: number = Number(editRow.total_amount | 0) - Number(editRow.deduction_amount | 0)
        if (takeHomeAmount !== Number(editRow.take_home_amount)) {
          setEditRow({ ...editRow, take_home_amount: takeHomeAmount});
          const validationError = ValidationCheck.check('take_home_amount', takeHomeAmount);
          const validationErrorResult = validationError === true ? null : validationError || null;
          setErrors((prev) => ({ ...prev, take_home_amount: validationErrorResult }));
        }
      }
    }, [editRow]);
  
    /**
     * フィールドのバリデーションと更新
     * 
   * @param {keyof AnnualIncomeManagementData} field - カラム名を表す。これは、`AnnualIncomeManagementData`型のキーのいずれかです。
   * @param {string | number | Date} value - 各入力値を表す。
     */
    const handleFieldChange = (field: keyof AnnualIncomeManagementData, value: string | number | Date) => {
      let convertedValue: string | number | Date = value;
    
      // If the field is total_amount or deduction_amount, convert the value to a number
      if (field === 'total_amount' || field === 'deduction_amount' || field === 'age' || field === 'take_home_amount') {
        convertedValue = Number(value);
      }
      setEditRow((prev) => prev ? { ...prev, [field]: convertedValue } : prev);
      validateField(field, convertedValue);
    };
  
    /**
     * 各入力フォームのバリデーションチェック
     * 
     * @param {keyof AnnualIncomeManagementData} field - カラム名を表す。これは、`AnnualIncomeManagementData`型のキーのいずれかです。
     * @param {string | number | Date} value - 各入力値を表す。
     */
    const validateField = (field: keyof AnnualIncomeManagementData, value: string | number | Date) => {
      let validationError: string | boolean = true;
  
      validationError = ValidationCheck.check(field, value);
  
      const validationErrorResult = validationError === true ? null : validationError || null;
      // []付けづにキー名を渡すと、'field'という文字列で渡してしまう
      // []をつければ動的なキー名で渡すことができる
  
      setErrors((prev) => ({ ...prev, [field]: validationErrorResult}));
    };
  
    /**
     * フォーム送信
     * 
     * @param {AnnualIncomeManagementData | null} editRow - 編集する行データ
     */
    const handleSubmit = async(editRow: AnnualIncomeManagementData | null) => {
      const allValuesAreNull = Object.values(errors).every(value => value === null);
      if (allValuesAreNull && editRow) {
        // 念の為送信前も型チェック
        Object.entries(editRow).forEach(([key, val]) => {
          if (key === 'total_amount' || key === 'deduction_amount' || key === 'age' || key === 'take_home_amount') {
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
    const createHandleChange = async(row: AnnualIncomeManagementData | null) => {
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
    const handleFromChange = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
      if (editRow) {
        if (field === 'age' || field === 'total_amount' || field === 'deduction_amount') {
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
          <DialogTitle id="alert-dialog-title">
          {editDialogLabel}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <div>
                <TextField
                  label={LabelConst.PaymentDate}
                  type="date"
                  sx={{ m: 1, width: '25ch' }}
                  value={editRow?.payment_date || ''}
                  onChange={(e) => handleFieldChange('payment_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.payment_date}
                  helperText={errors.payment_date}
                />
                <TextField
                  label={LabelConst.Age}
                  type="number"
                  sx={{ m: 1, width: '25ch' }}
                  value={editRow?.age || ''}
                  onChange={(e) => handleFieldChange('age', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.age}
                  helperText={errors.age}
                />
                <TextField
                  label={LabelConst.Industry}
                  type="string"
                  sx={{ m: 1, width: '25ch' }}
                  value={editRow?.industry || ''}
                  onChange={(e) => handleFieldChange('industry', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.industry}
                  helperText={errors.industry}
                />
                <TextField
                  label={LabelConst.TotalAmount}
                  type="number"
                  sx={{ m: 1, width: '25ch' }}
                  value={editRow?.total_amount || ''}
                  onChange={(e) => handleFieldChange('total_amount', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.total_amount}
                  helperText={errors.total_amount}
                />
                <TextField
                  label={LabelConst.DeductionAmount}
                  type="number"
                  sx={{ m: 1, width: '25ch' }}
                  value={editRow?.deduction_amount || ''}
                  onChange={(e) => handleFieldChange('deduction_amount', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.deduction_amount}
                  helperText={errors.deduction_amount}
                />
                <TextField
                  label={LabelConst.TakeHomeAmount}
                  type="number"
                  sx={{ m: 1, width: '25ch' }}
                  value={editRow?.take_home_amount || ''}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.take_home_amount}
                  helperText={errors.take_home_amount}
                  disabled 
                />
                <TextField
                  label={LabelConst.Classification}
                  select
                  sx={{ m: 1, width: '25ch' }}
                  value={editRow?.classification || ''}
                  onChange={(e) => handleFieldChange('classification', e.target.value)} 
                  error={!!errors.classification}
                  helperText={errors.classification}     
                >
                  {classificationListConst.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => editCancel(row)}>キャンセル</Button>
            <Button onClick={() => handleSubmit(editRow)} autoFocus disabled={!submitFlag}>
              変更
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }


export { 
    getIncomeDataFetchData,
    create,
    EnhancedTableHead,
    EnhancedTableToolbar,
    EditDialog,
};