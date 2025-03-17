import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ApiClient } from '../../../src/common/apiClient'

describe('ApiClient', () => {
  let mock: MockAdapter
  let apiClient: ApiClient
  const endpoint = '/test-endpoint'

  beforeEach(() => {
    mock = new MockAdapter(axios)
    apiClient = new ApiClient()
  })

  afterEach(() => {
    mock.reset() // モックをリセット
  })

  test('成功時のレスポンス (GET)', async () => {
    const mockData = { message: 'Success' }

    mock.onGet(endpoint).reply(200, mockData)

    const response = await apiClient.callApi(endpoint, 'get')

    expect(response.status).toBe(200)
    expect(response.data).toEqual(mockData)
  })

  test('成功時のレスポンス (POST)', async () => {
    const mockData = { id: 1 }
    const postData = { name: 'Test' }

    mock.onPost(endpoint, postData).reply(200, mockData)

    const response = await apiClient.callApi(endpoint, 'post', postData)

    expect(response.status).toBe(200)
    expect(response.data).toEqual(mockData)
  })

  test('成功時のレスポンス (PUT)', async () => {
    const mockData = { id: 1 }
    const putData = { name: 'Test' }

    mock.onPut(endpoint, putData).reply(200, mockData)

    const response = await apiClient.callApi(endpoint, 'put', putData)

    expect(response.status).toBe(200)
    expect(response.data).toEqual(mockData)
  })

  test('成功時のレスポンス (DELETE)', async () => {
    const mockData = { result: 'success delete' }
    const deleteData = { id: 1 }

    mock.onDelete(endpoint).reply(200, mockData)

    const response = await apiClient.callApi(endpoint, 'delete', deleteData)

    expect(response.status).toBe(200)
    expect(response.data).toEqual(mockData)
  })

  test('エラー時のレスポンス', async () => {
    const endpoint = '/test-endpoint'
    const error = { result: 'Internal Server Error' }

    mock.onGet(endpoint).reply(500, error)

    const response = await apiClient.callApi(endpoint, 'get')

    expect(response.status).toBe(500)
    expect(response.data).toEqual(error)
  })

  test('予期せぬエラー', async () => {
    const endpoint = '/test-endpoint'

    mock.onGet(endpoint).reply(500)

    const response = await apiClient.callApi(endpoint)

    expect(response.status).toBe(500)
    expect(response.data).toEqual('サーバーエラー')
  })
})
