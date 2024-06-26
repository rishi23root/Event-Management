'use server'
import { revalidatePath } from "next/cache"
import prisma from "../prisma"

// add a new user registration data in the event
export const registerUser = async ({ userDbId, eventId }: {
    userDbId: string, eventId: string
}) => {
    try {
        try {
            // get the event data
            const eventData = await prisma.event.findUnique({
                where: {
                    id: eventId
                },
                select: {
                    attendees: true,
                    userId: true
                }
            })

            // check if user is already registered in the event
            if (eventData?.attendees.includes(userDbId)) {
                console.log("User is already registered in the event")
                return false
            }

            // can't register in his own event
            if (eventData?.userId === userDbId) {
                console.log("User can't register in his own event")
                return false
            }

            await prisma.event.update({
                where: {
                    id: eventId
                },
                data: {
                    // append user id to the attendees array
                    attendees: {
                        push: userDbId
                    }
                }
            })
        } catch (error) {
            // console.error("Error registering user in event :", error)
            throw new Error(error as unknown as string)
        }

        try {
            await prisma.user.update({
                where: {
                    id: userDbId
                },
                data: {
                    // append event id to the volunteerEvents array
                    volenteer: {
                        push: eventId
                    }
                }
            })
        } catch (error) {
            // console.error("Error adding event in user :", error)
            throw new Error(error as unknown as string)
        }
        revalidatePath(`/events/${eventId}`)

        return true
    } catch (error) {
        console.error(error)
        return false
    }


}

// get all registers by event id
export const getRegistersByEvent = async (eventId: string) => {
    try {
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            },
            select: {
                attendees: true
            }
        })

        // loop through the attendees array and get the user data
        const attendees = event?.attendees
        if (attendees) {
            const users = await prisma.user.findMany({
                where: {
                    id: {
                        in: attendees
                    }
                }
            })
            return users
        }
        else {
            return []
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

// get all events user registrated 
export const getRegiestersByUser = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            },
            select: {
                volenteer: true
            }
        })

        // loop through the volenteer array and get the event data
        const volenteer = user?.volenteer
        if (volenteer) {
            const events = await prisma.event.findMany({
                where: {
                    id: {
                        in: volenteer
                    }
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
                }
            })
            return events
        }
        else {
            return []
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

// export const getOrdersByUser = () => { }