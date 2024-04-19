// page to list all the event present in the database

import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Mapview from "@/components/shared/Mapview";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import { EventSchemaT } from "@/types/DbSchema";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function showListOfAllEvent({
  searchParams,
}: SearchParamProps) {
  const user = await currentUser();
  const userType = user?.publicMetadata.type;

  if (userType === "new") {
    redirect("/profile");
  }

  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = (await getAllEvents({
    query: searchText,
    category,
  })) as unknown as EventSchemaT[];

  const eventDetails =
    events.length < 1
      ? []
      : events
          .filter((e) => e.coordinates !== "")
          .map((event) => {
            return {
              id: event.id,
              geo: event.coordinates,
              title: event.title,
            };
          })
          .map((e) => {
            // ${data.lat},${data.lon}
            const data = e.geo.split(",");
            return {
              id: e.id,
              geo: { lat: parseFloat(data[0]), lon: parseFloat(data[1]) },
              title: e.title,
            };
          });
  // GET ALL EVENTS in future and show them
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex justify-between ">
          <h3 className=" h3-bold text-center sm:text-left">
            All Upcoming Events
          </h3>
          {userType === "ngo" && (
            <Link href="/events/create">
              <Button className="rounded-md text-xl">Create Event +</Button>
            </Link>
          )}
        </div>
      </section>
      {/* add btn to add a event */}

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <section className="wrapper my-8 flex flex-col gap-8 md:gap-12 max-h-fit">
          <Mapview
            eventDetails={eventDetails}
            showTooltip={true}
            className="h-[40vh]"
          />
        </section>

        <Collection
          data={events as EventSchemaT[]}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          userDbId=""
        />
      </section>
    </>
  );
}
