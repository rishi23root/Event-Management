import { EventFormObject } from "@/types"

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

var date = new Date();
var newDate = new Date();
newDate.setDate(date.getDate() + 2);

export const eventDefaultValues: EventFormObject = {
  title: '',
  description: '',
  location: 'online',
  coordinates: '',
  url: '',
  image: '',
  startDateTime: date,
  endDateTime: newDate,
  categoryId: '',
  contact: '',
  minVolenteer: 1,
}
