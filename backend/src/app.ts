import express from 'express';
import bodyparser from 'body-parser';
import router from './router';
import errors from '@shared/errors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import config from './config';
import waypointsService, { airacCycleUpdater } from './services/waypoints.service';

(async () => {
    console.info('starting up');

    if (!config().mongoUri) {
        throw new Error('MONGO_URI has to be set!');
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(config().mongoUri);

    const app = express();

    app.use(bodyparser.json());
    app.use(cookieParser());

    app.use('/api/v1', router);

    const frontendRoot = '/opt/frontend/build';
    app.use(express.static(frontendRoot));
    app.use((req, res) => res.sendFile(`${frontendRoot}/index.html`));

    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(err);

        if (err instanceof errors.APIError) {
            return res.status(err.responseCode).json(err);
        }

        if (err instanceof errors.CustomError) {
            return res.status(500).json(err);
        }

        res.status(500).json({ message: err.message });
    });

    const port = 3000;
    app.listen(port, () => {
        console.info('listening on port', port);
    });

    // create waypoints collection then schedule airacCycleUpdater
    waypointsService.writeToDatabase();
    setInterval(airacCycleUpdater, 24 * 60 * 60 * 1000);
})();
