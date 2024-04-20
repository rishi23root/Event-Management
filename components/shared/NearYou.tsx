"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/category.actions";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Category } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Category;
const NearYou = () => {
  const [neerKey, setNeerKey] = useState<string[]>([
    "Around - 50 km",
    "Around - 70 km",
    "Around - 100 km",
  ]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNeerByValue = searchParams.get("neerBy") || "";
  const currentNeerBy = currentNeerByValue.length
    ? currentNeerByValue !== "All"
      ? `Around - ${currentNeerByValue} km`
      : "All"
    : undefined;

  function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.permissions.query({ name: "geolocation" }).catch((error) => {
        reject();
      });
      // if we get permission to access the location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (location) {
          let coordinates = {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          };
          resolve(coordinates);
        });
      } else {
        reject();
      }
    });
  }

  const onSelectNeerBy = async (neerBy: string) => {
    let newUrl = "";

    if (neerBy && neerBy !== "All") {
      // get current lat and lon from browser geo location api
      try {
        const currentLocation = (await getLocation()) as {
          lat: number;
          lon: number;
        };
        // console.log(currentLocation)

        const value = neerBy.split(" ")[2];
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "neerBy",
          value: value,
        });

        // add latnlon if not present
        if (searchParams.get("latnlon")) {
          newUrl = newUrl.replace(/(&*)latnlon=[^&]*/g, "");
        }
        newUrl =
          newUrl +
          "&latnlon=" +
          `${currentLocation.lat},${currentLocation.lon}`;
      } catch {
        console.log("error in getting location");
        return;
      }
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["neerBy"],
      });
      // remove latnlon
      newUrl = newUrl.replace(/(&*)latnlon=[^&]*/g, "");
      console.log(newUrl);
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <Select
      defaultValue={currentNeerBy}
      onValueChange={(value: string) => onSelectNeerBy(value)}
    >
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Neer You" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">
          All
        </SelectItem>

        {neerKey.map((value, index) => (
          <SelectItem
            value={value}
            key={index}
            className="select-item p-regular-14"
          >
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NearYou;
