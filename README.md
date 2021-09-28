# Shopify-backend-challenge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents
 - [Description](#description)
 - [Installation](#installation)
 - [Technology](#technology-used)
 - [Dependencies](#dependencies-used)
 - [Tests](#tests)
 - [License](#license)
 - [Questions](#questions)

## Description
This is an image upload platform where users can upload images and upvote the images by using the token that they earn by uploading images. Everytime you upload an image on the platform; you earn a virtual token. Virtual token starts from 0.

As a User you can:
User:
- Create a Username and Password
- Login User
- Logout User
- Delete your account

Images:
- Upload Images and also in batches
- Get Images
- Delete Images
- Delete all images

Upvote:
- Upvote an Image
- Remove Upvote from an image


## Installation
- Step 1: Install npm packages: `npm i` or `npm install`
- Step 2: Running the server locally: `npm start`
 
## Technology-Used
- `Javascript` - Language
- `MongoDB Atlas` - A cross-platform document database
- `Node.js` - A Javascript runtime enviroment

## Dependencies-Used
- Express.js 
- Nodemon
- Mongoose
- Bcrypt
- Jsonwebtoken
- Multer
- Sharp
- Jest
- Supertest


## Tests
In the root directory of the app, start the server by entering `npm start` and `npm test` in the command line.
Enter the URL `http://localhost:3000/`  in Postman, Insomnia Core or a similar API client.
In your API client, you can make GET, POST, PUT, and DELETE requests for users, images, and upvote. Refer to the Tests. I have also included a Postman file in this repository.

## License
 MIT
 (https://choosealicense.com/licenses/mit/)

## Questions
 If you have any questions about the repo, please open an issue in my GitHub at danyalkhanzada.
