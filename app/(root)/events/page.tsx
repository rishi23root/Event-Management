// page to list all the event present in the database

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function showListOfAllEvent() {
  // GET ALL EVENTS in future and show them
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex justify-between ">
          <h3 className=" h3-bold text-center sm:text-left">
            All Upcoming Events
          </h3>
          <Link href="/events/create">
            <Button className="rounded-md">Create Event +</Button>
          </Link>
        </div>
      </section>
      {/* add btn to add a event */}

      <section className="wrapper py-5 md:py-10">
        <h4 className="h4-bold">Events</h4>
        <p className="text-center sm:text-left">
          Here are all the upcoming events
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Event Card */}
          <div className="event-card">
            <div className="event-card__image">
              <img src="/assets/images/event-placeholder.jpg" alt="event" />
            </div>
            <div className="event-card__content">
              <h5 className="h5-bold">Event Title</h5>
              <p className="text-sm text-gray-500">Event Date</p>
              <p className="text-sm text-gray-500">Event Location</p>
              <p className="text-sm text-gray-500">Event Description</p>
            </div>
            <div className="event-card__footer">
              <button className="btn btn-primary">View Event</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
