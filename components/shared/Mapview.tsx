"use client";

import { cn } from "@/lib/utils";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useEffect, useRef } from "react";

const zoom = 10;

function Mapview({
  location,
  className,
}: {
  location: { lat: number; lon: number }[];
  className?: string;
}) {
  // console.log("location:", location);

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  maptilersdk.config.apiKey = "i9FuGGABnoZwqpXaBGfi";

  const centerLocation =
    location.length > 0 && location[0].lat && location[0].lon
      ? location[0]
      : { lat: 28.5706333, lon: 77.3272147 };

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [centerLocation.lon, centerLocation.lat],
      zoom: zoom,
    }) as maptilersdk.Map;
  }, []);

  useEffect(() => {
    // console.log("location added to map:", location);
    location.forEach((palce) => {
      new maptilersdk.Marker({ color: "#32cd32" })
        .setLngLat([palce.lon, palce.lat])
        .addTo(map.current);
    });
  }, [location]);

  return (
    <div className={cn("map-wrap", className)}>
      <div ref={mapContainer} className="map h-full" />
    </div>
  );
}

export default Mapview;
