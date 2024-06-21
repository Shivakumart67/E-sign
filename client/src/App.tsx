import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/home";
import UploadAndPreview from "./components/uploadAndPreview";
import { baseUrl } from "./utils/constants";

axios.defaults.baseURL = baseUrl;

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/uploadDocument" element={<UploadAndPreview />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
