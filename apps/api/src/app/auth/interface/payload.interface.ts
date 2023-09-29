export interface IPayload {
  email: string;
  sub: string;
  role?: string;
  iat?: number;
  exp?: number;
}
export interface IValidateStrategyResponse {
  _id: string;
  email: string;
  role?: string;
  refreshToken?: string;
}
