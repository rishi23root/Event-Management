import axios from 'axios';

const API_KEY = '662174396ac2c283650243bza458c6a';

export async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
    try {
        const response = await axios.get(`https://geocode.maps.co/search?q=${address}&api_key=${API_KEY}`);
        const data = response.data[0];
        const { lat, lon } = data; // Extract lat and lon 
        console.log(lat, lon);
        return { lat,lon };
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
}
