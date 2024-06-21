import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../constants";

function UploadAndPreview() {
  const [isPreview, setIsPreview] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, isLoading] = React.useState(false);
  const [fileData, setFileData] = React.useState<{
    file: File;
    filePath: string;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (file) {
      isLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("esign/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        isLoading(false);
        setFileData(response.data);
        setIsPreview(true);
      } catch (error) {
        alert("Failed to upload the file.");
        isLoading(false);
      }
    } else {
      alert("Please select a file before uploading.");
    }
  };

  return (
    <>
      {isPreview ? (
        <>
          <PreviewFile
            file={file}
            setIsPreview={setIsPreview}
            fileData={fileData}
          />
        </>
      ) : (
        <>
          <div style={{ backgroundColor: "#f0f0f0" }}>
            <Link to="/">
              <Button color="primary">
                <ArrowBack /> Back to Home
              </Button>
            </Link>
          </div>
          <UploadFile
            loading={loading}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
            file={file}
          />
        </>
      )}
    </>
  );
}

interface IUploadProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  file: File | null;
  loading: boolean;
}

const UploadContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
  backgroundColor: "#f0f0f0",
  flexDirection: "column",
});

const StyledInput = styled("input")({
  display: "none",
});

function UploadFile({
  handleFileChange,
  handleUpload,
  file,
  loading,
}: IUploadProps) {
  return (
    <UploadContainer>
      <Box
        border="2px dashed #3f51b5"
        borderRadius="5px"
        width="400px"
        padding="20px"
        textAlign="center"
        style={{ cursor: "pointer", backgroundColor: "#ffffff" }}
        onClick={() => {
          const fileInput = document.getElementById("fileInput");
          if (fileInput) {
            fileInput.click();
          }
        }}
      >
        <Typography variant="h6">
          {file ? file.name : "Click here to upload a PDF file"}
        </Typography>
        <StyledInput
          id="fileInput"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </Box>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload & Preview"}
        </Button>
      </Box>
    </UploadContainer>
  );
}

interface IPreviewProps {
  file: File | null;
  setIsPreview: (data: boolean) => void;
  fileData: { filePath: string } | null;
}

function PreviewFile({ file, setIsPreview, fileData }: IPreviewProps) {
  const navigate = useNavigate();
  const [loading, isLoading] = React.useState(false);

  const submitDocument = async () => {
    try {
      const fileName = fileData?.filePath.split("/").pop();
      isLoading(true);
      await axios.post("esign/requestToEsign", {
        fileName,
      });
      isLoading(false);
      navigate("/");
    } catch (error) {
      isLoading(false);
    }
  };

  const embedStyle: React.CSSProperties = {
    width: "90vw",
    height: "80vh",
    border: "1px solid #ccc",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    textAlign: "center",
  };
  return (
    <Box width="100vw" height="100vh" bgcolor="#f0f0f0">
      <div>
        <Button
          color="primary"
          onClick={() => {
            setIsPreview(false);
          }}
        >
          <ArrowBack /> Back to File Uplaod
        </Button>
      </div>
      {file ? (
        <div>
          {fileData?.filePath ? (
            <div style={{ textAlign: "center" }} className="mt-3">
              <embed
                src={`${baseUrl}/${fileData?.filePath}`}
                type="application/pdf"
                style={embedStyle}
                title="Preview"
                aria-label="File preview"
              />
            </div>
          ) : (
            <Typography variant="h5" gutterBottom>
              Previewing: {file.name}
            </Typography>
          )}
        </div>
      ) : (
        <Typography variant="h6">No file to preview</Typography>
      )}
      <div className="d-flex justify-content-between px-5 mt-3">
        <Button
          onClick={() => {
            setIsPreview(false);
          }}
          variant="contained"
          color="error"
        >
          Cancel
        </Button>
        <Button
          onClick={submitDocument}
          disabled={loading}
          variant="contained"
          color="success"
        >
          {loading ? "Submitting..." : "Submit For E-Sign"}
        </Button>
      </div>
    </Box>
  );
}

export default UploadAndPreview;
