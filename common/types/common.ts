export type UserRole = "user" | "administrator";

export interface IUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
}

export type TaskStatus = "new" | "in progress" | "completed" | "archived";

export interface ITask {
  id: string;
  status: TaskStatus;
  description: string;
  assignees: IUser[];
  comments: IComment[];
  createdAt: Date;
  createdBy: IUser;
  updatedAt: Date;
}

export interface IComment {
  id: string;
  text: string;
  createdAt: Date;
  createdBy: IUser;
  updatedAt: Date;
}

export interface ITokenResponse {
  token: string;
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
}

export interface IJwtTokenPayload {
  sub: string;
  name?: string;
  email: string;
  admin: boolean;
}
