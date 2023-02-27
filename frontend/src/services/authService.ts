import axios from 'axios';

async function loginUser(body: any) {
    try {
        await axios.post('/api/v1/auth/login', body);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function logoutUser() {
    try {
        await axios.get('/api/v1/auth/logout');
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getUser() {
    try {
        await axios.get('/api/v1/auth/profile');
    } catch (error) {
        throw error;
    }
}

export default {
    loginUser,
    logoutUser,
    getUser,
};
