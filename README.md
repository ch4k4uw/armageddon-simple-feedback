# Simple Feedback Registering server prototype
A server for some feedback collecting, about some topics, and gives a simple report about the collected feedback.
This app was created just for study reasons.

# Features
1. App administration
   * User authentication and authorization to perform CRUD operations.
2. Feedback registering
   * Main purpose of the app: Collect some feedback, limited to a rating from 1 to 5 and a reason text, about a registered topic.
3. Feedback report
   * Provides a simple report about the registered feedback.

# Installation
## For development:
```
npm install
```

## For production:
```
npm ci
```

# Running
In order to run this server, you must set the following env vars:
- ARMAGEDDON_SEED_USER_PASS
  - Password for the seeded root user (you can find the `root` user [here][user-seeds-file]).
  - ex: `ARMAGEDDON_SEED_USER_PASS="[encrypted-pass]"`
- ARMAGEDDON_SEED_GUEST_USER_PASS
  - Password for the seeded guest user (you can find the `guest` user [here][user-seeds-file]).
  - ex: `ARMAGEDDON_SEED_GUEST_USER_PASS="[encrypted-pass]"`
- ARMAGEDDON_ACCESS_TOKEN_SECRET
  - Access token secret.
  - ex: `ARMAGEDDON_ACCESS_TOKEN_SECRET="[secret]"`
- ARMAGEDDON_REFRESH_TOKEN_SECRET
  - Refresh token secret.
  - ex: `ARMAGEDDON_REFRESH_TOKEN_SECRET="[secret]"`
- ARMAGEDDON_ACCESS_TOKEN_ALGORITHM
  - Algorithm used to generate the `access-token`.
  - ex: `ARMAGEDDON_ACCESS_TOKEN_ALGORITHM="HS128"`
- ARMAGEDDON_REFRESH_TOKEN_ALGORITHM
  - Algorithm used to generate the `refresh-token`.
  - ex: `ARMAGEDDON_REFRESH_TOKEN_ALGORITHM="HS256"`
- ARMAGEDDON_ACCESS_TOKEN_EXPIRATION
  - Access token expiration time.
  - ex: `ARMAGEDDON_ACCESS_TOKEN_EXPIRATION="5m"`
- ARMAGEDDON_REFRESH_TOKEN_EXPIRATION
  - Refresh token expiration time.
  - ex: `ARMAGEDDON_REFRESH_TOKEN_EXPIRATION="1 day"`
- ARMAGEDDON_RND_BYTES_SZ
  - Random bytes length used to hash a user password.
  - ex: `ARMAGEDDON_RND_BYTES_SZ="16"`
- ARMAGEDDON_DERIVED_KEY_LEN
  - The size of the derived key generated from the user pass + random bytes.
  - ex: `ARMAGEDDON_DERIVED_KEY_LEN="32"`
- ARMAGEDDON_NANOID_LEN
  - The size of the `topic code` (this code is used to register the feedback).
  - ex: `ARMAGEDDON_NANOID_LEN="10"`
- ARMAGEDDON_SERVER_FORCE_HTTPS
  - Used to force HTTPS when the server is running in developer mode.
  - ex: `ARMAGEDDON_SERVER_FORCE_HTTPS="1" // => forces https`
- ARMAGEDDON_SERVER_PORT
  - The port that the server uses to listen to the requests.
  - ex: `ARMAGEDDON_SERVER_PORT="5000"`
- ARMAGEDDON_CERT
  - The path to the `public key` of the server when it is running in `production`.
  - ex: `ARMAGEDDON_CERT="/encrypt/fullchain.pem"`
- ARMAGEDDON_PRIV_KEY
  - The path to the `private key` of the server when it is running in `production`.
  - ex: `ARMAGEDDON_PRIV_KEY="privkey.pem"`
- ARMAGEDDON_DB_PATH
  - Path of the database.
  - ex: `ARMAGEDDON_DB_PATH="/users/admin/app/db.db"`
- ARMAGEDDON_SYMM_ALGORITHM
  - Algorithm used to encrypt data
  - ex: `ARMAGEDDON_SYMM_ALGORITHM="aes192"`
- ARMAGEDDON_TOPIC_ID_PASS
  - Password to validate a topic id metadata
  - ex: `ARMAGEDDON_TOPIC_ID_PASS="I'm a password"`
- ARMAGEDDON_TOPIC_ID_ALGORITHM
  - A JWT algorithm used to generate the `topic id metadata`
  - ex: `ARMAGEDDON_TOPIC_ID_ALGORITHM="HS256"`


## Remarks
See more about token algorithms [here][jwt-npm], and more about password hashing based on `scripty` solution [here][node-crypto].

# Technologies
- [jsonwebtoken][jwt-npm] - Generates and validates tokens.
- [typedi][typedi-npm] - Container based IoC implementation.
- [node crypto][node-crypto] - Node `scrypt` implementation for password hashing.
- [nanoid][nanoid-npm] - Topic code generator.
- [typeorm][typeorm-npm] - ORM to connect the app with a database.
- [sqlite3][sqlite3-npm] - Database engine to store the app data.
- [uuid][uuid-npm] - Generate the database entities ID.
- [dotenv][dotenv-npm] - Load environment variables from `.env` files.
- [joi][joi-npm] - Request middleware validator.
- [express][express-npm] - Server presenter design.
- [jest][jest-npm] - Unit test framework.
- [ts-mockito][ts-mockito-npm] - Unit test mock framework.

# Architecture
This is a monolith-modularized DDD oriented project. At a `package` level, it has the following organization:

- `application`: Use case implementations. This package handles all the interactions between the `presenter` and the `domain` packages.
- `domain`: Domain requirement definitions. This package is described all the histories that this app gives support to.
- `infra`: Domain and platform requirement implementations. This package handles all the interactions between the `application` and the external domain required services.
- `ioc`: Component linking. This package centers all the app dependencies to make everything uncoupled and working properly.
- `server`: The presenter package. This package handles all the client/user interactions with the app.

## Package dependency
The goal of this project architecture implementation is to decouple the platform requirements from the domain requirements to make it easy to change some of those requirements without impacting the domain solution.
To achieve this goal the package dependency was implemented in the following way:

1. server, depends on: `5. ioc` and `3 domain`.
2. application, depends on: `3. domain`
3. domain, depends on nothing.
4. infra, dependes on `3. domain`.
5. ioc, depends on `2. application`, `3. domain`, `4. infra`.


## Component design
In a macro view, this project has three main components:

1. `Presenter`: Comprehends the front-end components of this app. Every interaction is handled by this component and all of its implementations are in the `1. server` package.
2. `Domain`: Comprehends the back-end components. It is the most complex component since it has all the domain implementations and requirements of the app. All of its implementations can be found in the `2. application`, `3. domain` and `4. infra` packages.
3. `Crosscutting`: Comprehends the `IoC` component, which is essential for most DDD oriented solutions.

As this project was designed to be DDD oriented, the `presenter` and the `crosscutting` aren't complex enough to be aborded in this topic. Let's jump to the `domain` component.

### Domain component design
The first component to being designed.
This component was designed to be as testable and decoupled as possible. Its implementation can be found in the `application`, `domain`, and `infra` packages. All those packages work together to solve the problem as cleanly as possible.

When the flow comes from the `presenter` component, the `application` has the lightest initial validations of the flow. It validates data without any interaction with external services (database access for example). This component is important to ensure the next component has some valid data to work on.

After the flow passes through the `application` component, the `domain` component starts working making the required operations to solve the rest of the problem and answers accordingly to the `application` which one reacts and finishes its answer to the `presenter`.

The `domain` component is designed to perform havier operations, like data-accessing but in a totally decoupled way made through some patterns like `Repository` and `Service`.

Since the `domain` is designed to work with `anemic entities`, all the domain intelligence is implemented in the `repositoies` which one uses the `service` pattern to keep the `domain` decoupled of external components.

And that's why the `domain` component has implementations in the `infra` and in the `application` packages too and even though it keeps the recommended decoupling behavior of the DDD.

# Design patterns
The following design patterns can be found in this project:
- Repository
- Service
- Inversion of Control

# Tests
The conception of this project was made from the domain components to the platform and presenter implementations. 
Concepting the project in this way gives the possibility to test every domain component before implementing the required external components (data access and client/user interactions). 

To achieve this conception goal, each unit test was written using the `ts-mockito` lib to mock several expected data flow and make the domain most reliable as possible to be used by any kind of external components.


[user-seeds-file]: src/infra/database/orm/seeds/user-seeder.ts
[jwt-npm]: https://www.npmjs.com/package/jsonwebtoken
[node-crypto]: https://nodejs.org/api/crypto.html
[typeorm-npm]: https://www.npmjs.com/package/typeorm
[nanoid-npm]: https://www.npmjs.com/package/nanoid
[typedi-npm]: https://www.npmjs.com/package/typedi
[sqlite3-npm]: https://www.npmjs.com/package/sqlite3
[uuid-npm]: https://www.npmjs.com/package/uuid
[dotenv-npm]: https://www.npmjs.com/package/dotenv
[joi-npm]: https://www.npmjs.com/package/joi
[express-npm]: https://www.npmjs.com/package/express
[jest-npm]: https://www.npmjs.com/package/jest
[ts-mockito-npm]: https://www.npmjs.com/package/ts-mockito