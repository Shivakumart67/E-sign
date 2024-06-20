import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import { DocumentType } from "../../utils/types";
import { Link } from "react-router-dom";
import DrawIcon from "@mui/icons-material/Draw";
import {
  Download,
  Refresh,
  RemoveRedEye,
  SignLanguage,
} from "@mui/icons-material";

function HomePage() {
  const [documents, setDocuments] = React.useState<DocumentType[]>([]);
  const [loading, setLoading] = React.useState(false);

  const downloadDocument = async (
    request_id: string,
    request: DocumentType,
    index: number
  ) => {
    if (request.request_status === "completed") {
      const updatedDocuments = documents.map((doc, i) =>
        i === index ? { ...doc, loadingDownload: true } : doc
      );
      setDocuments(updatedDocuments);
      const data = await axios.get(
        `esign/getCompletedDocument/${request_id}/${request.document_ids?.[0].document_name}.pdf/${request.document_ids?.[0].document_id}`
      );
      const updatedDocumentsAfter = documents.map((doc, i) =>
        i === index ? { ...doc, loadingDownload: false } : doc
      );
      setDocuments(updatedDocumentsAfter);
      getDocuments();
    } else {
      alert("Document E-Sign is not completed");
    }
  };

  const initiateESign = async (
    request_id: string,
    request: DocumentType,
    index: number
  ) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, loading: true } : doc
    );
    setDocuments(updatedDocuments);
    await axios.post("esign/initiateEsign", {
      requestId: request_id,
      requestData: request,
    });
    const updatedDocumentsAfter = documents.map((doc, i) =>
      i === index ? { ...doc, loading: false } : doc
    );
    setDocuments(updatedDocumentsAfter);
    getDocuments();
  };

  const getDocuments = async () => {
    setLoading(true);
    const data = await axios.get("/esign/getDocuments");
    setDocuments(data.data);
    setLoading(false);
  };

  React.useEffect(() => {
    getDocuments();
  }, []);
  return (
    <div>
      <div
        className="d-flex align-items-center"
        style={{ flexDirection: "column" }}
      >
        <div className="h1">
          Welcome To E-Sign
          <a
            href="https://3001-shivakumart67-esign-mk0l9wz0e2c.ws-us114.gitpod.io/downloads/completedDocuments/consultations-1692786155961-1705554521432_20240620100447.712Z.pdf"
            download={"shiva.pdf"}
          >
            downlos
          </a>
        </div>
        <div className="h6">You can sign your documents here</div>
      </div>
      <div className="d-flex justify-content-between px-5">
        <div className="h4 mb-2 ml-3">All Documents of E-Sign</div>
        <div className="d-flex" style={{ gap: "4px" }}>
          <Button size="small" color="success" onClick={getDocuments}>
            {loading ? (
              <>updating...</>
            ) : (
              <>
                Refresh <Refresh fontSize={"small"} />
              </>
            )}
          </Button>
          <Link to={"/uploadDocument"}>
            <Button variant="contained" color="primary" size="small">
              New E-Sign
            </Button>
          </Link>
        </div>
      </div>
      <div className="d-flex justify-content-center px-5 mt-2">
        <TableContainer component={Paper} style={{ maxHeight: "80vh" }}>
          <Table
            stickyHeader
            sx={{
              minWidth: 650,
              borderCollapse: "collapse",
              "& th, & td": {
                border: "1px solid rgba(224, 224, 224, 1)",
              },
            }}
            aria-label="documents table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                >
                  Sl No
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                >
                  File Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                >
                  Action
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(documents || []).map((row, index) => (
                <TableRow key={index} hover style={{ cursor: "pointer" }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {row.document_ids?.[0]?.document_name || ""}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      className={
                        row?.request_status === "draft"
                          ? "text-info"
                          : row?.request_status === "inprogress"
                          ? "text-warning"
                          : row?.request_status === "completed"
                          ? "text-success"
                          : "text-secondary"
                      }
                      style={{ textTransform: "uppercase", fontWeight: "bold" }}
                    >
                      {row?.request_status || ""}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      disabled={row.request_status !== "draft" || row?.loading}
                      onClick={() => {
                        initiateESign(row.request_id, row, index);
                      }}
                      variant="outlined"
                      color={"primary"}
                      size="small"
                    >
                      <DrawIcon fontSize="small" />{" "}
                      {row?.loading
                        ? "Requested To E-Sign..."
                        : "Initiate E-Sign"}
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        downloadDocument(row.request_id, row, index);
                      }}
                      color="secondary"
                      size="small"
                      disabled={row.loadingDownload}
                    >
                      <RemoveRedEye fontSize="small" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default HomePage;
