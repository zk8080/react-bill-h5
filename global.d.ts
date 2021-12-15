import * as axios from 'axios';

declare module 'axios' {
  // 定制业务相关的网络请求响应格式， T 是具体的接口返回类型数据
  export interface CustomSuccessData<T> {
    code: number;
    msg?: string;
    message?: string;
    data: T;
    [keys: string]: any;
  }

  export interface AxiosInstance {
    // <T = any>(config: AxiosRequestConfig): Promise<CustomSuccessData<T>>;
    request<T = any, R = CustomSuccessData<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = CustomSuccessData<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = CustomSuccessData<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    head<T = any, R = CustomSuccessData<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = CustomSuccessData<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    put<T = any, R = CustomSuccessData<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    patch<T = any, R = CustomSuccessData<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
  }
}

// 账单类型
export interface BillItemType {
  bills: BillType[];
  date: number;
}

export interface BillType {
  amount: string;
  date: string;
  id: number;
  pay_type: number;
  remark: string;
  type_id: number;
  type_name: string;
}

// 筛选类型TS
export interface FilterType {
  id: string;
  name?: string;
  type?: string;
  user_id?: number;
}

// 类型标识
export type PayType = 'expense' | 'income';