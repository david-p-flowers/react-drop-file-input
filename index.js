const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const clipsRouter = require('./routes/clips');
const serviceAccount = require('./firebase-admin-key.json'); // Replace with your key file

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/clips', clipsRouter);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Define your API routes and interact with Firestore here

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
