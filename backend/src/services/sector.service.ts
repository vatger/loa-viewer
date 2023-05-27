import axios from 'axios';
import Airspace from '@shared/interfaces/sector.interface';

async function getSectorData(filename: string): Promise<any> {
    try {
        const url: string = 'https://raw.githubusercontent.com/lennycolton/vatglasses-data/main/data/' + filename + '.json';
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error while at ${getSectorData.name}`);
        console.error(error);
    }
}

async function retrieveAirspacesFromCountries(countries: string[]): Promise<Airspace[]> {
    try {
        const airspaces: Airspace[] = [];

        for (const country of countries) {
            const data = await getSectorData(country);
            const airspacedata = data.airspace;

            if (airspacedata) {
                for (const airspace of airspacedata) {
                    airspaces.push(airspace);
                }
            }
        }

        return airspaces;
    } catch (error) {
        console.error(`Error while at ${retrieveAirspacesFromCountries.name}`);
        console.error(error);
    }

    return [];
}

export default {
    getSectorData,
    retrieveAirspacesFromCountries,
};
