import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Mapview from "@/components/shared/Mapview";
import NearYou from "@/components/shared/NearYou";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { geocodeAddress } from "@/lib/actions/gelocate.actions";
import { checkIfInDistanceLimitInKM } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { EventSchemaT } from "@/types/DbSchema";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// testing code
// get the lat and lon from the address
// const address = "noida";
// const data = await geocodeAddress(address);
// return lat : '28.5706333', lon: '77.3272147'

export default async function Home({ searchParams }: SearchParamProps) {
  // const data = await geocodeAddress("delhi");
  // console.log("location data:", data); // lat and lon of the address

  const user = await currentUser();
  const userType = user?.publicMetadata.type;

  if (user && userType === "new") {
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

  // console.log(
  //   "filtered eventsFilterByLocation:",
  //   eventsFilterByLocation.length
  // );

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold ">
              Unite for Nature: Connecting Volunteers with Environment
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Join our platform to discover and engage in environment events,
              connecting NGOs and volunteers for a greener future!
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="/events">Explore Now</Link>
            </Button>
          </div>
          <div className="rounded-lg ">
            <Image
              src="/assets/images/image.png"
              alt="hero"
              width={1000}
              height={1000}
              className="max-h-[70vh] object-center 2xl:max-h-[50vh] rounded-xl"
            />
          </div>
        </div>
      </section>
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12 max-h-fit">
        <Mapview
          eventDetails={eventsFilterByLocation}
          showTooltip={true}
          className="h-[40vh]"
          userLocation={currentLatnLon}
        />
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

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
