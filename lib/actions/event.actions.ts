'use server'

import {
  EventFormObject
} from '@/types'
import { revalidatePath } from 'next/cache'
import prisma from '../prisma'


// CREATE
export async function createEvent({ userId, eventInfo }: {
  userId: string
  eventInfo: EventFormObject
}) {
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
export async function updateEvent({ userId, eventId, eventInfo }: {
  userId: string
  eventId: string
  eventInfo: EventFormObject
}) {
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

    if (updatedEvent) {
      revalidatePath(`/events/${eventId}/update`)
    }

    return updatedEvent

  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// DELETE
export async function deleteEvent({ eventId }: {
  eventId: string
}) {
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

// ======================================
// GET ALL EVENTS

export async function getAllEvents({ query, category = '' }: {
  query: string
  category: string
}) {
  try {
    // console.log('getting all events', query, category)

    const events = await prisma.event.findMany({
      where: {
        endDateTime: {
          gt: new Date(),
        },
        title: {
          // does need to be exact match
          contains: query,
        },
        category: {
          name: {
            contains: category,
          },
        },
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

    return events

  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userDbId }: {
  userDbId: string
}) {
  try {
    const events = await prisma.event.findMany({
      where: {
        userId: userDbId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      }
    })
    return events
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
}: {
  categoryId: string
  eventId: string
}) {
  try {
    const events = await prisma.event.findMany({
      where: {
        categoryId: categoryId,
        id: {
          not: eventId,
        },
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

    return events
  } catch (error) {
    console.error(error)
    // throw Error("error", error.message)
  }
}
