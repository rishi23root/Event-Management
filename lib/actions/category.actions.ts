"use server"

import { CreateCategoryParams } from "@/types"
// import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
  try {
    // await connectToDatabase();

    const newCategory = await Category.create({ name: categoryName });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}

export const getAllCategories = async () => {
  try {
    // await connectToDatabase();

    // const categories = await Category.find();

    // return JSON.parse(JSON.stringify(categories));
    return [];
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }
}