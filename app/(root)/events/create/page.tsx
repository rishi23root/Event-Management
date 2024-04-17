import EventForm from "@/components/shared/EventForm";
import { auth, currentUser } from "@clerk/nextjs";

const CreateEvent = async () => {
  const user = await currentUser();
  const userDBId = user?.publicMetadata.userId;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userDBId as string} type="Create" />
      </div>
    </>
  );
};

export default CreateEvent;
