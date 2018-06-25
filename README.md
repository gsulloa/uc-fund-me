# UC Fund Me

## Development
To start developing, first clone the project

```bash
git clone https://github.com/gsulloa/uc-fund-me.git
# or with ssh key
# git clone git@github.com:gsulloa/uc-fund-me.git
```

After that, install all the dependencies.

```bash
yarn install
# or with npm
npm install
```

Now, before running the project, make sure you have all the required environmental vars. ([direnv](https://github.com/direnv/direnv) usage recommended)

```bash
# .direnv file example with required vars
## database config
export DB_USERNAME=username
export DB_PASSWORD=password

## Filestorage config
export CONTAINER_NAME=container
export PROJECT_ID=id
export GOOGLE_CLIENT_EMAIL=email@email.com
export GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
private key
-----END PRIVATE KEY-----"

## Searchengine config
export ALGOLIA_APPLICATION_ID=id
export ALGOLIA_API_KEY=api_key
export ALGOLIA_INDEX_NAME=index-name

```

Make sure, you have a properly setup of the database.

```bash
yarn db:setup
# replace 'yarn' with 'npm run' if you use npm
```

Finally, run the project with [nodemon](https://github.com/remy/nodemon)

```bash
yarn dev
```

## Production
We use ```docker-compose``` to deploy our application.

To start, you need to have a ```.env``` file like
```bash
## database config
DATABASE_URL=postgres://postgres@postgres:5432/uc-fund-me

## Filestorage config
CONTAINER_NAME=container
PROJECT_ID=id
GOOGLE_CLIENT_EMAIL=email@email.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
private key
-----END PRIVATE KEY-----"

## Searchengine config
ALGOLIA_APPLICATION_ID=id
ALGOLIA_API_KEY=api_key
ALGOLIA_INDEX_NAME=index-name

```

Then, build the image and start the postgres container
```bash
docker-compose build
docker-compose up -d postgres
```

Now, setup the database
```bash
docker-compose run app yarn db:setup
```

And finally start the app
```bash
docker-compose up -d
```

Congrats! Now your app is running in port 80.