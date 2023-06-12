import { Workbook, Worksheet } from 'exceljs';
import getDataXlsxs from './aipData.service';
import Waypoint from '@shared/interfaces/waypoint.interface';
import waypointModel, { WaypointDocument } from '../models/waypoint.model';

export async function extractWaypoints(): Promise<Waypoint[]> {
    try {
        const excelData = await getDataXlsxs();
        const waypoints: Waypoint[] = [];

        const processWorksheet = (worksheet, waypoints) => {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    return;
                }

                const name = row.getCell(1).value?.toString();
                let latitude: number | undefined;
                let longitude: number | undefined;

                // Check if it's the waypoints or navaids worksheet
                if (worksheet.name === 'Waypoints') {
                    const waypointType = row.getCell(3).value?.toString();
                    // skip visual reporting points and runway definitions
                    if (waypointType === 'OTHER:ADHP' && name.length < 4) {
                        return;
                    }

                    latitude = Number(row.getCell(5).value);
                    longitude = Number(row.getCell(6).value);
                } else if (worksheet.name === 'Navaids') {
                    const navaidType = row.getCell(2).value?.toString();
                    // skip everything but VORs and NDBs
                    if (navaidType !== 'VOR' && navaidType !== 'NDB') {
                        return;
                    }

                    latitude = Number(row.getCell(4).value);
                    longitude = Number(row.getCell(5).value);
                }

                if (name === undefined || latitude === undefined || longitude === undefined) {
                    return;
                }

                const waypoint = {
                    name: name,
                    latitude: latitude,
                    longitude: longitude,
                };

                waypoints.push(waypoint);
            });
        };

        // waypoints xlsx
        if (excelData?.waypointsExcel) {
            const ExcelWorkbook = new Workbook();
            await ExcelWorkbook.xlsx.load(excelData.waypointsExcel);

            const worksheet = ExcelWorkbook.worksheets[1];
            processWorksheet(worksheet, waypoints);
        }

        // navaids xlsx
        if (excelData?.navaidsExcel) {
            const ExcelWorkbook = new Workbook();
            await ExcelWorkbook.xlsx.load(excelData.navaidsExcel);

            const worksheet = ExcelWorkbook.worksheets[1];
            processWorksheet(worksheet, waypoints);
        }

        return waypoints;
    } catch (error) {
        console.error('Error extracting waypoints:', error);
        return [];
    }
}

export async function writeToDatabase() {
    const waypoints = await extractWaypoints();

    if (waypoints.length !== 0) {
        // Clear collection
        const clearCollection = () => {
            return new Promise<void>((resolve, reject) => {
                waypointModel.deleteMany({}, error => {
                    if (error) {
                        console.error('Error clearing collection:', error);
                        reject(error);
                    } else {
                        console.log('Collection cleared successfully.');
                        resolve();
                    }
                });
            });
        };

        // Retrieve count of items in collection
        const retrieveItemCount = () => {
            return new Promise<void>((resolve, reject) => {
                waypointModel.countDocuments({}, (error, count) => {
                    if (error) {
                        console.error('Error retrieving document count:', error);
                        reject(error);
                    } else {
                        console.log('Number of items in the collection:', count);
                        resolve();
                    }
                });
            });
        };

        // Insert fetched waypoints
        const insertWaypoints = () => {
            return new Promise<void>((resolve, reject) => {
                waypointModel.insertMany(waypoints, err => {
                    if (err) {
                        console.error('Error importing waypoints:', err);
                        reject(err);
                    } else {
                        console.log('Waypoints imported successfully.');
                        resolve();
                    }
                });
            });
        };

        // Run operations sequentially
        clearCollection()
            .then(insertWaypoints)
            .then(retrieveItemCount)
            .catch(error => {
                console.error('An error occurred:', error);
            });
    }
}

export async function getAllWaypoints() {
    try {
        const waypoint: WaypointDocument[] = await waypointModel.find().exec();

        return waypoint;
    } catch (e) {
        throw e;
    }
}

export async function airacCycleUpdater() {
    const startDate = new Date('2023-05-18');
    const currentDate = new Date();

    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    const timeDifference = currentDate.getTime() - startDate.getTime();
    const daysDifference = Math.floor(timeDifference / millisecondsPerDay);

    // check if current day is part of AIRAC cycle
    if (daysDifference % 28 === 0) {
        console.log('Updating waypoints database');

        await writeToDatabase();

        console.log('Updating waypoints completed');
    }
}

export default {
    writeToDatabase,
    getAllWaypoints,
    airacCycleUpdater,
};
