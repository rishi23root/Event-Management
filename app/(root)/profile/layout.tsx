import UpdateNewUserType from "@/components/shared/UpdateNewUserType";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  var userMeta = user?.publicMetadata;
  if (user) {
    if (!userMeta?.type) {
      // set the type of the new in the metadata
      await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
          type: "new",
        },
      });
    } else {
      userMeta = {
        ...userMeta,
        type: "new",
      };
    }
  }

  return (
    <div>
      <Suspense>
        {user && userMeta?.type === "new" && user.id && (
          <UpdateNewUserType userId={user.id as string} />
        )}
      </Suspense>
      {children}
    </div>
  );
}
