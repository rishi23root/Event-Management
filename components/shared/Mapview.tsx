"use client"

import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { geocodeAddress } from '@/lib/actions/gelocate.actions';

function Mapview() {
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    useEffect(() => {
        async function fetchData() {
            const address = 'noida';
            const data = await geocodeAddress(address);
            if (data) {
                setLocation(data);
            } else {
                console.log('Failed to fetch location data');
            }
        }

        fetchData();
    }, []);


    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maptilersdk.Map | null>(null);
    const [zoom] = useState(14);
    maptilersdk.config.apiKey = 'i9FuGGABnoZwqpXaBGfi';
  
    useEffect(() => {
        if (!mapContainer.current || !location) return; //check the availibility

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.HYBRID,
            center: [location.lon , location.lat],
            geolocate: maptilersdk.GeolocationType.POINT,
            zoom: zoom
        });

        new maptilersdk.Marker({ color: "#32cd32" })
            .setLngLat([location.lon, location.lat])
            .addTo(map.current);
    }, [location, zoom]);

   
    return (
        <div className='map-wrap'>
            <div ref={mapContainer} className='map' />
            {location ? (
                <div>
                    Latitude: {location.lat}, Longitude: {location.lon}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Mapview;
