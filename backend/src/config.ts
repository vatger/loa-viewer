import * as dotenv from 'dotenv';

dotenv.config();

interface loaViewerConfig {
    mongoUri: string;
    port: number;
    jwtSecret: string;
    adminPw: string | undefined;
}

export default function config(): loaViewerConfig {
    return {
        mongoUri: process.env.MONGO_URI || '',
        port: Number(process.env.PORT) || 3000,
        jwtSecret: process.env.JWT_SECRET || 'superSecret',
        adminPw: process.env.ADMIN_PW,
    };
}
