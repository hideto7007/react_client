
class Format {
    Date(date: Date | undefined | string): string  {
        const regex = /^\d{4}-\d{2}-\d{2}$/
        if (typeof date === "string" && regex.test(date)) {
            return date   
        } else if (date instanceof Date && !isNaN(date.getTime())) {
            const yearNum = date.getFullYear()
            const monthNum = date.getMonth() + 1
            const dateNum = date.getDate()
            if (monthNum + 1 < 10 && dateNum < 10) {
                return `${yearNum}-0${monthNum}-0${dateNum}`
            } else if (monthNum < 10) {
                return `${yearNum}-0${monthNum}-${dateNum}`
            } else if (dateNum < 10) {
                return `${yearNum}-${monthNum}-0${dateNum}`
            }
            return `${yearNum}-${monthNum}-${dateNum}`
        } else {
            return ''
        }
    }

    dateDiffInDays(dateStr1: string | undefined, dateStr2: string | undefined): number {

        if (!dateStr1 || !dateStr2) {
            // 親コンポーネントでundefined を事前にチェックしてるからここでは0を返すようにしている
            return 0
        }

        const date1 = new Date(dateStr1)
        const date2 = new Date(dateStr2)

        // 日付の妥当性をチェック
        if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
            throw new Error("Invalid date string provided");
        }

        // 差をミリ秒で取得し、日数に変換
        const timeDiff = date1.getTime() - date2.getTime()
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
        return diffDays
    }

    formatDate(date: Date) {
        let d = date,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()

        if (month.length < 2) 
            month = '0' + month
        if (day.length < 2) 
            day = '0' + day

        return [year, month, day].join('-')
  }
}
  
export default new Format()
  