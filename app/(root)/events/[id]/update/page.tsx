"use server";
import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { EventSchemaT } from "@/types/DbSchema";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  const user = await currentUser();
  const userId = user?.publicMetadata.userId as string;
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

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          type="Update"
          event={event as EventSchemaT}
          eventId={event.id}
          userId={userId}
        />
      </div>
    </>
  );
};

export default UpdateEvent;
