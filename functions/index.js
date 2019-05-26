'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();

app.use(cors);
app.use(cookieParser);
/*
const authenticate = async (req, res, next) => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('asdasd');
        return;
    }
    //const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
        const user = await admin.auth().createCustomToken("38burakk")
        console.log(user)
        //const decodedIdToken = await admin.auth().verifyIdToken(user);
        //req.user = decodedIdToken;
        next();
        return;
    } catch (e) {
        res.status(403).send(e);
        return;
    }
};

app.use(authenticate);
*/

app.get('/hello', (req, res) => {
    res.send("hello world");
});

// GET /api/messages?category={category}
// Get all messages, optionally specifying a category to filter on
app.get('/messages', async (req, res) => {
    try {
        let messages = [{ deneme: "deneme" }];

        res.status(200).json(messages);
    } catch (error) {
        console.log('Error getting messages', error.message);
        res.sendStatus(500);
    }
});

// Expose the API as a function
exports.api = functions.https.onRequest(app);
