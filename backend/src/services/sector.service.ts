import axios from 'axios';
import Airspace from '@shared/interfaces/sector.interface';
import sectorModel, { SectorDocument } from '../models/sector.model';

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
                    airspace.country = country;
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

async function updateSectors() {
    // clear collection
    const clearCollection = () => {
        return new Promise<void>((resolve, reject) => {
            sectorModel.deleteMany({}, error => {
                if (error) {
                    console.error('Error clearing collection:', error);
                    reject(error);
                } else {
                    console.log('Sector collection cleared successfully.');
                    resolve();
                }
            });
        });
    };

    // fetch sectors
    // filenames as given in https://github.com/lennycolton/vatglasses-data/tree/main/data
    const countries: string[] = ['germany', 'nl', 'belux', 'austria', 'czechia'];
    const sectors = await retrieveAirspacesFromCountries(countries);

    // Insert fetched sectors
    const insertSectors = () => {
        return new Promise<void>((resolve, reject) => {
            sectorModel.insertMany(sectors, err => {
                if (err) {
                    console.error('Error importing waypoints:', err);
                    reject(err);
                } else {
                    console.log('Sectors imported successfully.');
                    resolve();
                }
            });
        });
    };

    // Run operations sequentially
    clearCollection()
        .then(insertSectors)
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

async function getAllSectors() {
    try {
        const waypoint: SectorDocument[] = await sectorModel.find().exec();

        return waypoint;
    } catch (error) {
        console.error(`Error while at ${getAllSectors.name}`);
        console.error(error);
    }
}

export default {
    getSectorData,
    retrieveAirspacesFromCountries,
    getAllSectors,
    updateSectors,
};
