import http from "./httpCommon";

class ApiEndpoint {
  getPriceManagement(params: any): Promise<any> {
    return http.get(`/api/price/` + params);
  }
  
  getIncomeData(params: any): Promise<any> {
    return http.get(`/api/income_data/` + params);
  }

  getRangeDate(params: any): Promise<any> {
    return http.get(`/api/range_date/` + params);
  }

  getYearsIncomeDate(params: any): Promise<any> {
    return http.get(`/api/years_income_date/` + params);
  }

  incomeCreate(data: any): Promise<any> {
    return http.post(`/api/income_create/`, data);
  }

  incomeUpdate(data: any): Promise<any> {
    return http.put(`/api/income_update/`, data);
  }

  incomeDelete(id: any): Promise<any> {
    return http.delete(`/api/income_delete/?income_forecast_id=${id}`);
  }

  // get(id: any): Promise<any> {
  //   return http.get(`/api/books/${id}`);
  // }

  // create(data: any): Promise<any> {
  //   return http.post("/api/books", data);
  // }

  // update(id: any, data: any): Promise<any> {
  //   return http.put(`/api/books/${id}`, data);
  // }

  // delete(id: any): Promise<any> {
  //   return http.delete(`/api/books/${id}`);
  // }

  // deleteAll(): Promise<any> {
  //   return http.delete(`/api/books`);
  // }

  // findByDescription(title: string): Promise<any> {
  //   return http.get(`/api/books?title=${title}`);
  // }
}

// インスタンスを変数に代入
const apiEndpoint = new ApiEndpoint();

// 変数をデフォルトエクスポート
export default apiEndpoint;
