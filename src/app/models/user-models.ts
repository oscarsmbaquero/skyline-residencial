export interface IUser {
  id: string;
  username: string;
}

export interface IUserResponse {
  status?: number;
  message?: string;
  data: IUser;
}