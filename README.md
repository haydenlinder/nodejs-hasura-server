# JobTron Auth Server

Built as an authentication server for a the [jobtron-graphql-engine](https://github.com/haydenlinder/jobtron-graphql-engine).

## Running Locally

### 0. Prerequisites:
  - [jobtron-graphql-engine](https://github.com/haydenlinder/jobtron-graphql-engine) running on `localhost:8080`.
  - docker
  - docker-compose

### 2. Start the server:
```bash
docker-compose up
```

### 3. Environment variables:
  - PORT: 8081
  - SERVER_SECRET: 1234 (`HASURA_GRAPHQL_ADMIN_SECRET` from [jobtron-graphql-engine](https://github.com/haydenlinder/jobtron-graphql-engine/blob/master/docker-compose.yml) )
  - HASURA_GQL_URL: http://jobtron-db:8080/v1/graphql (jobtron-db is the name of the container running the graphql engine), or wherever the db is deployed.
  - HASURA_GQL_SECRET: 1234
  - EMAIL_HOST: smtp.zoho.com
  - EMAIL_USER: admin@jobtron.com
  - EMAIL_PASSWORD: 1234