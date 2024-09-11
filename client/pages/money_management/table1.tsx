import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';


import { 
    KeyConst,
    Align, Size, LabelConst
} from '@/common/const'
import {
  AnnualIncomeManagementData,
  Order, AnnualIncomeManagementKeyNotEdit,
  AnnualIncomeManagementDeleteData
} from '@/common/types'
import {
  getIncomeDataFetchData,
  EnhancedTableHead,
  EnhancedTableToolbar,
  EditDialog,
  Breadcrumbs
} from '@/common/component'


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

const deleteData = async(data: AnnualIncomeManagementData[], indexList: readonly number[]): Promise<void> => {
  const dataList = indexList.map((idx: number) => {
    return data[idx - 1]
  })
  await console.log("delete", dataList)
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


  /**
   * 削除イベントハンドラー
   * 
   * @param {AnnualIncomeManagementDeleteData[]} data - 削除行をリストで渡す
   * @param {readonly number[]} selected - 削除行のインデックスをリストで渡す
   */
  const handleDeleteChange = async(data: AnnualIncomeManagementDeleteData[], selected: readonly number[]) => {
    await deleteData(data, selected)
  };

  /**
   * チェックボックスラベル
   * - レンダリングされても値の受け渡しがないため、useCallbackを使って関数の状態を保持しておく
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - `event`オブジェクトは、Reactのフォーム要素（`<input>`要素など）の状態が変更されたときに発生するイベントを表します。
   * このイベントオブジェクトには、ユーザーの入力に関する情報（例: 入力された値、変更の種類）や、イベントをトリガーした要素に関する情報が含まれています。
   */
  const handleCheckBoxChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setCheckLabel(checked ? 'on' : 'off');
    setCheckedFlag(checked);
  }, []);

  /**
   * テーブルヘッダーprops
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - `event`オブジェクトは、Reactのフォーム要素（`<input>`要素など）の状態が変更されたときに発生するイベントを表します。
   * このイベントオブジェクトには、ユーザーの入力に関する情報（例: 入力された値、変更の種類）や、イベントをトリガーした要素に関する情報が含まれています。
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  /**
   * テーブルの降順及び昇順ハンドラー
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - `event`オブジェクトは、Reactのフォーム要素（`<input>`要素など）の状態が変更されたときに発生するイベントを表します。
   * このイベントオブジェクトには、ユーザーの入力に関する情報（例: 入力された値、変更の種類）や、イベントをトリガーした要素に関する情報が含まれています。
   * @param {AnnualIncomeManagementKeyNotEdit} property - ソート対象のカラム名
   */
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AnnualIncomeManagementKeyNotEdit,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  /**
   * ダイアログイベントハンドラー
   * 
   * @param {AnnualIncomeManagementData} row - 編集行のデータ。
   */
  const dialogHandleChange = (row: AnnualIncomeManagementData) => {
    setSelectedRow(row);
    setDialogOpen(true)
  }

  /**
   * クローズダイアログ
   * 
   */
  const handleClose = () => {
    setDialogOpen(false);  // ダイアログを閉じるために使用
  };

  /**
   * 各行に設置されたチェックボックスをクリックした分だけ削除される
   * 
   * @param {React.MouseEvent<unknown>} event - `event`オブジェクトは、Reactのフォーム要素（`<input>`要素など）の状態が変更されたときに発生するイベントを表します。
   * このオブジェクトは`unknown`の為、使用しない
   * @param {number} id - 行のインデックス
   * 
   */
  const handleDeleteClick = (event: React.MouseEvent<unknown>, id: number) => {
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

  /**
   * 次ページへの切り替え
   * 
   * @param {unknown} event - このオブジェクトは`unknown`の為、使用しない
   * @param {number} newPage - 新しいページのid
   * 
   */
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

  /**
   * ページネーションの行数変更ハンドラー
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - `event`オブジェクトは、Reactのフォーム要素（`<input>`要素など）の状態が変更されたときに発生するイベントを表します。
   * このイベントオブジェクトには、ユーザーの入力に関する情報（例: 入力された値、変更の種類）や、イベントをトリガーした要素に関する情報が含まれています。
   * 
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * テーブルの行間を切り替える（通常と密集のレイアウトを切り替える）
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - チェックボックスがクリックされた際のイベント。
   * このイベントオブジェクトには、チェックボックスの状態（チェックされているかどうか）が含まれています。
   */
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
  
  /**
   * visibleRowsは、現在のページに表示されるテーブルの行を計算します。
   * 
   * @returns {Array} - 現在のページに表示される行のリスト。
   * 
   * - `React.useMemo`は、特定の依存関係が変わらない限り、計算結果を再利用するために使用されます。
   *   これにより、パフォーマンスの最適化が図られます。
   * 
   * - `stableSort`は、`data`配列をソートして、その順序を安定的に保ちながら新しい配列を返します。
   *   `getComparator`関数は、`order`（'asc' または 'desc'）と`orderBy`に基づいて比較関数を生成します。
   * 
   * - `slice`は、ソートされたデータから現在のページに表示する部分を抽出します。
   *   `page * rowsPerPage`は、表示を開始するインデックスを計算し、
   *   `page * rowsPerPage + rowsPerPage`は、表示を終了するインデックスを計算します。
   * 
   * 依存配列 `[data, order, orderBy, page, rowsPerPage]` が変更されたときに、
   * この計算が再度行われます。
   */
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
      <Breadcrumbs marginBottom='5px'/>  {/* Include Breadcrumbs at the top */}
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
                    onClick={(event) => handleDeleteClick(event, row.id)}
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
