import './App.css';
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage, db } from './firebase';
import { collection, addDoc } from "firebase/firestore"
import DropFileInput from './components/drop-file-input/DropFileInput';

function App() {
    const [file, setFile] = useState(null);
    const [assetname, setAssetname] = useState("");
    const [gametitle, setGametitle] = useState("");
    const [description, setDescription] = useState("");

    const onFileChange = (files) => {
        const currentFile = files[0];
        setFile(currentFile);
        console.log(files);
    }

    const uploadToDatabase = (url) => { 
        const docData = {
            mostRecentUploadURL: url,
            asset: assetname, 
            game: gametitle,
            description: description,
            carmodel: "test",
            metadata: "test",
        }

        const collectionRef = collection(db, "assets");

        addDoc(collectionRef, docData)
          .then((docRef) => {
            console.log("Document added with ID: ", docRef.id);
            console.log("Assetname: ", assetname);
            console.log("Gametitle: ", gametitle);
            console.log("Description: ", description);
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
                <p>Asset Name</p>
                <input
                    type="text"
                    value={assetname}
                    placeholder="Enter assetname"
                    className="metadata_field"
                    onChange={(e) => setAssetname(e.target.value)}
                />

                <p>Game Title</p>
                <input
                    type="text"
                    value={gametitle}
                    placeholder="Enter the game's title"
                    className="metadata_field"
                    onChange={(e) => setGametitle(e.target.value)}
                />

                <p>Description</p>
                <input
                    type="text"
                    value={description}
                    placeholder="Add a description"
                    className="metadata_field"
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <br />
            <br />
            <button onClick={handleClick}>Upload and Save</button>
        </div>
    );
}

export default App;
