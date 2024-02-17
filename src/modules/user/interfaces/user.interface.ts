
export interface User {
  id: string;
  name: string;
  password: string;
  phone: string;
  role: string;
  hashedRt?: string;
  refreshToken?: string;
  branchId?: string;
  branches?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  transactionsCount?: number;
  lastUpdate: Date;
  allowNotifications: boolean;
  pushNotificationTokens: string[];
  venueId?: string;
  avatar?: string;
}
