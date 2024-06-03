# E-Commerce Website

## Overview

This project is a comprehensive e-commerce platform featuring a frontend developed using React, a backend built with Express and Node.js, and an admin panel created with Vite. The platform offers a range of functionalities including user signup/login, product uploading, adding products to cart, a total payment checkout page, and the ability to increase cart item quantities.

## Features

- **User Authentication**: Signup and login functionality.
- **Product Management**: Admin can upload new products.
- **Cart Management**: Users can add products to their cart, increase item quantities, and proceed to checkout.
- **Checkout**: Total payment and order processing.

## Screenshots

1. **Home Page**
   ![Home Page](/image/Screenshot%202024-06-04%20001937.png)

2. **Product Page**
   ![Product Page](/image/Screenshot%202024-06-04%20002323.png)

3. **Cart Page**
   ![Cart Page](/image/Screenshot%202024-06-04%20002007.png)

4. **Admin Panel**
   ![Admin Panel](/image/Screenshot%202024-06-04%20001909.png)

## Technology Stack

- **Frontend**: React
- **Backend**: Express, Node.js
- **Admin Panel**: Vite
- **Database**: MongoDB (via Mongoose)
- **Image Storage**: Imgur API

## Installation and Setup

### Prerequisites

- Node.js
- MongoDB
- Imgur account for image uploads

### Clone the Repository

```bash
git clone https://github.com/udaygarg8188/E-Com
```
cd e-commerce-website
Backend Setup
Navigate to Backend Directory:

bash
Copy code
cd backend
Install Dependencies:

bash
Copy code
npm install
Create .env File:

plaintext
Copy code
mongo_url=mongodb+srv://your_mongo_url
secret=your_jwt_secret
IMGUR_CLIENT_ID=your_imgur_client_id
Start the Backend Server:

bash
Copy code
npm start
Frontend Setup
Navigate to Frontend Directory:

bash
Copy code
cd ../frontend
Install Dependencies:

bash
Copy code
npm install
Create .env File:

plaintext
Copy code
REACT_APP_BACKURL=http://localhost:4000
Start the Frontend Server:

bash
Copy code
npm start
Admin Panel Setup
Navigate to Admin Panel Directory:

bash
Copy code
cd ../admin-panel
Install Dependencies:

bash
Copy code
npm install
Create .env File:

plaintext
Copy code
REACT_APP_BACKURL=http://localhost:4000
Start the Admin Panel:

bash
Copy code
npm run dev
Usage
Access the frontend at http://localhost:3000.
Access the admin panel at http://localhost:3001.
Project Structure
Frontend: React application located in the frontend directory.
Backend: Express and Node.js application located in the backend directory.
Admin Panel: Vite-powered admin panel located in the admin-panel directory.
API Endpoints
User Authentication
Signup: POST /signup
Login: POST /login
Product Management
Upload Product Image: POST /upload
Add Product: POST /addproduct
Remove Product: POST /removeproduct
Get All Products: GET /allproducts
Cart Management
Add to Cart: POST /addtocart
Remove from Cart: POST /removefromcart
Get Cart Data: POST /getcart
Environment Variables
Ensure the following environment variables are set in your .env files:

Backend .env
plaintext
Copy code
mongo_url=mongodb+srv://your_mongo_url
secret=your_jwt_secret
IMGUR_CLIENT_ID=your_imgur_client_id
Frontend .env
plaintext
Copy code
REACT_APP_BACKURL=http://localhost:4000
Admin Panel .env
plaintext
Copy code
REACT_APP_BACKURL=http://localhost:4000
Contributing
Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes.
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Open a Pull Request.