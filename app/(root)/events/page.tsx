// page to list all the event present in the database

import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
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
    redirect("/porfile");
  }

  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    limit: 6,
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
