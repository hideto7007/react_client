import {
  Response,
  OkResponse,
  Result,
  ValidateError,
} from '@/src/common/presenter'
import Common from '@/src/common/common'
import { Message } from '@/src/common/message'

class Utils {
  private static MessageEachResponse(statusCode: number): string {
    const messages: { [key: number]: string } = {
      400: Message.VaildationError,
      401: Message.AuthError,
      404: Message.NotRegisterExisitDataError,
      409: Message.DuplicationError,
      500: Message.ServerError,
    }

    return messages[statusCode] || Message.UnknownError
  }

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
      return Common.ErrorMsgInfo(
        this.MessageEachResponse(response.status),
        response.data.error_msg
      )
    }
    return Common.ErrorMsgInfoArray(response.data as ValidateError)
  }
}

export { Utils }
