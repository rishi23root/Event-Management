'use server'

import { revalidatePath } from 'next/cache'
import { CreateUserParams, UpdateUserParams } from '@/types'
import prisma from '../prisma'


export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: user,
      select: {
        id: true
      }
    })
    return newUser
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        photo: true,
        clerkId: true
      }
    })

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId
      },
      data: user,
      select: {
        id: true
      }
    })

    if (!updatedUser) throw new Error('User update failed')
    return updatedUser
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}

export async function deleteUser(clerkId: string) {
  try {
    const userToDelete = await prisma.user.delete({
      where: {
        clerkId
      },
      select: {
        id: true
      }
    })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    revalidatePath('/')

    return userToDelete
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}
