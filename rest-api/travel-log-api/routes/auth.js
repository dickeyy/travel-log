const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
const dotenv = require('dotenv');

dotenv.config();

// get utils
const { connectDb } = require('../utils/db');
const { encrypt } = require('../utils/encrypt');
const { decrypt } = require('../utils/decrypt');
const { genEncryptKey } = require('../utils/genEncryptKey');

const db = connectDb();

// Route /auth/signup
exports.signup = async (req, res, next) => {
    // Get the data from the request
    const { email, password } = req.body;

    // Check if the user already exists
    const user = await db.collection('users').findOne({ email: email });
    if (user) {
        return res.status(409).json({
            error: "User already exists"
        });
    }

    // Create a new user
    const encryptKey = genEncryptKey();
    const uid = uidgen.generateSync();
    const newUser = {
        uid: uid, 
        email: email,
        password: encrypt(password, encryptKey),
        encryptKey: encrypt(encryptKey, process.env.MASTER_ENCRYPT_KEY),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        places: []
    };

    // Save the user to the database
    await db.collection('users').insertOne(newUser);

    // Return the user
    return res.status(200).json({
        message: "User created",
        user: newUser
    });
}

// Route /auth/signin
exports.signin = async (req, res, next) => {
    // Get the data from the request
    const { email, password } = req.body;

    // Check if the user exists
    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
        return res.status(401).json({
            error: "User not found"
        });
    }

    // Check if the password is correct
    const encryptKey = decrypt(user.encryptKey, process.env.MASTER_ENCRYPT_KEY);
    if (decrypt(user.password, encryptKey) !== password) {
        return res.status(401).json({
            error: "Wrong password"
        });
    }

    // Return the user
    return res.status(200).json({
        message: "User found",
        user: user
    });
}