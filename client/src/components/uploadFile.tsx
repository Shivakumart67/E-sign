import axios from "axios";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IUploadProps {
  handleUpload: (file: File | null) => void;
  fileData?: {
    file: File;
    filePath: string;
  };
}

function UploadFile({ handleUpload, fileData }: IUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setFile(null);
      alert("Please select a PDF file.");
    }
  };

  useEffect(() => {
    if (fileData && fileData.filePath) {
      navigate("/preview");
    }
  }, [fileData]);

  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "gray" }}
      className="d-flex justify-content-center align-items-center"
    >
      <div>
        <div>
          <label>Upload file</label>
          <br />
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="mt-2"
          />
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={async () => {
              handleUpload(file);
            }}
          >
            Upload E-sign File
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
