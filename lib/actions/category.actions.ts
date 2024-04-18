"use server"

import { CreateCategoryParams } from "@/types"
import prisma from "../prisma"

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: categoryName,
      },
      select: {
        id: true,
        name: true
      }
    })
    console.log("newCategory:", newCategory)
    return newCategory
  } catch (error) {
    console.error(error)
  }
}

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true
      }
    })
    // console.log("all Category:", categories)

    return categories
  } catch (error) {
    console.error(error)
  }
}