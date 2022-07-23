# API (Node JS Express)

This is gonna be a Node JS api to interact with a Web app, therefore making a progressive web app

# Dependencies

- Express (4.18.1)
- Dotenv (16.0.1)
- PG (8.7.3)
- Cors (2.8.5)
- Jsonwebtoken (8.5.1)

# Dev Dependencies

- Nodemon (2.0.19)

## Road map

- [x] Basic Hello world
- [x] Setup database (Postgre SQL)
- [x] Authenticate user login
- [x] Save user login to data base if they signed up

## Endpoints:

### Authentication (JWT Bearer Token)

I have decided to use JWT (JSON web tokens) for my authentication method, the reason is because I've heard they are good and since they are also easy to use.

1. Set up Authentication: Make a **POST** request to:

`http://localhost:3000/login`

and make sure to add a body with json of with Username and Password:

```json
{
  "username": "...",
  "password": "..."
}
```

Then add the token sent back in the header as Bearer token Authorization for all the endpoints.

### Get (HTTP Request Method)

1. Get all users

> To get all the user data you just need to use a Bearer token to get that data.

Then make a **GET** request to the endpoint:

`https://localhost:3000/getAllUsers/`

2. Get specific user data
   > Get specific user requires just a name to be provided to the Request body, the format is as follows:

```json
{
  "username": "..."
}
```

Then make a **GET** request to the endpoint:

`http://localhost:3000/specificUser`

Note: If the user does not exist, then you will get a status code of `404 (Not found)` and returned:

```json
{
  "result": "user not found"
}
```

### Delete (HTTP Request Method)

1. Delete user

> This is an endpoint of deleteing a user from the database, once agin you need to use the token you've gotten from the `~/login` route, and you need to pass a request body of:

```json
{
  "username": "..."
}
```

Then make a **DELETE** request to the endpoint:

`http://localhost:3000/deleteUser/`

### Post (HTTP Request Method)

1. Post a user to the database

> This endpoint takes 5 reqest body arguments, and none can be null, or equal to a number

**Note:** all accounts are given a value of 0 since you can not start with any money.

```json
{
  "username": "...",
  "firstname": "...",
  "lastname": "...",
  "password": "...",
  "email": "..."
}
```

**Note:** If user does exist you will get the error returned of and status of `500 (Internal Server Error)`.

```json
{
  "result": "User Already Exists."
}
```

**Note:** If user does not Exist you will get this response and a status of `201 (Created)`

```json
{
  "result": "Created new instance of {username}"
}
```

Then make a **POST** request to the endpoint:

`http://localhost:3000/postUser/`

### Put (HTTP Request Method)

1: Update user:

> To update a user you need to provide all the base values use the template below:

**Note:** ONLY ASSIGN VALUES TO ONES YOU WANT TO CHANGE. KEEP THE ONES YOU WANT TO STAY THE SAME EMPTY.

```json
{
  "username": "...", // Will be changed
  "firstname": "...",
  "lastname": "", // Will not be changed
  "password": "",
  "email": ""
}
```

then make a **PUT** request to:

`http://localhost:3000/updateUser/{username}`

2: Add Money to Checkings or Savings:

> This is not an endpoint to be used OFTEN, this is in the rare case some money gets accedently mis-placed. You can add, or subtract money to a user by providing a negative value use the format below:

```json
{
  "amount": 0 // Provide a number
}
```

then make a **PUT** request to add to Checkings:

`http://localhost:3000/addMoneyCheckings/{username}`

or to make add money to savings, make a request to:

`http://localhost:3000/addMoneySavings/{username}`

3: Transfer Money to another User

> You can only send money from the checkings acount and to the checkings account, you can also only send to another user who exists in the database, so no free money glitch send this as the request body:

**Note:** This is the request body

```json
{
  "transferTo": "...", // User to send it to
  "amount": 0 // Amount in dollars
}
```

then make a **PUT** request to this endpoint:

`http://localhost:3000/transferMoneyToAnotherUser/{userToSendFrom}`

## Credit

ex. [Dhruv Rayat](https://twitter.com/RayatDhruv)
