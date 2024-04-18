"use client";

import { deleteEvent } from "@/lib/actions/event.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

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
        <Button
          className="text-xl hover:scale-105 shadow-md bg-red-400 hover:bg-gray-700"
          onClick={() => {
            deleteEvent({ eventId }).then((res) => {
              router.push("/events");
            });
          }}
        >
          Delete Event
        </Button>
      </div>
    </div>
  );
}
