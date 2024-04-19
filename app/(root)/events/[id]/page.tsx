import Collection from "@/components/shared/Collection";
import OrganiserActions from "@/components/shared/OrganiserActions";
import RegisterComponent from "@/components/shared/RegisterComponent";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { getRegistersByEvent } from "@/lib/actions/register.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { EventSchemaT } from "@/types/DbSchema";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const EventDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const user = await currentUser();
  const userDbId = user?.publicMetadata.userId as string;

  const event = await getEventById(id);

  if (!event) {
    return (
      <div className="wrapper my-8 flex flex-col gap-4">
        <h1 className="h1-bold">Event not found</h1>
        {/* go back home  */}
        <Link href="/" className="bg-primary p-2 text-2xl rounded-md w-fit">
          Go back home -&gt;
        </Link>
      </div>
    );
  }

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category.id,
    eventId: event.id,
  });

  const users = await getRegistersByEvent(event.id);
  console.log(users);

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.image as string}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-contain object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            {/* update the event */}
            {userDbId === event.organizer.id && (
              <OrganiserActions eventId={event.id} />
            )}
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    FREE
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className=" ml-2 mt-2 sm:mt-0 text-black p-bold-20 ">
                  by{" "}
                  <span className="text-lime-700">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            {userDbId !== event.organizer.id && (
              <RegisterComponent event={event} />
            )}

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                {/* <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                /> */}
                <div className="p-medium-16 lg:p-regular-20 flex flex-col gap-2 shadow-sm transition-all w-full">
                  <p className="border-2 flex flex-row gap-2  p-1 rounded-xl">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={25}
                      height={25}
                    />
                    <b>From</b>-&gt;
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>

                  <p className="border-2 flex flex-row gap-2   p-1 rounded-xl shadow-sm transition-all">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={25}
                      height={25}
                    />
                    <b>To</b> -&gt; &nbsp;&nbsp;&nbsp;&nbsp;
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>
              <div className="p-regular-20 flex items-center gap-1 border-2  p-1 rounded-xl shadow-sm transition-all">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-2 rounded-xl p-2 w-full shadow-sm transition-all">
              <p className="p-bold-20 text-grey-600">What You'll Learn:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
            </div>
            <Link
              className="border-2 rounded-2xl bg-lime-600 text-center text-white pl-4 pr-4 p-2 font-bold text-xl"
              href={event.url}
            >
              Visit to Know more
            </Link>
          </div>
        </div>
      </section>

      {userDbId === event.userId && (
        <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
          <h2 className="h2-bold ">
            Registed users
            {users ? ` (${users.length})` : ""}
          </h2>
          <div>
            {users?.map((user) => (
              // update ##############################################3
              // create a table view for the users who registered for the event with number of users at top of the table
              // or create a new componet for this all together

              <div
                key={user.id}
                className="flex items-center justify-between gap-2 border-2 rounded-xl mt-5 p-2 shadow-sm transition-all"
              >
                <div className="flex flex-row gap-4 ">
                  <Image
                    src={user.photo}
                    alt="user image"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <p className="p-medium-16 lg:p-regular-20">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <span>{user.email}</span>
                {/* <span>{eve}</span> */}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EVENTS with the same category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>

        <Collection
          data={relatedEvents as EventSchemaT[]}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          userDbId={userDbId}
        />
      </section>
    </>
  );
};

export default EventDetails;
