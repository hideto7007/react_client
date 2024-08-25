import { AnnualIncomeManagementData } from "./types"

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
    ageValid = (value: number): string | boolean => {
        if (value === null) {
            return '必須入力項目です'
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
        if (value === '') {
            return '必須入力項目です'
        } else if (!this.regexp.test(value)) {
            return '整数の値で入力して下さい'
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
    takeHomeAmountValid = (value: number): string | boolean => {
        if (value < 0) {
            return '総支給と差引額が逆転してます。'
        } 
        return true
    }
}


class ValidationCheck extends Validation {
    private validationError: string | boolean = true;

    check = (field: keyof AnnualIncomeManagementData, value: string | number | Date) => {

        switch (field) {
          case 'payment_date':
            this.validationError = this.dateValid(new Date(value as string));
            break;
          case 'age':
            this.validationError = this.ageValid(value as number);
            break;
          case 'industry':
            this.validationError = this.industryValid(value as string);
            break;
          case 'total_amount':
            this.validationError = this.incomeAmountValid(value as string);
            break;
          case 'deduction_amount':
            this.validationError = this.incomeAmountValid(value as string);
            break;
          case 'take_home_amount':
            this.validationError = this.takeHomeAmountValid(value as number);
            break;
          case 'classification':
            this.validationError = this.classificationValid(value as string);
            break;
          default:
            break;
        }

        return this.validationError;
    }
}


// eslint-disable-next-line import/no-anonymous-default-export
export default new ValidationCheck();
  