// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserParams = {
  firstName?: string
  lastName?: string
  username?: string
  photo?: string
  type?: string
}


// ====== category 
export type CreateCategoryParams = {
  categoryName: string
}

export type Category = {
  id: string
  name: string
}

export type AllCategories = Category[]

// ====== EVENT PARAMS

export type EventFormObject = {
  title: string
  description: string
  location: string
  coordinates: string
  url: string
  image: string | null
  startDateTime: Date
  endDateTime: Date
  categoryId: string
  contact: string
  minVolenteer: number
}


// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
