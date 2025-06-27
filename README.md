# UserAuthenticationAPI

🔐 User Authentication API
This is a backend project built using Node.js, Express.js, SQLite, and bcrypt. It handles user registration, login, and password change with secure password hashing.

📁 Technologies Used
Node.js
Express.js
SQLite3
Bcrypt (for password encryption)

🚀 API Endpoints
1. Register User
POST /register

Request Body

json
{
  "username": "adam_richard",
  "name": "Adam Richard",
  "password": "richard_567",
  "gender": "male",
  "location": "Detroit"
}
Responses

400: User already exists

400: Password is too short

200: User created successfully

2. Login
POST /login

Request Body

json
{
  "username": "adam_richard",
  "password": "richard_567"
}
Responses

400: Invalid user

400: Invalid password

200: Login success!

3. Change Password
PUT /change-password

Request Body

json
Copy
Edit
{
  "username": "adam_richard",
  "oldPassword": "richard_567",
  "newPassword": "richard@123"
}
Responses

400: Invalid current password

400: Password is too short

200: Password updated

🧪 How to Run
npm install
node app.js
Tested endpoints using Thunder Client at:
http://localhost:3000/
