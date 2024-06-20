import React, { useState } from "react";
import UploadFile from "./components/uploadFile";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShowPreview from "./components/ShowPreview";
import HomePage from "./components/home";
import UploadAndPreview from "./components/uploadAndPreview";

axios.defaults.baseURL =
  "https://3001-shivakumart67-esign-mk0l9wz0e2c.ws-us114.gitpod.io";

function App() {
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    filePath: string;
  }>();

  const handleUpload = async (file: File | null) => {
    if (file) {
      console.log("Selected file details:", file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "https://3001-shivakumart67-esign-mk0l9wz0e2c.ws-us114.gitpod.io/esign/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Upload response:", response.data);
        setUploadedFile(response.data);
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload the file.");
      }
    } else {
      alert("Please select a file before uploading.");
    }
  };
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage />
              // <UploadFile handleUpload={handleUpload} fileData={uploadedFile} />
            }
          />
          <Route path="/uploadDocument" element={<UploadAndPreview />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
