import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto';
import { User } from '../interfaces';

export function checkUserExists(user: User) {
  if (!user) {
    throw new NotFoundException('User not found!');
  }
}

export function formatUserResponse(user: User) {
  const { password, hashedRt, ...formattedUser } = user;
  return formattedUser;
}

export function handleUpdateErrors(error: any, dto: UpdateUserDto) {
  if (error.message.includes('invalid value')) {
    throw new BadRequestException({ message: 'Invalid type value!' });
  }
  if (error.code === 11000) {
    throw new ConflictException({
      message: error,
      target: error.keyValue,
    });
  }
}
