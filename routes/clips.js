const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const db = admin.firestore();
const { getDownloadURL } = require('firebase/storage');

// Define a route to upload clips
router.post('/upload', async (req, res) => {
  try {
    const clipData = req.body; // Assuming the client sends clip data in the request body
    const clipRef = await db.collection('clips').add(clipData);
    res.status(201).json({ message: 'Clip uploaded successfully', id: clipRef.id });
  } catch (error) {
    console.error('Error uploading clip:', error);
    res.status(500).json({ error: 'Unable to upload clip' });
  }
});

// Define a route to pull clips and metadata
router.get('/get-clips', async (req, res) => {
  try {
    const clipsWithMetadata = [];
    const clipsCollection = db.collection('clips');
    
    const querySnapshot = await clipsCollection.get();

    querySnapshot.forEach(async (doc) => {
      const clipData = doc.data();

      // Fix the template string by using backticks (``) instead of single quotes ('')
      const storageRef = admin.storage().ref(`videos/${clipData.videoFileName}`);
      const downloadURL = await getDownloadURL(storageRef);

      clipData.videoDownloadURL = downloadURL;

      clipsWithMetadata.push(clipData);
    });

    // Send the array of clips with metadata as the response
    res.status(200).json(clipsWithMetadata);
  } catch (error) {
    console.error('Error retrieving clips:', error);
    res.status(500).json({ error: 'Unable to retrieve clips' });
  }
});

module.exports = router;
