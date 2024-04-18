"use client";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { EventSchemaT } from "@/types/DbSchema";
import { useRouter } from "next/navigation";

type CardProps = {
  event: EventSchemaT;
  userDbId: string;
};

const Card = ({ event, userDbId }: CardProps) => {
  const router = useRouter();
  const isEventCreator = userDbId === event.organizer.id;

  return (
    <div className="relative group">
      {/* IS EVENT CREATOR ... */}
      {isEventCreator && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all z-50">
          <Link href={`/events/${event.id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>

          <DeleteConfirmation eventId={event.id} />
        </div>
      )}

      <div
        onClick={() => {
          router.push(`/events/${event.id}`);
        }}
        className="cursor-pointer flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px] border z-10"
      >
        {}
        <Image
          src={
            event.image
              ? (event.image as string)
              : "/assets/images/placeholder.png"
          }
          alt={event.title}
          width={400}
          height={230}
          className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
        />

        <div className="flex flex-col gap-2 p-5 md:gap-4 border-t ">
          <div>
            <p className="font-semibold flex-1 text-2xl">{event.title}</p>

            <p className="p-medium-16 p-medium-18 text-grey-500">
              {formatDateTime(event.startDateTime).dateTime}
            </p>

            <div className="flex-between w-full">
              <p className="p-medium-14 md:p-medium-16 text-grey-600 text-lg">
                {event.organizer.firstName} {event.organizer.lastName}
              </p>
            </div>
          </div>
          <div className="flex-1 h-max">
            <p className="w-fit rounded-full bg-grey-500/10 px-4 py-2 my-2 text-grey-500 line-clamp-1 text-lg">
              {event.category.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
