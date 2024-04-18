'use server'
import prisma from "../prisma"

// add a new user registration data in the event
export const registerUser = async ({ userDbId, eventId }: {
    userDbId: string, eventId: string
}) => {

    // add updates like register only once 
    // check if user is already registered in the event
    // can't register in his own event


    try {

        try {
            const event = await prisma.event.update({
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
            const user = await prisma.user.update({

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