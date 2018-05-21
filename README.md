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
export DB_USERNAME=username
export DB_PASSWORD=password
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