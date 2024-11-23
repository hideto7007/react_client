

class Common {
    ErrorMsgInfo(flg: boolean, ...msgArray: string[]): string {
        var msg: string = ''
        console.log(flg)
        if (flg) {
            if (msgArray.length == 1) {
                msg = `【認証エラー】<br />エラー内容：${msgArray[0]}`
            } else if (msgArray.length == 2) {
                msg = `【${msgArray[0]}】<br />エラー内容：${msgArray[1]}`
            }
        } else {
            if (msgArray.length == 1) {
                msg = `【サーバーエラー】<br />エラー内容：${msgArray[0]}`
            }
        }
        return msg
    }
}

const common = new Common()

export default common;