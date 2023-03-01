import * as dotenv from 'dotenv';
import packageJson from '../package.json';

dotenv.config();

interface loaViewerConfig {
    mongoUri: string;
    port: number;
    jwtSecret: string;
    adminPw: string | undefined;
    version: string;
}

export default function config(): loaViewerConfig {
    return {
        mongoUri: process.env.MONGO_URI || '',
        port: Number(process.env.PORT) || 3000,
        jwtSecret: process.env.JWT_SECRET || 'superSecret',
        adminPw: process.env.ADMIN_PW,
        version: packageJson.version ?? '',
    };
}
