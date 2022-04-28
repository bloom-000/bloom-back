export interface UserPayload {
  userId: string;
  issuedAt?: number;
  expirationTime?: number;
}

export interface JwtPayload {
  userId: string;
}
