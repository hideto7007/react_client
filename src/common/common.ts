import { ValidateError } from "@/src/common/presenter";

class Common {
  ErrorMsgInfo(info: string, text: string): string {
    const msg = `【${info}】<br />エラー内容：${text}`;
    return msg;
  }

  ErrorMsgInfoArray(msgArray: ValidateError): string {
    let msg: string = "";
    console.log(msgArray);
    if (msgArray.recode_rows !== undefined && msgArray.recode_rows >= 1) {
      msg += `【${msgArray.recode_rows}行目にエラーがあります】<br />`;
    }
    for (const msgField of msgArray.result) {
      console.log(msgField);
      msg += `<br />【${msgField.field}】<br />エラー内容：${msgField.message}</<br />`;
      console.log(msg);
    }
    return msg;
  }
}

const common = new Common();

export default common;
