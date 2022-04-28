import { PageOptionParams } from '../../model/common/page-option.params';
import { Gender } from '../../model/enum/gender.enum';

export type GetUsersParams = PageOptionParams;

export interface CreateUserParams {
  fullName: string;
  email: string;
  password: string;
  refreshTokens: string[];
  gender: Gender;
  birthDate: Date;
}
