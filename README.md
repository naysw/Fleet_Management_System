# Car parking and Fleet Management System

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Get Token](#get-token)
- [Create a Booking](#create-a-booking)
- [Register Booking](#register-booking)
- [Generate Invoice for Booking](#generate-invoice-for-ooking)
- [Make Payment](#make-payment)
- [Customer REST Api](#customer-rest-api)
- [Service REST Api](#service-rest-api)
- [User REST Api](#user-rest-api)
- [Vehicle REST Api](#vehicle-rest-api)

## Installation and Setup

```bash
git@github.com:naysw/Fleet_Management_System.git
```

```bash
cd your project folder
```

```bash
yarn install

or

npm install
```

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

open `.env` file and replace with your database crenditials on `DATABASE_URL` and `ACCESS_TOKEN_SECRET`

```bash
DATABASE_URL="mysql://<user>:<password>@localhost:3306/<database>"

ACCESS_TOKEN_SECRET=
```

start application with localhost

```bash
yarn dev

or

npm run dev
```

Migrate database and Seed dummy data

```bash
yarn prisma migrate reset

or

npm run prisma migrate reset

// enter Y/y and press Enter to cofirm reset database
```

if you want to go with `docker` container

```bash
// build docker image
docker build -t Fleet_Management_System .

// start docker container
docker run -d -p 3002:3002 --env-file ./evn Fleet_Management_System
```

## Overview

if your are using VScode, you will find out all of api end point inside `.http` folder, that are make with `Http Client` ext: you can install if you not have it or you can use `Postman` if you want
https://marketplace.visualstudio.com/items?itemName=humao.rest-client

#### Authentication and Authorization

- you will need valid access token to perform on each request
- you will need `ADMIN` roles to `create` `update` and `delete` request
- when you build with `docker` and use same container network , make sure your you setup your datbase correctly
- if you would like to use your application on production, make sure you setup email server correctly, otherwise `nodemailer` will use random generated test email.

### Others Notes

- we are hardcode service for default service on `ServiceRepository`, make you not force to delete it , otherwise the basic service will not include as default :)) on booking creation

````bash
return await this.prismaService.service.findFirst({
  where: {
    // here
    name: "Basic",
  },
});
```

## (1) Get Token

to perform every action, you will need to login and have valid access token, we are using `jwt` token

```bash
  POST /v1/api/auth/login
  content-type: application/json

  // body
  // make sure you get correct username from your seeded database
  // all random seeded user password with be `password`
  {
      "username": "Eladio85" ,
      "password": "password"
  }

````

Response payload

```bash

  // response
  {
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNjFkZGViMC04MWE5LTRhMmMtODQ2MC01YTk5N2QwZjk3ZTQiLCJpYXQiOjE2NjA1NTA2NDMsImV4cCI6MTY2MDU1Nzg0M30.nTKY4r8DauQaB22YpLzcL7stZCoFhmviSLozlMG6ZpU"
  },
  "message": "Ok",
  "statusCode": 200,
  "success": true
}
```

## (2) Create a Booking

To create a booking, make sure your database has atleast one customer record with vehicle attached, if not, you can go and create a vehicle from below endpoint or you can use from your seeded data if you want.

(2.1) Create Vehicle

Note: before creating vehicle, make sure you have customer record, since `customerId` is mandatory. to create a new customer, please go ahead and checkout `.http/customers.http` for more details

Body
| Name | Type | Description | Mandatory
| --------- | ----------- | ------ | ----- |
| plateNumber | String | car plate number | Yes
| customerId | String - UUID/v4 | customer | Yes
| description| String | vehicle descrion | No

Query => when you request post data, you can set which data you wold like to get back from server by passing `include` keys for relationship, by default relationship will not include on any request.

| Name    | Type   | Description                                                                                       | Mandatory |
| ------- | ------ | ------------------------------------------------------------------------------------------------- | --------- |
| include | String | allowed relationship key are `category,customer` make sure you saperate with "," for multiple key | No        |

Example

Request

```bash
POST {{BASE_URL}}/v1/api/vehicles
    ?include=category,customer
content-type: application/json

{
    "plateNumber": "7A-123-456",
    "customerId": "270c3d5e-d034-4529-8f66-f2bec135ad24",
    "description": "New Vehicle Description"
}
```

Response

```bash
{
  "data": {
    "id": "b01e1468-879c-494a-a6a7-a2746f4a5744",
    "plateNumber": "7A-123-456",
    "categoryId": null,
    "customerId": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
    "mediaId": null,
    "description": "New Vehicle Description",
    "createdAt": "2022-08-15T08:21:14.587Z",
    "updatedAt": "2022-08-15T08:21:14.587Z",
    "category": null,
    "customer": {
      "id": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
      "firstName": "Veronica",
      "lastName": "Ebert",
      "phone": "206.966.1237",
      "email": "Dashawn.McClure@yahoo.com",
      "address": "02515 Hermiston Hill",
      "createdAt": "2022-08-15T05:08:28.003Z",
      "updatedAt": "2022-08-15T05:08:28.003Z"
    }
  },
  "message": "new vehicle created successfully",
  "statusCode": 200,
  "success": true
}
```

Note: For REST full `vehicles` api , you can find out more detail on `.http/vehicles.http` file

If you have ready that everything we need before create booking `one customer , one vehicle, one service`, we can now start create booking if you have , if not make sure you create it correctly.

## (2) Register Booking

Body
| Name | Type | Description | Mandatory
| --------- | ----------- | ------ | ----- |
| customerId | String - UUID/v4 | customer id to associate with Booking | Yes
| vehicleId | String - UUID/v4 | vehicle id | Yes
| from| String/timestamps | booking start date (timestamp), should less than `to` | Yes
| to | String/timestamps | booking end date (timestamp), should greater than `from` | Yes
|duration | Number | number of days for booking, default is 1 day and max if 30 days | Yes
| notes | String | extra notes | No
| additionalServiceItems | Array | list of additionalServiceItems item, each item should have `serviceId`, `quantity`, `discount`, if you specified `additionalServiceItems`, server will merge your provided item and `Basic Parking Fees` Service Item that set on server.In every newly created Booking. we will have default parking fees service will created and connect with id | No

Query Keys

| Name    | Type   | Description                                                                                                              | Mandatory |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------ | --------- |
| include | String | allowed relationship key are `additionalServiceItems,customer,vehicle` make sure you saperate with "," for multiple keys | No        |

Example

Request

```bash
POST {{BASE_URL}}/v1/api/bookings
    ?include=additionalServiceItems,customer,vehicle
content-type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
    "customerId": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
    "vehicleId": "fd908d14-7b83-49de-bfec-874348283ef7",
    "from": "2022-07-13T17:58:37.493Z",
    "to": "2022-08-13T17:58:37.493Z",
    "duration": 30,
    "notes": "please care well my car",
    "additionalServiceItems": [
        {
            //  service id
            "serviceId": "ff4636a6-c80e-4094-8d38-c0e3682f71a5",
            "quantity": 5,
            "discount": 0
        }
    ]
}
```

Response Data

```bash
{
  "data": {
    "id": "6b85a076-948e-4172-a0ac-34ec3cff1172",
    "from": "2022-07-13T17:58:37.493Z",
    "to": "2022-08-13T17:58:37.493Z",
    "notes": "Do not forget to bring your keys",
    "status": null,
    "additionalServiceItems": [
      {
        "id": "deb9873e-b904-47eb-ac10-edf117251531",
        "name": "Basic",
        "price": 5000,
        "quantity": 1,
        "discount": 0,
        "bookingId": "6b85a076-948e-4172-a0ac-34ec3cff1172",
        "createdAt": "2022-08-15T08:40:03.094Z",
        "updatedAt": "2022-08-15T08:40:03.094Z"
      }
    ],
    "customer": {
      "id": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
      "firstName": "Veronica",
      "lastName": "Ebert",
      "phone": "206.966.1237",
      "email": "Dashawn.McClure@yahoo.com",
      "address": "02515 Hermiston Hill",
      "createdAt": "2022-08-15T05:08:28.003Z",
      "updatedAt": "2022-08-15T05:08:28.003Z"
    },
    "vehicle": {
      "id": "fd908d14-7b83-49de-bfec-874348283ef7",
      "plateNumber": "4fkkff3",
      "categoryId": null,
      "customerId": "b8d5fcd6-f29d-4909-91a6-75d6bf23bb0c",
      "mediaId": null,
      "description": "Soluta aut debitis tenetur molestias delectus.",
      "createdAt": "2022-08-15T05:08:28.003Z",
      "updatedAt": "2022-08-15T05:08:28.003Z"
    },
    "parkingSlotId": null
  },
  "message": "Booking created",
  "statusCode": 201,
  "success": true
}
```

For REST full `bookings` api , you can find out more detail on `.http/bookings.http` file

## (3) Generate Invoice for Booking

Your customer will need to get an invoice for booking, to generate invoice for specify booking, you you have to request with valid bookingId and customerId, you can create multiple invoice from one invoice

Body
| Name | Type | Description | Mandatory
| --------- | ----------- | ------ | ----- |
| bookingId | String - UUID/v4 | booking Id (uuid) that we newaly created, | Yes
| customerId | String - UUID/v4 | customer id | Yes

Query keys

| Name    | Type   | Description                                                                                      | Mandatory |
| ------- | ------ | ------------------------------------------------------------------------------------------------ | --------- |
| include | String | relationship key are `customer,booking,payment` make sure you saperate with "," for multiple key | No        |

Example

```bash
POST {{BASE_URL}}/v1/api/invoices
    ?include=customer,booking,payment
content-type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
    "bookingId": "ec6208f5-7b0c-48e1-a70b-aebd817a0a7c",
    "customerId": "f927f9df-1a8f-4ab4-8843-a8fa853615f4"
}

```

Response

```bash
{
  "data": {
    "id": "d947aa89-02cb-4291-80ca-73c8e72b2914",
    "invoiceNumber": "09d91933efdda6a002a7",
    "status": "PENDING",
    "amount": 5000,
    "customerId": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
    "customer": {
      "id": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
      "firstName": "Veronica",
      "lastName": "Ebert",
      "phone": "206.966.1237",
      "email": "Dashawn.McClure@yahoo.com",
      "address": "02515 Hermiston Hill",
      "createdAt": "2022-08-15T05:08:28.003Z",
      "updatedAt": "2022-08-15T05:08:28.003Z"
    },
    "bookingId": "ec6208f5-7b0c-48e1-a70b-aebd817a0a7c",
    "booking": {
      "id": "ec6208f5-7b0c-48e1-a70b-aebd817a0a7c",
      "customerId": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
      "from": "2022-07-13T17:58:37.493Z",
      "to": "2022-08-13T17:58:37.493Z",
      "duration": 30,
      "notes": "Do not forget to bring your keys",
      "status": "PENDING",
      "vehicleId": "fd908d14-7b83-49de-bfec-874348283ef7",
      "parkingSlotId": null,
      "createdAt": "2022-08-15T05:37:53.011Z",
      "updatedAt": "2022-08-15T05:37:53.011Z"
    },
    "userId": "161ddeb0-81a9-4a2c-8460-5a997d0f97e4",
    "payment": {
      "id": "48deda26-4816-4ec0-95db-7c65d4712c5b",
      "amount": 0,
      "status": "PENDING",
      "customProperties": null,
      "paidBy": null,
      "description": null,
      "createdAt": "2022-08-15T08:46:27.138Z",
      "updatedAt": "2022-08-15T08:46:27.138Z",
      "invoiceId": "d947aa89-02cb-4291-80ca-73c8e72b2914"
    }
  },
  "message": "Ok",
  "statusCode": 200,
  "success": true
}

```

## (4) Make Payment

To pay for specify invoice or booking, make sure you request invoice with `status` column should be `PENDING` otherwished you will received not found exception

Body Payload
| Name | Type | Description | Mandatory
| --------- | ----------- | ------ | ----- |
| amount | Number | amount customer need to pay, normally, front end will calculate from total amount base on cusotmer services | Yes
| paidBy | String | name of customer who make this payment for specify invoice | Yes

Query keys

| Name    | Type   | Description                                                                                      | Mandatory |
| ------- | ------ | ------------------------------------------------------------------------------------------------ | --------- |
| include | String | relationship key are `customer,booking,payment` make sure you saperate with "," for multiple key | No        |

Example

Request

```bash

// you will need to replace your existing id

PATCH  {{BASE_URL}}/v1/api/invoices/d947aa89-02cb-4291-80ca-73c8e72b2914/pay
    ?include=customer,booking,payment
content-type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
    "amount": 4500,
    "paidBy": "Mr.Ok"
}
```

Response Data

```bash
{
  "data": {
    "id": "d947aa89-02cb-4291-80ca-73c8e72b2914",
    "invoiceNumber": "09d91933efdda6a002a7",
    "status": "PAID",
    "amount": 5000,
    "customerId": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
    "customer": {
      "id": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
      "firstName": "Veronica",
      "lastName": "Ebert",
      "phone": "206.966.1237",
      "email": "Dashawn.McClure@yahoo.com",
      "address": "02515 Hermiston Hill",
      "createdAt": "2022-08-15T05:08:28.003Z",
      "updatedAt": "2022-08-15T05:08:28.003Z"
    },
    "bookingId": "ec6208f5-7b0c-48e1-a70b-aebd817a0a7c",
    "booking": {
      "id": "ec6208f5-7b0c-48e1-a70b-aebd817a0a7c",
      "customerId": "f927f9df-1a8f-4ab4-8843-a8fa853615f4",
      "from": "2022-07-13T17:58:37.493Z",
      "to": "2022-08-13T17:58:37.493Z",
      "duration": 30,
      "notes": "Do not forget to bring your keys",
      "status": "COMPLETED",
      "vehicleId": "fd908d14-7b83-49de-bfec-874348283ef7",
      "parkingSlotId": null,
      "createdAt": "2022-08-15T05:37:53.011Z",
      "updatedAt": "2022-08-15T05:37:53.011Z"
    },
    "userId": "161ddeb0-81a9-4a2c-8460-5a997d0f97e4",
    "payment": {
      "id": "48deda26-4816-4ec0-95db-7c65d4712c5b",
      "amount": 4500,
      "status": "PAID",
      "customProperties": null,
      "paidBy": "Mr.Ok",
      "description": null,
      "createdAt": "2022-08-15T08:46:27.138Z",
      "updatedAt": "2022-08-15T08:46:27.138Z",
      "invoiceId": "d947aa89-02cb-4291-80ca-73c8e72b2914"
    }
  },
  "message": "Invoice paid",
  "statusCode": 200,
  "success": true
}

```

### Customer REST Api

For REST full `customers` api , you can find out more detail on `.http/customers.http` file

### Service REST Api

For REST full `services` api , you can find out more detail on `.http/services.http` file

### User REST Api

For REST full `users` api , you can find out more detail on `.http/users.http` file

### Vehicle REST Api

For REST full `vehicles` api , you can find out more detail on `.http/vehicles.http` file

Note: If you found any bugs, please contact me via email or issuce box. Thanks
