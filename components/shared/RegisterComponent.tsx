"use client";
import { registerUser } from "@/lib/actions/register.actions";
import { EventSchemaT } from "@/types/DbSchema";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
const RegisterComponent = ({ event }: { event: EventSchemaT }) => {
  const { user } = useUser();
  const userDbId = user?.publicMetadata.userId as string;
  const userType = user?.publicMetadata.type;
  const isNgo = userType === "ngo";
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const eventId = event.id as string;
  const router = useRouter();
  // get current path of the page
  const pathname = usePathname();

  const [isLogged, setIsLogged] = useState(false);

  const handleRegister = async () => {
    console.log("Registering for event", eventId);
    if (!pathname.startsWith("/events")) {
      router.push(`/events/${eventId}`);
      return;
    }
    setIsLogged(true);
    // save data in the backend using db actions
    const response = await registerUser({ userDbId, eventId });
    console.log(response);

    if (response) {
      console.log("User registered successfully");
    } else {
      console.error("Error registering user");
    }
    setIsLogged(false);
  };

  if (isNgo) {
    return null;
  }

  return (
    <span className="flex items-center gap-3">
      {hasEventFinished ? (
        <span className="p-2 text-red-400">
          Sorry, tickets are no longer available.
        </span>
      ) : (
        <>
          <SignedOut>
            <Button
              asChild
              size="lg"
              className="button sm:w-fit shadow-md p-6 border transform transition-all duration-75 hover:bg-white hover:text-lime-600 hover:border-lime-600 hover:shadow-lg"
            >
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {/* if user is already registed then don't show this btn */}
            {!event.attendees.includes(userDbId) ? (
              <Button
                type="submit"
                role="link"
                size="lg"
                onClick={handleRegister}
                className="button sm:w-fit shadow-md p-6 border transform transition-all duration-75 hover:bg-white hover:text-lime-600 hover:border-lime-600 hover:shadow-lg"
              >
                <span className="text-xl">
                  {isLogged ? "Registering..." : "Register"}
                </span>
              </Button>
            ) : (
              <Button className="text-lg font-semibold p-2 bg-grey-500/30 text-black">
                Thanks for registering :)
              </Button>
            )}
          </SignedIn>
        </>
      )}
    </span>
  );
};

export default RegisterComponent;
