"use client";

import { cn } from "@/lib/utils";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useEffect, useRef } from "react";

const zoom = 13;

function Mapview({
  location,
  className,
}: {
  location: { lat: number; lng: number }[];
  className?: string;
}) {
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const noida = { lng: 77.3272147, lat: 28.5706333 };
  maptilersdk.config.apiKey = "i9FuGGABnoZwqpXaBGfi";

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [noida.lng, noida.lat],
      zoom: zoom,
    }) as maptilersdk.Map;

    new maptilersdk.Marker({ color: "#32cd32" })
      .setLngLat([location[0].lng, location[0].lat])
      .addTo(map.current);
    // location.forEach((palce) => {
    // });
  }, []);

  return (
    <div className={cn("map-wrap", className)}>
      <div ref={mapContainer} className="map h-full" />
    </div>
  );
}

export default Mapview;
