import common from '../../../src/common/common'
import { ValidateError, Response } from '../../../src/constants/presenter'

describe('common', () => {
  test('ErrorMsgInfo', async () => {
    const result = common.ErrorMsgInfo('test', 'エラー')

    expect(result).toEqual(`【test】<br />エラー内容：エラー`)
  })

  test('ErrorMsgInfoArray recode_rowsあり', async () => {
    const response: Response<unknown> = {
      status: 500,
      data: {
        recode_rows: 1,
        result: [
          {
            field: 'test',
            message: 'エラー',
          },
        ],
      },
    }
    const result = common.ErrorMsgInfoArray(response.data as ValidateError)

    expect(result).toEqual(
      '【1行目にエラーがあります】<br /><br />【test】<br />エラー内容：エラー</<br />'
    )
  })

  test('ErrorMsgInfoArray recode_rowsなし', async () => {
    const response: Response<unknown> = {
      status: 500,
      data: {
        result: [
          {
            field: 'test',
            message: 'エラー',
          },
        ],
      },
    }
    const result = common.ErrorMsgInfoArray(response.data as ValidateError)

    expect(result).toEqual('<br />【test】<br />エラー内容：エラー</<br />')
  })
})
