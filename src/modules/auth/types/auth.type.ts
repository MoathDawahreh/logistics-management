import { Tokens } from './tokens.type';
import { UserSerialization } from '../serialization';

export type Auth = {
  tokens: Tokens;
  user: UserSerialization;
};
