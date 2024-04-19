import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getRegiestersByUser } from "@/lib/actions/register.actions";
import { SearchParamProps } from "@/types";
import { EventSchemaT } from "@/types/DbSchema";
import Link from "next/link";
import React from "react";
import { currentUser } from "@clerk/nextjs";

export default async function ProfilePage({ searchParams }: SearchParamProps) {
  const user = await currentUser();
  const userId = user?.id as string;
  // get user type
  const userDbId = user?.publicMetadata?.userId as string;
  const userType = user?.publicMetadata?.type;
  console.log(userId, userType);

  if (userType === "ngo") {
    const organizedEvents = await getEventsByUser({
      userDbId,
    });
    return (
      <>
        {/* Events Organized */}
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className="h3-bold text-center sm:text-left">
              Events Organized
            </h3>
            <Button asChild size="lg" className="button hidden sm:flex">
              <Link href="/events/create">Create New Event</Link>
            </Button>
          </div>
        </section>

        <section className="wrapper my-8">
          <Collection
            data={organizedEvents as EventSchemaT[]}
            emptyTitle="No events have been created yet"
            emptyStateSubtext="Go create some now"
            userDbId={userDbId}
          />
        </section>
      </>
    );
  } else if (userType === "volunteer") {
    const regiesteredEvent = await getRegiestersByUser(userId);
    // console.log(regiesteredEvent);

    return (
      <>
        {/* My Tickets */}
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex items-center justify-center sm:justify-between">
            <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
            <Button asChild size="lg" className="button hidden sm:flex">
              <Link href="/events">Explore More Events</Link>
            </Button>
          </div>
        </section>

        <section className="wrapper my-8">
          {regiesteredEvent?.length && (
            <Collection
              data={regiesteredEvent as EventSchemaT[]}
              emptyTitle="No event tickets purchased yet"
              emptyStateSubtext="No worries - plenty of exciting events to explore!"
              userDbId={userDbId}
            />
          )}
        </section>
      </>
    );
  } else {
    return null;
  }
}
