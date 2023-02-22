import axios from 'axios';

async function getConditions() {
    try {
        const response = await axios.get('/api/v1/conditions');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteCondition(id: string | null) {
    try {
        const response = await axios.delete('/api/v1/conditions/' + id);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addCondition(body: object) {
    try {
        const response = await axios.post('/api/v1/conditions/', body);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function updateCondition(id: string, body: object) {
    try {
        await axios.patch('/api/v1/conditions/' + id, body);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    getConditions,
    deleteCondition,
    addCondition,
    updateCondition,
};
