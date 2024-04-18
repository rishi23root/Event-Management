"use client";

import { EventSchemaT } from "@/types/DbSchema";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const RegisterComponent = ({ event }: { event: EventSchemaT }) => {
  const { user } = useUser();
  const userDbId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const eventId = event.id as string;
  const router = useRouter();
  // get current path of the page
  const pathname = usePathname();

  const handleRegister = async () => {
    console.log("Registering for event", eventId);
    if (!pathname.startsWith("/events")) {
      router.push(`/events/${eventId}`);
      return;
    }

    // save data in the backend using db actions 
    

  };

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button
              asChild
              size="lg"
              className="button sm:w-fit shadow-md p-6 border transform transition-all duration-75 hover:bg-white hover:text-primary-500 hover:border-primary-500 hover:shadow-lg"
            >
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {/* <Register eventId={eventId} userDbId={userDbId} /> */}
            <Button
              type="submit"
              role="link"
              size="lg"
              onClick={handleRegister}
              className="button sm:w-fit shadow-md p-6 border transform transition-all duration-75 hover:bg-white hover:text-primary-500 hover:border-primary-500 hover:shadow-lg"
            >
              <span className="text-xl">Register</span>
            </Button>
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default RegisterComponent;
