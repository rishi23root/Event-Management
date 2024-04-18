import * as z from "zod"

export const eventFormSchema = z.object({
  // title
  title: z.string().min(3, 'Title must be at least 3 characters'),
  // description
  description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
  // location
  location: z.string().min(3, 'Location must be at least 3 characters').max(400, 'Location must be less than 400 characters'),
  // coordinates
  coordinates: z.string(),
  // url
  url: z.string().min(6, 'Url is required, Provide event link or website link'),
  // image
  image: z.string().min(1, 'Image is required').nullable(),
  // startDateTime
  startDateTime: z.date(),
  // endDateTime
  endDateTime: z.date(),
  // categoryId should select from the list of categories 
  categoryId: z.string().min(1, 'Category is required, chose one or create one'),
  // contact
  contact: z.string().min(1, 'Contact is required'),
})