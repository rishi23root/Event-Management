
// {
//   "id": "66203e6b970c2a914f1ec848",
//   "title": "this ",
//   "description": "asd",
//   "url": "thisfa sdi",
//   "image": "",
//   "location": "online",
//   "coordinates": "",
//   "startDateTime": "2024-04-17T21:25:43.789Z",
//   "endDateTime": "2024-04-17T21:25:43.789Z",
//   "contact": "34525",
//   "categoryId": "662005f00a86ca507cc6308c",
//   "userId": "661fb81530e566ff857a528e",
//   "createdAt": "2024-04-17T21:26:03.147Z",
//   "updatedAt": "2024-04-17T21:26:03.147Z",
//   "organizer": {
//     "id": "661fb81530e566ff857a528e",
//     "firstName": "Rishi",
//     "lastName": ""
//   },
//   "category": {
//     "id": "662005f00a86ca507cc6308c",
//     "name": "this or that"
//   }
// }


//     id        String @id @default (auto()) @map("_id") @db.ObjectId
//   clerkId   String @unique
//   username  String
//   email     String @unique
//   firstName String
//   lastName  String
//   photo     String
// type String   @default ("new")
//   createdAt DateTime @default (now())
//   updatedAt DateTime @updatedAt
//   Event     Event[]

export type CategorySchemaT = {
    id: string;
    name: string;
    createdAt?: Date;
}

export type UserSchemaT = {
    id: string;
    clerkId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    photo: string;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
    Event: EventSchemaT[];
}
export type EventSchemaBaseT = {
    id: string;
    title: string;
    description: string;
    url: string;
    image: string | null;
    location: string;
    coordinates: string;
    startDateTime: Date;
    endDateTime: Date;
    contact: string;
    categoryId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type EventSchemaOrganizerT = {
    organizer: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
export type EventSchemaCategoryT = {
    category: {
        id: string;
        name: string;
    };
}


export type EventSchemaT = EventSchemaBaseT & EventSchemaOrganizerT & EventSchemaCategoryT;