# Objection.js

Objection.js is an ORM for Node.js that aims to stay out of your way and make it as easy as possible to use the full
power of SQL and the underlying database engine while still making the common stuff easy and enjoyable.

---

## [Models](https://vincit.github.io/objection.js/guide/models.html#models)

A Model subclass represents a database table and instances of that class represent table rows. Models are created by
inheriting from the Model class.

### [Static Properties](https://vincit.github.io/objection.js/api/model/static-properties.html#static-properties)

### [Static Methods](https://vincit.github.io/objection.js/api/model/static-methods.html#static-methods)

### [Instance Methods](https://vincit.github.io/objection.js/api/model/instance-methods.html#instance-methods)
All instance methods start with the character `$` to prevent them from colliding with the database column names.

### [Instance Properties](https://vincit.github.io/objection.js/api/model/instance-properties.html#instance-properties)
All instance properties start with the character `$` to prevent them from colliding with the database column names.

## [Relations](https://vincit.github.io/objection.js/guide/relations.html)

### `static` BelongsToOneRelation
A relation type that can be used in relationMappings to create a belongs-to-one relationship.

### `static` HasOneRelation
A relation type that can be used in relationMappings to create a has-one relationship.

### `static` HasManyRelation
A relation type that can be used in relationMappings to create a has-many relationship.

### `static` ManyToManyRelation
A relation type that can be used in relationMappings to create a many-to-many relationship.

### `static` HasOneThroughRelation
A relation type that can be used in relationMappings to create a has-one-through relationship.

## [Transactions](https://vincit.github.io/objection.js/guide/transactions.html)

In objection, a transaction can be started by calling the Model.transaction function:

```ts
try {
  const returnValue = await Person.transaction(async trx => {
    // Here you can use the transaction.

    // Whatever you return from the transaction callback gets returned
    // from the `transaction` function.
    return 'the return value of the transaction';
  });
  // Here the transaction has been committed.
} catch (err) {
  // Here the transaction has been rolled back.
}
```

Or just simply use `knex.transaction`:

```ts
const returnValue = await knex.transaction(async trx => { ... })
```

## [Hooks](https://vincit.github.io/objection.js/guide/hooks.html#hooks)

- **Instance query hooks**. These hooks are executed in different stages of each query type (find, update, insert, delete)
for **model instances**:
  - `$beforeInsert`
  - `$afterInsert`
  - `$beforeUpdate`
  - `$afterUpdate`
  - `$beforeDelete`
  - `$afterDelete`
  - `$afterFind`
```ts
class Person extends Model {
  $beforeInsert(context) {
    this.createdAt = new Date().toISOString();
  }
}
```

- **Static query hooks**. Static hooks are executed in different stages of each query type (find, update, insert, delete):
  - `beforeInsert`
  - `afterInsert`
  - `beforeUpdate`
  - `afterUpdate`
  - `beforeDelete`
  - `afterDelete`
  - `beforeFind`
  - `afterFind`
```ts
class Person extends Model {
  static async beforeDelete({ asFindQuery }) {
    // This query will automatically be executed in the same transaction
    // as the query we are hooking into.
    await idsOfItemsToBeDeleted = await asFindQuery().select('id');
    await doSomethingWithIds(idsOfItemsToBeDeleted);
  }
}
```

- **Model data lifecycle hooks**.
Whenever data is converted from one layout to another a data lifecycle hook is called:

1. `database` -> $parseDatabaseJson -> `internal`
2. `internal` -> $formatDatabaseJson -> `database`
3. `external` -> $parseJson -> `internal`
4. `internal` -> $formatJson -> `external`

## [Validation](https://vincit.github.io/objection.js/guide/validation.html#validation)

JSON schema validation can be enabled by setting the jsonSchema property of a model class. 
The validation is ran each time a Model instance is created.

## [Plugins](https://vincit.github.io/objection.js/guide/plugins.html)

A curated list of plugins and modules for objection.

### 3rd party plugins

- [objection-authorize](https://github.com/JaneJeon/objection-authorize) - integrate access control into Objection queries
- [objection-dynamic-finder](https://github.com/snlamm/objection-dynamic-finder) - dynamic finders for your models
- [objection-guid](https://github.com/seegno/objection-guid) - automatic guid for your models
- [objection-password](https://github.com/scoutforpets/objection-password) - automatic password hashing for your models
- [objection-soft-delete](https://github.com/griffinpp/objection-soft-delete) - Soft delete functionality with minimal configuration
- [objection-unique](https://github.com/seegno/objection-unique) - Unique validation for your models
- [objection-visibility](https://github.com/oscaroox/objection-visibility) - whitelist/blacklist your model properties
- [objection-filter](https://github.com/tandg-digital/objection-filter) - API filtering on data and related models
- [objection-graphql](https://github.com/vincit/objection-graphql) - Automatically generates rich graphql schema for objection models

---

## What Objection.js gives you:

- An easy declarative way of defining models and relationships between them
- Simple and fun way to fetch, insert, update and delete objects using the full power of SQL
- Powerful mechanisms for eager loading, inserting and upserting object graphs
- Easy to use transactions
- Official TypeScript support
- Optional JSON schema validation
- A way to store complex documents as single rows

## What Objection.js doesn't give you:

- A fully object oriented view of your database With objection you don't work with entities. You work with queries. 
Objection doesn't try to wrap every concept with an object oriented equivalent. The best attempt to do that (IMO) is 
Hibernate, which is excellent, but it has 800k lines of code and a lot more concepts to learn than SQL itself. The point
is, writing a good traditional ORM is borderline impossible. Objection attempts to provide a completely different way of
working with SQL.

- A custom query DSL. SQL is used as a query language. This doesn't mean you have to write SQL strings though. A query
builder based on knex is used to build the SQL. However, if the query builder fails you for some reason, raw SQL strings
can be easily written using the raw helper function.
- Automatic database schema creation and migration from model definitions. For simple things it is useful that the 
database schema is automatically generated from the model definitions, but usually just gets in your way when doing 
anything non-trivial. Objection.js leaves the schema related things to you. knex has a great migration tool that we 
recommend for this job. Check out the example project.