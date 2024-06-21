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
  Box,
} from "@mui/material";
import axios from "axios";
import { DocumentType } from "../../utils/types";
import { Link } from "react-router-dom";
import DrawIcon from "@mui/icons-material/Draw";
import { ArrowBack, Refresh, RemoveRedEye } from "@mui/icons-material";
import DocumentPreview from "../DocumentPreview";
import { baseUrl } from "../../../../constants";

function HomePage() {
  const [documents, setDocuments] = React.useState<DocumentType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState("");

  React.useEffect(() => {
    if (fileUrl && fileUrl !== "") {
      setShowPreview(true);
    }
  }, [fileUrl]);

  const downloadDocument = async (
    request_id: string,
    request: DocumentType,
    index: number
  ) => {
    if (request.request_status === "completed") {
      const updatedDocuments = documents.map((doc, i) =>
        i === index ? { ...doc, loadingDownloadDocument: true } : doc
      );
      setDocuments(updatedDocuments);
      const data = await axios.get(
        `esign/getCompletedDocument/${request_id}/${request.document_ids?.[0].document_name}.pdf/${request.document_ids?.[0].document_id}`
      );
      setFileUrl(`${baseUrl}${data.data}`);
      const updatedDocumentsAfter = documents.map((doc, i) =>
        i === index ? { ...doc, loadingDownloadDocument: false } : doc
      );
      setDocuments(updatedDocumentsAfter);
    } else {
      alert("Document E-Sign is not completed");
    }
  };

  const downloadCertificate = async (
    request_id: string,
    request: DocumentType,
    index: number
  ) => {
    if (request.request_status === "completed") {
      const updatedDocuments = documents.map((doc, i) =>
        i === index ? { ...doc, loadingDownloadCertificate: true } : doc
      );
      setDocuments(updatedDocuments);
      const data = await axios.get(
        `esign/getCompletedCertificate/${request_id}/${request.document_ids?.[0].document_name}.pdf`
      );
      setFileUrl(`${baseUrl}${data.data}`);
      const updatedDocumentsAfter = documents.map((doc, i) =>
        i === index ? { ...doc, loadingDownloadCertificate: false } : doc
      );
      setDocuments(updatedDocumentsAfter);
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
    <>
      {fileUrl && showPreview ? (
        <Box width="100vw" height="100vh" bgcolor="#f0f0f0">
          <div>
            <Button
              color="primary"
              onClick={() => {
                setFileUrl("");
                setShowPreview(false);
              }}
            >
              <ArrowBack /> Back to Home
            </Button>
          </div>
          <DocumentPreview fileUrl={fileUrl} />
        </Box>
      ) : (
        <div>
          <div
            className="d-flex align-items-center"
            style={{ flexDirection: "column" }}
          >
            <div className="h1">Welcome To E-Sign</div>
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
                    <TableRow key={index}>
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
                          style={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        >
                          {row?.request_status || ""}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          disabled={
                            row.request_status !== "draft" || row?.loading
                          }
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
                        {row.request_status === "completed" ? (
                          <>
                            <div
                              style={{
                                display: "flex",
                                gap: "4px",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  downloadCertificate(
                                    row.request_id,
                                    row,
                                    index
                                  );
                                }}
                                color="success"
                                size="small"
                                disabled={row.loadingDownloadCertificate}
                              >
                                {row.loadingDownloadCertificate ? (
                                  "Loading..."
                                ) : (
                                  <>
                                    <RemoveRedEye fontSize="small" />{" "}
                                    Certificate
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  downloadDocument(row.request_id, row, index);
                                }}
                                color="primary"
                                size="small"
                                disabled={row.loadingDownloadDocument}
                              >
                                {row.loadingDownloadDocument ? (
                                  "Loading..."
                                ) : (
                                  <>
                                    <RemoveRedEye fontSize="small" />
                                    Document
                                  </>
                                )}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => {
                                setFileUrl(
                                  `${baseUrl}/uploads/${row.document_ids?.[0]?.document_name}.pdf`
                                );
                              }}
                            >
                              <RemoveRedEye fontSize="small" /> View
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
