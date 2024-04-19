"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

const Search = ({
  placeholder = "Search title...",
}: {
  placeholder?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentquery = searchParams.get("query") || "";

  const updateQuery = useCallback(
    debounce(async (q: string) => {
      let newUrl = "";
      if (q) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: q,
        });
        router.push(newUrl, { scroll: false });
      } else {
        console.log("url before: ", newUrl);
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
        console.log("url before: ", newUrl);

        router.push(newUrl, { scroll: false });
      }
    }, 500),
    []
  );
  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     let newUrl = "";

  //     if (query) {
  //       newUrl = formUrlQuery({
  //         params: searchParams.toString(),
  //         key: "query",
  //         value: query,
  //       });
  //     } else {
  //       newUrl = removeKeysFromQuery({
  //         params: searchParams.toString(),
  //         keysToRemove: ["query"],
  //       });
  //     }

  //     router.push(newUrl, { scroll: false });
  //   }, 300);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [query, searchParams, router]);

  return (
    <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
      <Image
        src="/assets/icons/search.svg"
        alt="search"
        width={24}
        height={24}
      />
      <Input
        type="text"
        defaultValue={currentquery}
        placeholder={placeholder}
        onChange={(e) => {
          updateQuery(e.target.value);
        }}
        className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default Search;
