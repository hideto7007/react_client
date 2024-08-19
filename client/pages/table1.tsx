import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import ApiEndpoint from '@/common/apiEndpoint'
import { 
    ErrorConst, Type, classificationListConst, KeyConst,
    Align, Size, labelListConst, keyListConst, LabelConst
} from '@/common/const'
import {
  ColumnNotEdit, AnnualIncomeManagementData,
  EnhancedTableProps, Order, AnnualIncomeManagementKeyNotEdit,
  AnnualIncomeManagementDeleteData, EnhancedTableToolbarProps, editDialogProps } from '@/common/types'
import { Mockresponse } from '@/common/data'
import { FilledInput, FormControl, FormHelperText, Input, InputAdornment, InputLabel, MenuItem, OutlinedInput, TextField } from '@mui/material';
import { Check, DateRange } from '@mui/icons-material';


const useFetchIncomeData = (startDate: string, endDate: string, userId: number) => {
  const [data, setData] = React.useState<AnnualIncomeManagementData[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await getIncomeDataFetchData(startDate, endDate, userId);
      if (response !== undefined) {
        setData(response);
      }
    };
    fetchData();
  }, [startDate, endDate, userId]);
  return data;
}

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = <Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = <T,>(array: readonly T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const columns: readonly ColumnNotEdit[] = [
  {
      id: KeyConst.PaymentDate,
      label: LabelConst.PaymentDate,
      minWidth: 100,
      required: true,
      disablePadding: true 
  },
  { 
      id: KeyConst.Age,
      label: LabelConst.Age,
      minWidth: 100,
      required: true,
      disablePadding: false
  },
  { 
      id: KeyConst.Industry,
      label: LabelConst.Industry,
      minWidth: 100,
      required: true,
      disablePadding: false
  },
  {
    id: KeyConst.TotalAmount,
    label: LabelConst.TotalAmount,
    minWidth: 170,
    align: Align.Right,
    required: true,
    disablePadding: false
  },
  {
    id: KeyConst.DeductionAmount,
    label: LabelConst.DeductionAmount,
    minWidth: 170,
    align: Align.Right,
    required: true,
    disablePadding: false
  },
  {
    id: KeyConst.TakeHomeAmount,
    label: LabelConst.TakeHomeAmount,
    minWidth: 170,
    align: Align.Right,
    required: true,
    disablePadding: false
  }
];

const getIncomeDataFetchData = async(startDate: string, endDate: string, userId: number): Promise<AnnualIncomeManagementData[] | void> => {
  const queryList: string[] = []
  queryList.push("start_date=" + startDate)
  queryList.push("end_date=" + endDate)
  queryList.push("user_id=" + userId)
  const fullPrames: string = "?" + queryList.join('&')
  try {
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

const create = async(row: AnnualIncomeManagementData): Promise<void> => {
  await console.log("create", row)
}

const deleteData = async(data: AnnualIncomeManagementData[], indexList: readonly number[]): Promise<void> => {
  const dataList = indexList.map((idx: number) => {
    return data[idx - 1]
  })
  await console.log("delete", dataList)
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

  const [editRow, setEditRow] = React.useState<AnnualIncomeManagementData | null>(row);

  React.useEffect(() => {
    if (row) {
      setEditRow(row);
    }
  }, [row]);

  /**
   * 総支給額 - 差引額で手取り額を算出
   * 総支給額又は差引額の状態が変更されるたびに再レンダリングする
   */
  React.useEffect(() => {
    if (editRow) {
      const takeHomeAmount = (editRow.total_amount | 0) - (editRow.deduction_amount | 0)
      if (takeHomeAmount !== editRow.take_home_amount) {
        setEditRow({ ...editRow, take_home_amount: takeHomeAmount});
      }
    }
  }, [editRow]);

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
    handleClose(); // ダイアログを閉じる
  };

  /**
   * handleDateChange - 日付の変更を処理する関数
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - 日付が変更された時のイベント
   */
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editRow) {
      setEditRow({ ...editRow, payment_date: event.target.value });
    }
  };

  /**
   * handleAgeChange - 年齢の変更を処理する関数
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - 年齢が変更された時のイベント
   */
  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editRow) {
      setEditRow({ ...editRow, age: event.target.valueAsNumber });
    }
  };

  /**
   * handleIndustryChange - 業界の変更を処理する関数
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - 業界が変更された時のイベント
   */
  const handleIndustryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editRow) {
      setEditRow({ ...editRow, industry: event.target.value });
    }
  };

  /**
   * handleTotalAmountChange - 総支給の変更を処理する関数
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - 総支給が変更された時のイベント
   */
  const handleTotalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editRow) {
      setEditRow({ ...editRow, total_amount: event.target.valueAsNumber });
    }
  };

  /**
   * handleDeductionAmountChange - 差引額の変更を処理する関数
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - 差引額が変更された時のイベント
   */
  const handleDeductionAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editRow) {
      setEditRow({ ...editRow, deduction_amount: event.target.valueAsNumber });
    }
  };

  /**
   * handleClassificationChange - 分類の変更を処理する関数
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - 分類が変更された時のイベント
   */
  const handleClassificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editRow) {
      setEditRow({ ...editRow, classification: event.target.value });
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
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label={LabelConst.Age}
                type="number"
                sx={{ m: 1, width: '25ch' }}
                value={editRow?.age || ''}
                onChange={handleAgeChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label={LabelConst.Industry}
                type="string"
                sx={{ m: 1, width: '25ch' }}
                value={editRow?.industry || ''}
                onChange={handleIndustryChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label={LabelConst.TotalAmount}
                type="number"
                sx={{ m: 1, width: '25ch' }}
                value={editRow?.total_amount || ''}
                onChange={handleTotalAmountChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label={LabelConst.DeductionAmount}
                type="number"
                sx={{ m: 1, width: '25ch' }}
                value={editRow?.deduction_amount || ''}
                onChange={handleDeductionAmountChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label={LabelConst.TakeHomeAmount}
                type="number"
                sx={{ m: 1, width: '25ch' }}
                value={editRow?.take_home_amount || ''}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled 
              />
              <TextField
                label={LabelConst.Classification}
                select
                sx={{ m: 1, width: '25ch' }}
                value={editRow?.classification || ''}
                onChange={handleClassificationChange}          
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
          <Button onClick={() => createHandleChange(editRow)} autoFocus>
            変更
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


// テーブルコンポーネント
const EnhancedTable: React.FC = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof AnnualIncomeManagementKeyNotEdit>('age');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [checkboxLabel, setCheckLabel] = React.useState<string>('off');
  const [checkedFlag, setCheckedFlag] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<AnnualIncomeManagementData | null>(null);
  // const [eventProps, setEventProps] = React.useState<React.SyntheticEvent | undefined>();
  // const [data, setData] = React.useState<AnnualIncomeManagementData[]>([]);

 // 編集されたデータを管理するための state
//  const [editData, setEditData] = React.useState<{ [key: number]: AnnualIncomeManagementData }>({});

  // カスタムフックを利用した例
  const data = useFetchIncomeData('2024-01-10', '2024-07-22', 1);


  // テーブルツールバーprops
  const handleDeleteChange = async(data: AnnualIncomeManagementDeleteData[], selected: readonly number[]) => {
    await deleteData(data, selected)
  };

  // レンダリングされても値の受け渡しがないため、useCallbackを使って関数の状態を保持しておく
  const handleCheckBoxChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setCheckLabel(checked ? 'on' : 'off');
    setCheckedFlag(checked);
  }, []);

  // テーブルヘッダーprops
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AnnualIncomeManagementKeyNotEdit,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  // ダイアログprops
  const dialogHandleChange = (row: AnnualIncomeManagementData) => {
    setSelectedRow(row);
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false);  // ダイアログを閉じるために使用
  };


  // テーブルprops
  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  // const handleEditChange = (id: number, field: keyof AnnualIncomeManagementData, value: any) => {
  //   setEditData({
  //     ...editData,
  //     [id]: {
  //       ...editData[id],
  //       [field]: value,
  //     },
  //   });
  // };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getIncomeDataFetchData('2024-01-10', '2024-07-22', 1);
  //     if (response !== undefined) {
  //       setData(response);  // データを状態にセット
  //     }
  //   };
  //   fetchData();
  // }, []);
  
  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [data, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          data={data}
          onDelete={handleDeleteChange}
          checkboxLabel={checkboxLabel}
          checked={checkedFlag}
          onCheckBox={handleCheckBoxChange}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                // const isEditing = editData[row.id] !== undefined || isItemSelected;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                  <TableCell padding="checkbox">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        />
                      {checkedFlag ? <IconButton
                        onClick={(event) => {
                          event.stopPropagation(); // イベントの伝播を停止
                          dialogHandleChange(row);
                        }}
                        aria-label={KeyConst.Edit}
                        size={Size.Small}
                        sx={{ marginRight: 3 }} // ここで隙間を設定
                      >
                        <EditIcon />
                      </IconButton> : null}
                    </Box>
                  </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      padding="none"
                      align={Align.Left}
                    >
                      {row.payment_date}
                    </TableCell>
                    <TableCell align={Align.Left}>
                      {row.age}
                    </TableCell>
                    <TableCell align={Align.Left}>
                      {row.industry}
                    </TableCell>
                    <TableCell align={Align.Right}>
                      {row.total_amount}
                    </TableCell>
                    <TableCell align={Align.Right}>
                      {row.deduction_amount}
                    </TableCell>
                    <TableCell align={Align.Right}>
                      {row.take_home_amount}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
              {/* ダイアログの表示 */}
              <EditDialog
                editDialogLabel={LabelConst.Edit}
                dialogOpen={dialogOpen}
                row={selectedRow}
                handleClose={handleClose}
              />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

export default EnhancedTable;
