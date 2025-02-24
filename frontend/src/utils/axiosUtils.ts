import axios, { AxiosError } from "axios";


export interface ErrorResponse {
  error?: string;
}


export function isAxiosError<T = unknown>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}
