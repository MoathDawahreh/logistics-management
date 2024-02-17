import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSerialization {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Exclude()
  password: string;

  @Exclude()
  hashedRt: string;

  @Exclude()
  role: string;

  @Expose()
  avatar: string;
}
