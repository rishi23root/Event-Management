'use server'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types'
import prisma from '../prisma'


const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createEvent({ userId, eventInfo }: CreateEventParams) {
  try {

    console.log('creating event for user ', userId, eventInfo.title)

    const organizer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    })

    if (!organizer) throw new Error('Organizer not found')

    const newEvent = await prisma.event.create({
      data: {
        title: eventInfo.title,
        description: eventInfo.description,
        location: eventInfo.location,
        coordinates: eventInfo.coordinates,
        contact: eventInfo.contact,
        url: eventInfo.url,
        image: eventInfo.image,
        startDateTime: eventInfo.startDateTime,
        endDateTime: eventInfo.endDateTime,
        organizer: {
          connect: {
            id: userId,

          },
        },
        category: {
          connect: {
            id: eventInfo.categoryId,
          },
        }
      }
    })

    return newEvent
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    console.log('getting event by id', eventId)
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!event) throw new Error('Event not found')

    return event
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// UPDATE
export async function updateEvent({ userId, eventId, eventInfo }: UpdateEventParams) {
  try {

    console.log('updating event for user ', userId, eventId, eventInfo.title)
    const eventToUpdate = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        organizer: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!eventToUpdate || eventToUpdate.organizer.id !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title: eventInfo.title,
        description: eventInfo.description,
        location: eventInfo.location,
        coordinates: eventInfo.coordinates,
        contact: eventInfo.contact,
        url: eventInfo.url,
        image: eventInfo.image,
        startDateTime: eventInfo.startDateTime,
        endDateTime: eventInfo.endDateTime,
        category: {
          connect: {
            id: eventInfo.categoryId,
          },
        },
      },
    })

    return updatedEvent

  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// DELETE
export async function deleteEvent({ eventId }: DeleteEventParams) {
  try {
    console.log('deleting event by id', eventId)
    const deletedEvent = await prisma.event.delete({
      where: {
        id: eventId,
      },
    })
    return deletedEvent
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}





// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
    }

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}
