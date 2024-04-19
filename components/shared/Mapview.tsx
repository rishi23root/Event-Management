"use client";

import { cn } from "@/lib/utils";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useEffect, useRef } from "react";

const zoom = 8;

function Mapview({
  eventDetails,
  className,
  showTooltip = true,
}: {
  eventDetails: {
    id: string;
    geo: { lat: number; lon: number };
    title: string;
  }[];
  className?: string;
  showTooltip: boolean;
}) {
  // console.log("location:", location);

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const marcadores: any = [];
  const location = eventDetails.map((event) => {
    return event.geo;
  });

  maptilersdk.config.apiKey = "i9FuGGABnoZwqpXaBGfi";

  var centerLocation =
    location.length > 0 && location[0].lat && location[0].lon
      ? location[0]
      : { lat: 28.5706333, lon: 77.3272147 };

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    console.log(centerLocation, location[0]);

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [centerLocation.lon, centerLocation.lat],
      zoom: zoom,
    }) as maptilersdk.Map;
  }, []);

  useEffect(() => {
    // console.log(location);
    if (location.length === 1) {
      map.current.setCenter([location[0].lon, location[0].lat]);
    } else {
      // take all locations and set the map to fit all locations
      const bounds = new maptilersdk.LngLatBounds();
      location.forEach((place) => {
        bounds.extend([place.lon, place.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [location]);

  useEffect(() => {
    // console.log("location added to map:", location);
    eventDetails.forEach((each) => {
      const palce = each.geo;

      // create a marker with the tooltip
      if (showTooltip) {
        const popup = new maptilersdk.Popup()
          .setLngLat([palce.lon, palce.lat])
          .setHTML(
            // remove the ring from the link on open
            `<a href="/events/${each.id}" class="text-blue-500 text-md font-bold hover:underline
            focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent">${each.title}</a>`
          )
          .addTo(map.current);
        const newMarker = new maptilersdk.Marker({ color: "#32cd32" })
          .setLngLat([palce.lon, palce.lat])
          .setPopup(popup)
          .addTo(map.current);
        marcadores.push(newMarker);
      } else {
        const newMarker = new maptilersdk.Marker({ color: "#32cd32" })
          .setLngLat([palce.lon, palce.lat])
          .addTo(map.current);
        marcadores.push(newMarker);
      }
    });
    return () => {
      marcadores.forEach((marker: any) => {
        marker.remove();
      });
    };
  }, [location]);

  return (
    <div className={cn("map-wrap", className)}>
      <div ref={mapContainer} className="map h-full" />
    </div>
  );
}

export default Mapview;
