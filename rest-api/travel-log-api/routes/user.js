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

// route /user/:uid/add-place
exports.addPlace = async (req, res, next) => {
    // Get the data from the request
    const { uid } = req.params;
    const { place } = req.body;

    // Check if the user exists
    const user = await db.collection('users').findOne({ uid: uid });
    if (!user) {
        return res.status(401).json({
            error: "User not found"
        });
    }

    // Add the place to the user
    await db.collection('users').updateOne({
        uid: uid
    }, {
        $push: {
            'places': place
        }
    });

    // Return the user
    return res.status(200).json({
        message: "Place added",
        user: user
    });

}

// route /user/:uid
exports.getUser = async (req, res, next) => {
    // Get the data from the request
    const { uid } = req.params;

    // Check if the user exists
    const user = await db.collection('users').findOne({ uid: uid });

    if (!user) {
        return res.status(401).json({
            error: "User not found"
        });
    }

    // Return the user
    return res.status(200).json({
        message: "User found",
        user: user
    });
}

// route /user/:uid/delete-place
exports.deletePlace = async (req, res, next) => {
    // Get the data from the request
    const { uid } = req.params;
    const { place } = req.body;

    // Check if the user exists
    const user = await db.collection('users').findOne({ uid: uid });
    if (!user) {
        return res.status(401).json({
            error: "User not found"
        });
    }

    // Delete the place from the user
    await db.collection('users').updateOne({
        uid: uid
    }, {
        $pull: {
            'places': place
        }
    });

    // Return the user
    return res.status(200).json({
        message: "Place deleted",
        user: user
    });
}