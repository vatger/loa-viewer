import axios from 'axios';

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

export default {
    getSectorData,
};
