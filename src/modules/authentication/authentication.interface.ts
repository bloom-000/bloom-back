import { Gender } from '../../model/enum/gender.enum';

export interface SignUpWithTokenParams {
  fullName: string;
  email: string;
  gender: Gender;
  birthDate: Date;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}
