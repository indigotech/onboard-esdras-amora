export interface UserInputModel {
  name: string;
  email: string;
  password: string;
}

export interface LoginInputModel {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface UserTokenData {
  userId: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
}

export interface InsertUserParams extends UserInputModel {
  salt: string;
}
