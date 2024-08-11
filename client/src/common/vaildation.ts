
class Validation {
    private regexp: RegExp

    constructor() {
        this.regexp =  new RegExp(/^\d+$/)
    }

    dateValid = (value: Date): string | boolean => {
        if (!value || value.toString() === 'Invalid Date') {
            return '必須入力項目です'
        }
        return true
            
    }
    ageValid = (value: string): string | boolean => {
        if (value === "") {
            return '必須入力項目です'
        } else if (!this.regexp.test(value)) {
            return '整数の値のみで入力して下さい'
        } else if (Number(value) <= 15) {
            return '15歳未満は入力出来ません'
        } else {
            return true
        }
    }
    industryValid = (value: string): string | boolean => {
        if (!value) {
            return '必須入力項目です'
        } else if (value.length >= 100) {
            return '文字数が100文字オーバーです'
        } else {
            return true
        }
    }
    incomeAmountValid = (value: string): string | boolean => {
        if (value === "") {
            return '必須入力項目です'
        } else if (!this.regexp.test(value)) {
            return '整数の値のみで入力して下さい'
        } else {
            return true
        } 
    }
    classificationValid = (value: string): string | boolean => {
        if (value === "") {
            return '必須入力項目です'
        } else if (value !== '給料' && value !== '賞与' && value !== '一時金' && value !== '寸志' && value !== 'その他') {
            return 'リストの中からお選びください'
        } else {
            return true
        }   
    }
    takeHomeAmountValid = (value: string): string | boolean => {
        const num = Number(value)
        if (num < 0) {
            return '総支給と差引額が逆転してます。'
        } 
        return true
    }

}
  
export default new Validation();
  