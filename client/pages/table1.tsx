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

import ApiEndpoint from '@/common/apiEndpoint'
import { 
    ErrorConst, Type, classificationListConst, KeyConst,
    Align, Size, labelListConst, keyListConst, LabelConst
} from '@/common/const'
import {
  ColumnNotEdit, AnnualIncomeManagementData,
  EnhancedTableProps, Order, AnnualIncomeManagementKeyNotEdit,
  AnnualIncomeManagementDeleteData, EnhancedTableToolbarProps } from '@/common/types'
import { Mockresponse } from '@/common/data'
import { TextField } from '@mui/material';


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

// テーブルヘッダーコンポーネント
const EnhancedTableHead: React.FC<EnhancedTableProps> = (props) => {
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

// テーブルツールバーコンポーネント
const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (props) => {
  const { numSelected, selected, data, onDelete } = props;

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

// テーブルコンポーネント
const EnhancedTable: React.FC = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof AnnualIncomeManagementKeyNotEdit>('age');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [data, setData] = React.useState<AnnualIncomeManagementData[]>([]);

 // 編集されたデータを管理するための state
//  const [editData, setEditData] = React.useState<{ [key: number]: AnnualIncomeManagementData }>({});

  // カスタムフックを利用した例
  const data = useFetchIncomeData('2024-01-10', '2024-07-22', 1);


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AnnualIncomeManagementKeyNotEdit,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

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

  const createHandleChange = async(row: AnnualIncomeManagementData) => {
    await create(row)
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

  const handleDeleteChange = async(data: AnnualIncomeManagementDeleteData[], selected: readonly number[]) => {
    await deleteData(data, selected)
  };

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
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
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
