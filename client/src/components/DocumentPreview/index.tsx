import { Typography } from "@mui/material";
import React from "react";

interface DocumentPreviewProps {
  fileUrl: string;
}

function DocumentPreview({ fileUrl }: DocumentPreviewProps) {
  const embedStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    border: "1px solid #ccc",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    textAlign: "center",
  };

  return (
    <>
      {fileUrl ? (
        <div>
          {fileUrl ? (
            <div style={{ textAlign: "center" }} className="mt-3">
              <embed
                src={fileUrl}
                type="application/pdf"
                style={embedStyle}
                title="Preview"
                aria-label="File preview"
              />
            </div>
          ) : (
            <Typography variant="h5" gutterBottom>
              Previewing...
            </Typography>
          )}
        </div>
      ) : (
        <Typography variant="h6">No file to preview</Typography>
      )}
    </>
  );
}

export default DocumentPreview;
