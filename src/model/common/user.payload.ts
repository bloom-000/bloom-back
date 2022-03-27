export interface UserPayload {
  userId: number;
  issuedAt?: number;
  expirationTime?: number;
}

export interface JwtPayload {
  userId: number;
}
