import { Model, snakeCaseMappers } from 'objection';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import Pet from './Pet';

class User extends Model {
    // Table name is the only required property.
    static get tableName() {
        return 'users';
    }

    // Each model must have a column (or a set of columns) that uniquely
    // identifies the rows. The column(s) can be specified using the `idColumn`
    // property. `idColumn` returns `id` by default and doesn't need to be
    // specified unless the model's primary key is something else.
    static get idColumn() {
        return 'id';
    }

    private id: string;
    private name: string;
    private email: string;
    private password: string;
    private rememberMeToken: string;

    private createdAt: string;
    private updatedAt: string;

    private pets: Pet[];

    // Optional JSON schema. This is not the database schema!
    // No tables or columns are generated based on this. This is only
    // used for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // See http://json-schema.org/ for more info.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'email', 'password'],

            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                rememberMeToken: { type: ['string', 'null'] },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            }
        }
    }

    // Reusable query building functions that can be used in
    // any query using modify method and in many other places.
    static get modifiers() {
        return {
            orderByEmail(builder) {
                builder.orderBy('email')
            }
        }
    }

    // The mappers to use to convert column names to property names in code.
    static get columnNameMappers() {
        return snakeCaseMappers();
    }

    // If this is true only properties in jsonSchema are picked
    // when inserting or updating a row in the database.
    // Defaults to 'false'
    static get pickJsonSchemaProperties() {
        return true;
    }

    // A relation type that can be used in relationMappings
    // to create a belongs-to-one relationship.
    static relationMappings = {
        pets: {
            relation: Model.HasManyRelation,
            modelClass: __dirname + '/Pet',
            join: {
                from: 'users.id',
                to: 'pets.owner_id'
            }
        }
    }

    async $beforeInsert() {
        this.id = uuid();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    async $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }

    // Remove password field before fetching record
    $formatJson(json) {
        json = super.$formatJson(json);
        delete json.password;
        return json;
    }
}

export default User;
