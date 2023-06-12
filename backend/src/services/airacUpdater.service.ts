import sectorService from './sector.service';
import waypointsService from './waypoints.service';

export async function airacCycleUpdater() {
    const startDate = new Date('2023-05-18');
    const currentDate = new Date();

    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    const timeDifference = currentDate.getTime() - startDate.getTime();
    const daysDifference = Math.floor(timeDifference / millisecondsPerDay);

    // check if current day is part of AIRAC cycle
    if (daysDifference % 28 === 0) {
        console.log('Updating waypoints database');
        waypointsService.writeToDatabase();
        console.log('Updating waypoints completed');

        console.log('Updating sectors database');
        sectorService.updateSectors();
        console.log('Updating sectors completed');
    }
}

export default {
    airacCycleUpdater,
};
