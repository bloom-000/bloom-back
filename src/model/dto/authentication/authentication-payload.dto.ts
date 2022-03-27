export class AuthenticationPayloadDto {
  constructor(readonly accessToken: string, readonly refreshToken: string) {}
}
