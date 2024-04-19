'use server';

import axios from 'axios';
export async function geocodeAddress(address: string): Promise<{ lat: string; lon: string } | null> {
    // return the lat and lon of the address
    console.log('GEOCODE_API_KEY:', process.env.GEOCODE_API_KEY);
    if (!process.env.GEOCODE_API_KEY) {
        throw new Error('GEOCODE_API_KEY is not provided');
    }
    try {
        const url = `https://geocode.maps.co/search?q=${address}&api_key=${process.env.GEOCODE_API_KEY}`;
        console.log('url:', url);
        const response = await axios(url);
        // console.log(Object.keys(response.data[0]));
        const { lat, lon } = response.data[0];
        return { lat, lon };
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
}
