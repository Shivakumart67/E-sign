import axios from "axios";
import React from "react";

interface IPreview {
  fileData?: {
    file: File;
    filePath: string;
  };
}

const ShowPreview: React.FC<IPreview> = ({ fileData }) => {
  const embedStyle: React.CSSProperties = {
    width: "100vw", // Adjust width as per your requirement
    height: "80vh", // Adjust height as per your requirement
    border: "1px solid #ccc", // Add a border for better visibility
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Add a subtle shadow
    backgroundColor: "white", // Set background color to white
  };

  const sign = async () => {
    await axios.post(
      "https://3001-shivakumart67-esign-621lp9num0o.ws-us114.gitpod.io/esign/zogoSign"
    );
  };

  return (
    <div>
      <h3>Preview</h3>
      <embed
        src={`https://3001-shivakumart67-esign-621lp9num0o.ws-us114.gitpod.io/uploads/file-1718795732703-736413857.pdf`}
        type="application/pdf"
        style={embedStyle}
        title="Preview"
        aria-label="File preview"
      />
      <div>
        <button type="button" onClick={sign} className="btn btn-primary">
          Submit For E-Sign
        </button>
      </div>
    </div>
  );
};

export default ShowPreview;
