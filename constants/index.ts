import { EventObject } from "@/types"

export const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Events',
    route: '/events/',
  },
  {
    label: 'My Profile',
    route: '/profile',
  },
]

export const eventDefaultValues: EventObject = {
  title: '',
  description: '',
  location: 'online',
  coordinates: '',
  url: '',
  image: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  contact: '',
}
