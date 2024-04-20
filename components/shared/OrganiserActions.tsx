"use client";

import { deleteEvent } from "@/lib/actions/event.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DeleteConfirmation } from "./DeleteConfirmation";

export default function OrganiserActions({ eventId }: { eventId: string }) {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center gap-4 border-b border-primary/20 pb-2 ">
      <span className="text-lg font-bold ">Organizer Actions -</span>
      <div className="flex gap-4">
        {/* chekc if organizer is the current user */}
        <Link href={`/events/${eventId}/update`}>
          <Button className="text-xl hover:scale-105 shadow-md">
            Edit Event
          </Button>
        </Link>
        <DeleteConfirmation
          eventId={eventId}
          cb={() => {
            router.push("/events");
          }}
        >
          <span className="text-xl hover:scale-105 shadow-md bg-red-400 hover:bg-gray-700 p-[6px] rounded-md text-white">
            Delete Event
          </span>
        </DeleteConfirmation>
      </div>
    </div>
  );
}
