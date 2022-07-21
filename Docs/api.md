# API (Node JS Express)

This is gonna be a Node JS api to interact with a Web app, therefore making a progressive web app

# Dependencies

- Express (4.18.1)
- Dotenv (16.0.1)
- PG (8.7.3)
- Cors (2.8.5)

# Dev Dependencies

- Nodemon (2.0.19)

## Road map

- [x] Basic Hello world
- [x] Setup database (Postgre SQL)
- [x] Authenticate user login
- [x] Save user login to data base if they signed up

## Endpoints:

### Get (HTTP Request Method)

1. Get all users

> Get all Users requires a format of Name and Password stored in the request body as a JSON Format for Auth

```json
{
  "name": "...",
  "password": "..."
}
```

Then make a request to the endpoint:

`https://localhost:3000/getAllUsers/`

2. Get specific user data
   > Get specific user requires a format of Name and Password for Auth, but another argument 'username' to get that user (Note: No two users can have the same name)

```json
{
  "name": "...",
  "password": "...",
  "username": "..."
}
```

Then make a request to the endpoint:

`https://localhost:3000:`

### Delete (HTTP Request Method)

1. Delete user

> This endpont is used to delete a user from the database, unlike all the others it uses the request body for Auth, and to supply the username.

```json
[
  {
    "name": "...",
    "password": "..."
  },
  {
    "username": "..."
  }
]
```

Then make a delete request to the endpoint:

`http://localhost:3000/deleteUser/`

### Post (HTTP Request Method)

1. Post a user to the database

> This endpoint also take 2 json arguments, but you can not post a user if the name already exists. Else you get an error.

```json
[
  {
    "name": "...",
    "password": "..."
  },
  {
    "username": "...",
    "firstname": "...",
    "lastname": "...",
    "password": "..."
  }
]
```

> Note: If user does exist you will get the error returned of:

```json
{
  "result": "User Already Exists."
}
```

> Note: If user does not Exist you will get this response:

```json
{
  "result": "Created new instance of {username}"
}
```

Then make a post request to the endpoint:

`http://localhost:3000/postUser/`

## Credit

ex. [Dhruv Rayat](https://twitter.com/RayatDhruv)
