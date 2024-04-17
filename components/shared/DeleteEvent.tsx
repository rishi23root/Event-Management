"use client";

import { deleteEvent } from "@/lib/actions/event.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function DeleteEventbtn({ eventId }: { eventId: string }) {
  const router = useRouter();
  return (
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
  );
}
