// page to list all the event present in the database

import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Mapview from "@/components/shared/Mapview";
import NearYou from "@/components/shared/NearYou";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { checkIfInDistanceLimitInKM } from "@/lib/utils";
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
  const neerBy = (searchParams?.neerBy as string) || "";
  const currenLocation = (searchParams?.latnlon as string) || "";

  const currentLatnLon =
    currenLocation && neerBy.length > 0
      ? {
          lat: parseFloat(currenLocation.split(",")[0]),
          lon: parseFloat(currenLocation.split(",")[1]),
        }
      : undefined;

  var events = (await getAllEvents({
    query: searchText,
    category,
  })) as unknown as EventSchemaT[];

  // console.log("initial total event :", events.length);

  const eventsFilterByLocation =
    events && events.length < 1
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
          })
          .filter((e) => {
            if (currenLocation === "") {
              return true;
            }
            if (neerBy.length > 0 && currentLatnLon) {
              // console.log("current: ", currentLatnLon);
              const distance = parseInt(neerBy); // distance in km
              // get current location cordiantes from browser, client side
              return checkIfInDistanceLimitInKM(
                currentLatnLon.lat,
                currentLatnLon.lon,
                e.geo.lat,
                e.geo.lon,
                distance
              );
            } else {
              return true;
            }
          });

  if (neerBy.length > 0) {
    var eventFilteredLocationId = eventsFilterByLocation.map((e) => {
      return e.id;
    });
    events = events.filter((e) => {
      // console.log("e:", e.location, eventFilteredLocationId.includes(e.id));
      return (
        eventFilteredLocationId.includes(e.id) ||
        e.location.toLowerCase().includes("online")
      );
    });
  }

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
          <NearYou />
        </div>
        <div className="flex w-full flex-col gap-5 md:flex-row text-md font-semibold">
          Total Events
          {searchText.length > 0 || category.length > 0 || neerBy.length > 0
            ? " found "
            : " "}
          - {events.length}
        </div>

        <Collection
          data={events}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          userDbId="hii"
        />
      </section>
    </>
  );
}
