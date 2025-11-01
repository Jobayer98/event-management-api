import { prisma } from '../../../config';
import { User } from '@prisma/client';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by email with password hash (for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   */
  async create(userData: CreateUserData): Promise<UserResponse> {
    return await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update user by ID
   */
  async updateById(id: string, updateData: Partial<CreateUserData>): Promise<UserResponse> {
    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  /**
   * Delete user by ID
   */
  async deleteById(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  /**
   * Get user count
   */
  async count(): Promise<number> {
    return await prisma.user.count();
  }

  /**
   * Get users with pagination
   */
  async findMany(skip: number = 0, take: number = 10): Promise<UserResponse[]> {
    return await prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update user password by ID
   */
  async updatePassword(id: string, passwordHash: string): Promise<UserResponse> {
    return await prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }
}

// Export singleton instance
export const userRepository = new UserRepository();