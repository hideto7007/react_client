import {
  Response,
  OkResponse,
  Result,
  ValidateError,
} from '@/src/common/presenter'
import Common from '@/src/common/common'
import { Message } from '@/src/common/message'

class Utils {
  public static isOkResponse<T>(
    response: Response<T>
  ): response is OkResponse<T> {
    return (
      response.status === 200 && 'data' in response && 'result' in response.data
    )
  }

  public static typeAssertion<T>(response: Response<T> | Response<unknown>): T {
    if (this.isOkResponse(response)) {
      return (response.data as Result<T>).result as T
    }
    throw new Error('アサーション失敗しました。')
  }

  public static generateErrorMsg(response: Response<unknown>): string {
    if ('error_msg' in response.data) {
      if (response.status === 500) {
        return Common.ErrorMsgInfo(Message.ServerError, response.data.error_msg)
      }
      return Common.ErrorMsgInfo(Message.AuthError, response.data.error_msg)
    }
    return Common.ErrorMsgInfoArray(response.data as ValidateError)
  }
}

export { Utils }
