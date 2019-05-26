'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true })

app.get('/hello', (req, res) => {
    res.send("hello world");
});

// GET /api/messages?category={category}
// Get all messages, optionally specifying a category to filter on
app.get('/stores', async (req, res) => {
    try {

        let collection = await db.collection('stores')
        if (req.query.category) {
            collection = db.collection('stores').where('category', '==', req.query.category)
        }
        if (req.query.name) {
            collection = db.collection('stores').where('name', '==', req.query.name)
        }

        let stores = [];
        let query = await collection.get()
        query.forEach(doc => {
            stores.push({ id: doc.id, data: doc.data() })
        })

        res.status(200).json(stores);
    } catch (error) {
        //console.log('Error getting messages', error.message);
        res.status(500).json(error.message);
    }
});

app.post('/stores', async (req, res) => {
    try {
        const { name, category, location, finish_date } = req.body;
        const data = { name, category, location, finish_date }
        const query = await db.collection('stores').add(data);
        const store = await query.get();

        res.status(200).json({ id: query.id, data: store.data() });
    } catch (error) {
        console.log('Error posting messages', error.message);
        res.status(500).json(error.message);
    }
})

// Expose the API as a function
exports.api = functions.https.onRequest(app);
