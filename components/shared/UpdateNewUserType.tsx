"use client";
// help in updating the type of user in the data and metadata
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateUserType } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function UpdateNewUserType({ userId }: { userId: string }) {
  console.log("userId", userId);
  const [seletedtype, setSeletedtype] = useState("new");

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Chose Your Aim</AlertDialogTitle>
          <AlertDialogDescription className="w-full flex gap-4">
            <span
              className={cn(
                "w-full h-16 border rounded-md text-2xl flex justify-center items-center shadow-md hover:scale-105 cursor-pointer",
                seletedtype === "volunteer" && "bg-gray-200"
              )}
              onClick={() => setSeletedtype("volunteer")}
            >
              Volunteer
            </span>
            <span
              className={cn(
                "w-full h-16 border rounded-md text-2xl flex justify-center items-center shadow-md hover:scale-105 cursor-pointer  ",
                seletedtype === "ngo" && "bg-gray-200"
              )}
              onClick={() => setSeletedtype("ngo")}
            >
              NGO
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              updateUserType(userId, seletedtype);
            }}
          >
            update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
