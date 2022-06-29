import {Model, snakeCaseMappers} from 'objection';
import { v4 as uuid } from 'uuid';
import User from './User';

class Pet extends Model {
    static get tableName() {
        return 'pets';
    }

    private id: string;
    private name: string;
    private type: string;
    private createdAt: string;
    private updatedAt: string;

    private owner: User;

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'type'],

            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                type: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            }
        }
    }

    static relationMappings = {
        owner: {
            relation: Model.BelongsToOneRelation,
            // problem of circular dependency or problem with import paths
            modelClass: __dirname + '/User',
            join: {
                from: 'pets.owner_id',
                to: 'users.id'
            }
        }
    }

    static get columnNameMappers() {
        return snakeCaseMappers();
    }

    $beforeInsert() {
        this.id = uuid();

        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }
}

export default Pet;
