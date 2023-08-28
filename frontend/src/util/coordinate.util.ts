import { LatLngExpression } from 'leaflet';

export function getAverageOfCoordinates(coordinates: string[][]): LatLngExpression {
    let latSum = 0;
    let lngSum = 0;
    let count = 0;

    coordinates.forEach(([lat, lng]) => {
        const latNum = convertLatitudeToNumber(lat);
        const lngNum = convertLongitudeToNumber(lng);

        latSum += latNum;
        lngSum += lngNum;

        count++;
    });

    const avgLat = latSum / count;
    const avgLng = lngSum / count;

    // console.log(avgLat);
    // console.log(avgLng);

    return [avgLat, avgLng];
}

export function convertCoordinatestoLatLngExpression(coordinates: string[][]): LatLngExpression[] {
    return coordinates.map(([lat, lng]) => {
        const latNum = convertLatitudeToNumber(lat);
        const lngNum = convertLongitudeToNumber(lng);

        return [latNum, lngNum];
    });
}

export function convertLatitudeToNumber(latitude: string): number {
    let latSign = 1;

    if (latitude.startsWith('-')) {
        latitude = latitude.slice(1); // Remove the '-' character
        latSign = -1;
    }
    const latDegrees = parseInt(latitude.slice(0, 2));
    const latMinutes = parseInt(latitude.slice(2, 4));
    const latSeconds = parseInt(latitude.slice(4, 9));
    const latNum = (latDegrees + latMinutes / 60 + latSeconds / 3600) * latSign;

    return latNum;
}

export function convertLongitudeToNumber(longitude: string): number {
    let latSign = 1;

    if (longitude.startsWith('-')) {
        longitude = longitude.slice(1); // Remove the '-' character
        latSign = -1;
    }
    const lngDegrees = parseInt(longitude.slice(0, 3));
    const lngMinutes = parseInt(longitude.slice(3, 5));
    const lngSeconds = parseInt(longitude.slice(5, 8));
    const lngNum = (lngDegrees + lngMinutes / 60 + lngSeconds / 3600) * latSign;

    return lngNum;
}
