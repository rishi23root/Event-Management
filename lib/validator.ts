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
  url: z.string(),
  // image
  image: z.string(),
  // startDateTime
  startDateTime: z.date(),
  // endDateTime
  endDateTime: z.date(),
  // categoryId
  categoryId: z.string(),
  // contact
  contact: z.string(),
})