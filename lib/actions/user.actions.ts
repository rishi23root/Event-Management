'use server'

import { revalidatePath } from 'next/cache'
import { CreateUserParams, UpdateUserParams } from '@/types'
import prisma from '../prisma'
import { clerkClient } from '@clerk/nextjs'

export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: user,
      select: {
        id: true,
        type: true
      }
    })
    return newUser
  } catch (error) {
    console.error(error)
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId
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
    console.error(error)
  }
}

export async function updateUserType(clerkId: string, type: string) {
  console.log('updating type for clerkId', clerkId)
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId
      },
      data: {
        type
      },
      select: {
        id: true,
        clerkId: true,
        type: true
      }
    })

    if (!updatedUser) throw new Error('User update failed')
    // first read the user 
    await clerkClient.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        userId: updatedUser.id,
        type: updatedUser.type
      }
    })
    revalidatePath('/profile', 'page')
  } catch (error) {
    console.error(error)
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
    console.error(error)
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
    console.error(error)
  }
}