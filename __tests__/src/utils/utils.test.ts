import { Utils } from '../../../src/utils/utils'
import { Response } from '../../../src/constants/presenter'

describe('Utils', () => {
  test('typeAssertion アサーション失敗', async () => {
    const response: Response = {
      status: 500,
      data: { result: 'テストエラー' },
    }

    expect(() => Utils.typeAssertion<string>(response)).toThrow(
      'アサーション失敗しました。'
    )
  })

  test('typeAssertion アサーション成功', async () => {
    const response: Response= {
      status: 200,
      data: {
        result: 'success',
      },
    }
    const result = Utils.typeAssertion<string>(response)

    expect(result).toEqual('success')
  })

  test('generateErrorMsg result', async () => {
    const response: Response = {
      status: 500,
      data: {
        result: 'エラー',
      },
    }
    const result = Utils.generateErrorMsg(response)

    expect(result).toEqual(`【サーバーエラー】<br />エラー内容：エラー`)
  })

  test('generateErrorMsg 予期せぬエラー', async () => {
    const response: Response = {
      status: 999,
      data: {
        result: 'error',
      },
    }
    const result = Utils.generateErrorMsg(response)

    expect(result).toEqual(`【不明なエラー】<br />エラー内容：error`)
  })

  test('generateErrorMsg バリデーションエラー', async () => {
    const response: Response = {
      status: 400,
      data: {
        result: [
          {
            field: 'test',
            message: 'エラー',
          },
        ],
      },
    }
    const result = Utils.generateErrorMsg(response)

    expect(result).toEqual('<br />【test】<br />エラー内容：エラー</<br />')
  })

  test('dateToStr 変換成功', async () => {
    const data = [
      '2024-10-11',
      '202410-12',
      new Date(2024, 10, 11),
      new Date(2024, 8, 11),
      new Date(2024, 9, 9),
      new Date(2024, 8, 9),
      new Date(2024, 12, 31),
      undefined,
      '',
    ]
    const expectData = [
      '2024-10-11',
      '',
      '2024-11-11',
      '2024-09-11',
      '2024-10-09',
      '2024-09-09',
      '2025-01-31',
      '',
      '',
    ]
    for (let i = 0; i < data.length; i++) {
      const result = Utils.dateToStr(data[i])
      expect(result).toEqual(expectData[i])
    }
  })

  test('dateDiffInDays undefinedチェック', async () => {
    const data = [
      [undefined, '2024-10-10'],
      ['2024-10-10', undefined],
    ]
    for (let i = 0; i < data.length; i++) {
      const result = Utils.dateDiffInDays(data[i][0], data[i][1])
      expect(result).toEqual(0)
    }
  })

  test('dateDiffInDays throwチェック', async () => {
    const data = [
      ['Invalid Date', '2024-10-10'],
      ['2024-10-10', 'Invalid Date'],
      ['Invalid Date', 'Invalid Date'],
    ]
    for (let i = 0; i < data.length; i++) {
      expect(() => Utils.dateDiffInDays(data[i][0], data[i][1])).toThrow(
        '不正なデータ型です。'
      )
    }
  })

  test('dateDiffInDays 差をミリ秒で取得し、日数に変換', async () => {
    expect(Utils.dateDiffInDays('2024-11-10', '2024-10-10')).toEqual(31)
  })

  test('formatDate 変換成功', async () => {
    const data = [
      new Date(2024, 10, 11),
      new Date(2024, 8, 11),
      new Date(2024, 9, 9),
      new Date(2024, 8, 9),
    ]
    const expectData = ['2024-11-11', '2024-09-11', '2024-10-09', '2024-09-09']
    for (let i = 0; i < data.length; i++) {
      const result = Utils.formatDate(data[i])
      expect(result).toEqual(expectData[i])
    }
  })
})
