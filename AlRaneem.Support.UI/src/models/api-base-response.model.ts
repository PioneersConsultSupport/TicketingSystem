export interface ApiResponse<T> {
  StatusCode: number;
  Errors: string | null;
  Data: T;
  IsSuccess: boolean;
}
