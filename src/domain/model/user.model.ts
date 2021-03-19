export interface UserInputModel {
  name: string;
  email: string;
  password: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  salt: string;
}

export interface InsertUserParams extends UserInputModel {
  salt: string;
  password: string;
}
