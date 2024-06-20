import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/home";
import UploadAndPreview from "./components/uploadAndPreview";

axios.defaults.baseURL =
  "https://3001-shivakumart67-esign-mk0l9wz0e2c.ws-us114.gitpod.io";

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
