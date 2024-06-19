import React, { useState } from "react";
import UploadFile from "./components/uploadFile";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShowPreview from "./components/ShowPreview";

axios.defaults.baseURL =
  "https://3001-shivakumart67-esign-621lp9num0o.ws-us114.gitpod.io";

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
          "https://3001-shivakumart67-esign-621lp9num0o.ws-us114.gitpod.io/esign/upload",
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
              <UploadFile handleUpload={handleUpload} fileData={uploadedFile} />
            }
          />
          <Route
            path="/preview"
            element={<ShowPreview fileData={uploadedFile} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
