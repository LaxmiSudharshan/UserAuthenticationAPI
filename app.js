const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

const databasePath = path.join(__dirname, 'userData.db');

const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log('Server running at http://localhost:3000/')
    );
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// API 1 - Register
app.post('/register', async (req, res) => {
  try {
    const { username, name, password, gender, location } = req.body;

    // Check if user already exists
    const userCheckQuery = `SELECT * FROM user WHERE username = ?`;
    const dbUser = await database.get(userCheckQuery, [username]);

    if (dbUser) {
      return res.status(400).send('User already exists');
    }

    // Check password length
    if (password.length < 5) {
      return res.status(400).send('Password is too short');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserQuery = `
      INSERT INTO user (username, name, password, gender, location)
      VALUES (?, ?, ?, ?, ?)
    `;

    await database.run(createUserQuery, [
      username,
      name,
      hashedPassword,
      gender,
      location,
    ]);

    return res.status(200).send('User created successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// API 2 - Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userQuery = `SELECT * FROM user WHERE username = ?`;
    const dbUser = await database.get(userQuery, [username]);

    if (!dbUser) {
      return res.status(400).send('Invalid user');
    }

    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).send('Invalid password');
    } else {
      return res.status(200).send('Login success!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// API 3 - Change Password
app.put('/change-password', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    const userQuery = `SELECT * FROM user WHERE username = ?`;
    const dbUser = await database.get(userQuery, [username]);

    if (!dbUser) {
      return res.status(400).send('Invalid user');
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      dbUser.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).send('Invalid current password');
    }

    if (newPassword.length < 5) {
      return res.status(400).send('Password is too short');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = `
      UPDATE user SET password = ? WHERE username = ?
    `;

    await database.run(updateQuery, [hashedNewPassword, username]);

    return res.status(200).send('Password updated');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// ✅ Exporting app for testing
module.exports = app;
