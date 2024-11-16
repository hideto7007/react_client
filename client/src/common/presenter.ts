import {  AxiosResponse } from "axios";


interface ErrorResponse {
  status: number;
  data: unknown | any;
}

interface OkResponse extends AxiosResponse<any, any>{}


export type {
    ErrorResponse,
    OkResponse
}