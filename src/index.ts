import express from 'express';
import Debug from 'debug';
import 'dotenv/config';

import userRouter from './routes/users';
import petRouter from './routes/pets';

export const debug = new Debug('server:objection-orm');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */

app.use('/users', userRouter);
app.use('/pets', petRouter);

const port = process.env.PORT || 3333;

app.listen(port, () => {
    debug('Server running on port ' + port);
})
