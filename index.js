const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-key.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require('express');
const cors = require('cors');
const clipsRouter = require('./routes/clips');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/clips', clipsRouter);


// Define your API routes and interact with Firestore here

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
