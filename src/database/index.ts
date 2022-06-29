import Knex from 'knex';
import { Model } from 'objection';

const client = process.env.DB_CLIENT;
const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const knex = Knex({
    client,
    connection: {
        host,
        port,
        user,
        password,
        database
    }
})

Model.knex(knex);

export { knex };
export * from './models';
