import * as dotenv from 'dotenv';

dotenv.config();

interface loaViewerConfig {
    mongoUri: string;
    port: number;
}

export default function config(): loaViewerConfig {
    return {
        mongoUri: process.env.MONGO_URI || '',
        port: Number(process.env.PORT) || 3000,
    };
}
