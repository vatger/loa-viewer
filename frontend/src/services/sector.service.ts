import axios from 'axios';

async function getWaypoints() {
    try {
        const response = await axios.get('/api/v1/sectors');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export default {
    getWaypoints,
};
