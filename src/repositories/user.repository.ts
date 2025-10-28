import { PrismaClient, User, UserRole, UserStatus } from "@prisma/client";

export const prisma = new PrismaClient({ log: ["query"] });

export const createUser = async (data: {
  username: string;
  password: string;
  email: string;
  name: string;
  birthDate?: Date;
  phone?: string;
  profileImage?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  isPetOwner?: boolean;
  role?: UserRole;
  status?: UserStatus;
}): Promise<User> => {
  return await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      birthDate: data.birthDate,
      phone: data.phone,
      profileImage: data.profileImage,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
      isPetOwner: data.isPetOwner ?? false,
      role: data.role ?? 'USER',
      status: data.status ?? 'ACTIVE',
    },
  });
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  return await prisma.user.findUnique({ 
    where: { username } 
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ 
    where: { email } 
  });
};

export const findUserById = async (id: bigint): Promise<User | null> => {
  return await prisma.user.findUnique({ 
    where: { id } 
  });
};

export const updateUser = async (id: bigint, data: Partial<{
  username: string;
  email: string;
  name: string;
  birthDate: Date;
  phone: string;
  profileImage: string;
  region: string;
  latitude: number;
  longitude: number;
  isPetOwner: boolean;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: Date;
}>): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: bigint): Promise<User> => {
  return await prisma.user.delete({
    where: { id },
  });
};

export const checkUsernameExists = async (username: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return !!user;
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return !!user;
};