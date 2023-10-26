import './App.css';
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage, db } from './firebase';
import { collection, addDoc } from "firebase/firestore"
import DropFileInput from './components/drop-file-input/DropFileInput';

function App() {
    const [file, setFile] = useState(null);
    const [clipTitle, setClipTitle] = useState("");
    const [description, setDescription] = useState("");
    const [gameTitle, setGameTitle] = useState("");
    const [gameYear, setGameYear] = useState("");
    const [clipLength, setClipLength] = useState("");
    const [weather, setWeather] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const [carType, setCarType] = useState("");
    const [makeAndModel, setMakeAndModel] = useState("");
    const [uploadedClips, setUploadedClips] = useState([]);
    const [assetInUse, setAssetInUse] = useState("")

    const onFileChange = (files) => {
        const currentFile = files[0];
        setFile(currentFile);
        console.log(files);
    }

    const uploadToDatabase = (url) => { 
        const docData = {
            mostRecentUploadURL: url,
            clipTitle: clipTitle,
            description: description,
            gameTitle: gameTitle,
            clipLength: clipLength,
            weather: weather,
            timeOfDay: timeOfDay,
            carType: carType,
            makeAndModel: makeAndModel,
            gameYear: gameYear,
            assetInUse: assetInUse,
        }

        const collectionRef = collection(db, "assets");

        addDoc(collectionRef, docData)
          .then((docRef) => {
            console.log("Document added with ID: ", docRef.id);
            console.log("clipTitle: ", clipTitle);
            console.log("Description: ", description);
            
            // Add the uploaded clip to the state
            setUploadedClips((prevClips) => [docData, ...prevClips.slice(0, 9)]);
            
            // Clear the form fields or reset them as needed
            setClipTitle("");
            setDescription("");
            setGameTitle("");
            setGameYear("");
            setClipLength("");
            setWeather("");
            setTimeOfDay("");
            setCarType("");
            setMakeAndModel("");
            setAssetInUse("");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
    }

    const handleClick = () => {
        if (file === null) return;
        const fileRef = ref(storage, `videos/${file.name}`)
        const uploadTask = uploadBytesResumable(fileRef, file)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        }, (error) => {
            console.log("error:", error);
        }, () => {
            console.log("success!!");
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL =>{
                uploadToDatabase(downloadURL);
                console.log(downloadURL);
            });
        });
    }

    return (
        <div className="box">
            <h2 className="header">
                Drop Game Assets here
            </h2>
            <DropFileInput onFileChange={onFileChange} />
            <br />
            <div>
                <p>Clip Title</p>
                <input
                    type="text"
                    value={clipTitle}
                    placeholder="Enter the clip's title"
                    className="metadata_field"
                    onChange={(e) => setClipTitle(e.target.value)}
                />
    
                <p>Description</p>
                <input
                    type="text"
                    value={description}
                    placeholder="Add a description"
                    className="metadata_field"
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Add fields for origin, year, and other metadata as needed */}
    
                <p>Title of Game Used in Clip</p>
                <input
                    type="text"
                    value={gameTitle}
                    placeholder="Enter game title"
                    className="metadata_field"
                    onChange={(e) => setGameTitle(e.target.value)}
                />
                <p>Year Game Released</p>
                <input
                    type="text"
                    value={gameYear}
                    placeholder="Enter game year"
                    className="metadata_field"
                    onChange={(e) => setGameYear(e.target.value)}
                />
    
                <p>Length of the Clip</p>
                <input
                    type="text"
                    value={clipLength}
                    placeholder="How long is the clip"
                    className="metadata_field"
                    onChange={(e) => setClipLength(e.target.value)}
                />
    
                {/* New Metadata Fields */}
                <p>Weather</p>
                <input
                    type="text"
                    value={weather}
                    placeholder="Enter weather"
                    className="metadata_field"
                    onChange={(e) => setWeather(e.target.value)}
                />
    
                <p>Time of Day</p>
                <input
                    type="text"
                    value={timeOfDay}
                    placeholder="Enter time of day"
                    className="metadata_field"
                    onChange={(e) => setTimeOfDay(e.target.value)}
                />
                <p>One word for Main Asset Used in the Clip</p>
                <input
                    type="text"
                    value={assetInUse}
                    placeholder="Enter the asset in use in game (i.e. car, weapon, spaceship)"
                    className="metadata_field"
                    onChange={(e) => setAssetInUse(e.target.value)}
                />
    
                <p>Car Type</p>
                <input
                    type="text"
                    value={carType}
                    placeholder="Enter car type"
                    className="metadata_field"
                    onChange={(e) => setCarType(e.target.value)}
                />
    
                <p>Make and Model</p>
                <input
                    type="text"
                    value={makeAndModel}
                    placeholder="Enter make and model"
                    className="metadata_field"
                    onChange={(e) => setMakeAndModel(e.target.value)}
                />
            </div>
            <br />
            <br />
            <button onClick={handleClick}>Upload and Save</button>
            
            {/* Display the history log */}
            <div className="history-log">
              <h3>Upload History</h3>
              <ul>
                {uploadedClips.map((clip, index) => (
                  <li key={index}>{clip.clipTitle}</li>
                ))}
              </ul>
            </div>
        </div>
    );
}

export default App;
