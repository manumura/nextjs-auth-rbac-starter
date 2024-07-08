export type IUser = {
  uuid: UUID;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export type IdTokenPayload = {
  user: IUser;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  accessTokenExpiresAt: Date;
};

export type InfoResponse = {
  env: string;
  userAgent: string;
  ip: string;
};

export type MessageResponse = {
  message: string;
};

export type IGetUsersResponse = {
  elements: IUser[];
  totalElements: number;
};
