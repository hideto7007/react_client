import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, FormControlLabel, FormGroup, IconButton } from '@mui/material';


import ApiEndpoint from '@/common/apiEndpoint'
import { 
    ErrorConst, Type, classificationListConst, KeyConst,
    Align, Size, labelListConst, keyListConst, LabelConst
} from '@/common/const'
import { Column, AnnualIncomeManagementData } from '@/common/types'
import { Mockresponse } from '@/common/data'


let serverErrorFlag: boolean = false;

const columns: readonly Column[] = [
  { id: KeyConst.PaymentDate, label: LabelConst.PaymentDate, minWidth: 170, required: true },
  { id: KeyConst.Age, label: LabelConst.Age, minWidth: 100, required: true },
  { id: KeyConst.Industry, label: LabelConst.Industry, minWidth: 100, required: true },
  {
    id: KeyConst.TotalAmount,
    label: LabelConst.TotalAmount,
    minWidth: 170,
    align: Align.Right,
    required: true
  },
  {
    id: KeyConst.DeductionAmount,
    label: LabelConst.DeductionAmount,
    minWidth: 170,
    align: Align.Right,
    required: true
  },
  {
    id: KeyConst.TakeHomeAmount,
    label: LabelConst.TakeHomeAmount,
    minWidth: 170,
    align: Align.Right,
    required: true
  },
  {
    id: KeyConst.Edit,
    label: LabelConst.Edit,
    minWidth: 100,
    align: Align.Right,
    required: false
  }
];

const getIncomeDataFetchData = async(startDate: string, endDate: string, userId: number): Promise<AnnualIncomeManagementData[] | void> => {
    const queryList: string[] = []
    // 表示データの初期化
    queryList.push("start_date=" + startDate)
    queryList.push("end_date=" + endDate)
    queryList.push("user_id=" + userId)
    const fullPrames: string = "?" + queryList.join('&')
    try {
    //   const response = await ApiEndpoint.getIncomeData(fullPrames)
      const response = Mockresponse
      const dataList = response.data.result // レスポンスからデータを取得
  
      const res: AnnualIncomeManagementData[] = dataList.map((data: any) => ({
        income_forecast_id: data.IncomeForecastID,
        payment_date: data.PaymentDate.slice(0, 10),
        age: data.Age,
        industry: data.Industry,
        total_amount: data.TotalAmount,
        deduction_amount: data.DeductionAmount,
        take_home_amount: data.TakeHomeAmount,
        update_user: "", // 必要に応じて設定
        classification: data.Classification,
        user_id: data.UserID,
      }));

      return res
  
    } catch (error) {
      serverErrorFlag = true
      console.error('Error fetching data:', error)
    }
  }

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [checkboxLabel, setCheckLabel] = React.useState<string>('off');
  const [checkedFlag, setCheckedFlag] = React.useState<boolean>(false);
  const [data, setData] = React.useState<AnnualIncomeManagementData[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChange = (event: React.SyntheticEvent, checked: boolean) => {
    setCheckLabel(checked ? 'on' : 'off');
    setCheckedFlag(checked);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    (async() => {
        console.log("loaded");
        // http通信の確認から
        const response = await getIncomeDataFetchData('2024-01-10', '2024-07-22', 1);
        if (response !== undefined) {
            setData(response)
        }
    })()
  }, [])

  const testData = Mockresponse.data.result

  const ageArray = testData.slice(0, 5).map((row) => {
    return Number(row.Age)
  })

  columns.map((column) => {
    console.log(column.required)
  }
  )

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          onChange={handleChange}
          label={checkboxLabel}
        />
      </FormGroup>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                if (checkedFlag || column.required) {
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  );
                }
                return null;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.payment_date}>
                  {columns.map((column) => {
                    let value: React.ReactNode = row[column.id as keyof AnnualIncomeManagementData];
                    if (column.id === KeyConst.Edit && checkedFlag) {
                      value = (
                        <>
                          <IconButton aria-label={KeyConst.Edit} size={Size.Small}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label={KeyConst.Delete} size={Size.Small}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      );
                    }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}