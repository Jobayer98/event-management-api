import { prisma } from '../../../config';
import { Organizer } from '@prisma/client';

export interface CreateOrganizerData {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
}

export interface OrganizerResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}

export class OrganizerRepository {
  /**
   * Find organizer by email
   */
  async findByEmail(email: string): Promise<Organizer | null> {
    return await prisma.organizer.findUnique({
      where: { email },
    });
  }

  /**
   * Find organizer by email with password hash (for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<Organizer | null> {
    return await prisma.organizer.findUnique({
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
   * Find organizer by ID
   */
  async findById(id: string): Promise<Organizer | null> {
    return await prisma.organizer.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new organizer
   */
  async create(organizerData: CreateOrganizerData): Promise<OrganizerResponse> {
    return await prisma.organizer.create({
      data: organizerData,
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
   * Update organizer by ID
   */
  async updateById(id: string, updateData: Partial<CreateOrganizerData>): Promise<OrganizerResponse> {
    return await prisma.organizer.update({
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
   * Delete organizer by ID
   */
  async deleteById(id: string): Promise<void> {
    await prisma.organizer.delete({
      where: { id },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const organizer = await prisma.organizer.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!organizer;
  }

  /**
   * Get organizer count
   */
  async count(): Promise<number> {
    return await prisma.organizer.count();
  }

  /**
   * Get organizers with pagination
   */
  async findMany(skip: number = 0, take: number = 10): Promise<OrganizerResponse[]> {
    return await prisma.organizer.findMany({
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
   * Update organizer password by ID
   */
  async updatePassword(id: string, passwordHash: string): Promise<OrganizerResponse> {
    return await prisma.organizer.update({
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
export const organizerRepository = new OrganizerRepository();