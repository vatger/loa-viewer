import * as dotenv from 'dotenv';

dotenv.config();

interface loaViewerConfig {
    mongoUri: string;
    port: number;
    adminPassword: string;
}

export default function config(): loaViewerConfig {
    return {
        mongoUri: process.env.MONGO_URI || '',
        port: Number(process.env.PORT) || 3000,
        adminPassword: process.env.REACT_APP_ADMIN_PASSWORD || '',
    };
}
