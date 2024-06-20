import * as fs from "fs";
import axios from "axios";
const FormData = require("form-data");
import { Injectable } from "@nestjs/common";
const path = require("path");

@Injectable()
export class EsignService {
  private readonly accessToken =
    "1000.06888ed286be74fa4cd323253a3813f1.aa03cc42ddde566787d0b8f67441af3f";

  async storeCompletionCertificate(requestId: string, fileName: string) {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
      };
      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/completioncertificate`;
      const response = await axios.get(requestUrl, {
        headers: headers,
        responseType: "stream",
      });

      if (!response || response.status !== 200) {
        throw new Error("Failed to download the completed document");
      }
      const outputDir =
        "/workspace/E-sign/backend/downloads/completionCertificate";
      const filePath = path.join(outputDir, `${fileName}`);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          resolve(`/downloads/completionCertificate/${fileName}`);
        });
        writer.on("error", (error) => {
          console.error("Error writing the file:", error);
          reject("Failed to save the downloaded document");
        });
      });
    } catch (error) {
      console.error("Error downloading the completed document:", error);
      throw error;
    }
  }
  async storeCompletedDocument(
    requestId: string,
    documentId: string,
    fileName: string
  ) {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
      };
      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/documents/${documentId}/pdf`;
      const response = await axios.get(requestUrl, {
        headers: headers,
        responseType: "stream",
      });

      if (!response || response.status !== 200) {
        throw new Error("Failed to download the completed document");
      }
      const outputDir =
        "/workspace/E-sign/backend/downloads/completedDocuments";
      const filePath = path.join(outputDir, `${fileName}`);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          resolve(`/downloads/completedDocuments/${fileName}`);
        });
        writer.on("error", (error) => {
          console.error("Error writing the file:", error);
          reject("Failed to save the downloaded document");
        });
      });
    } catch (error) {
      console.error("Error downloading the completed document:", error);
      throw error;
    }
  }

  async initiateEsignFromZoho(requestId: string, requestData: DocumentType) {
    try {
      const actionsJson = {
        recipient_name:
          requestData?.actions?.[0]?.recipient_name || "Shivakumara T",
        action_id: requestData?.actions?.[0]?.action_id || "",
        recipient_email:
          requestData?.actions?.[0]?.recipient_email ||
          "shivakumart67@gmail.com",
        action_type: "SIGN",
        private_notes: "Please get back to us for further queries",
        signing_order: 0,
        verify_recipient: false,
        fields: [
          {
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "SignatureField",
            field_type_name: "Signature",
            field_label: "Signature",
            field_category: "Signature",
            abs_width: "200",
            abs_height: "50",
            is_mandatory: false,
            x_coord: "450",
            y_coord: "950",
            page_no: 0,
            is_read_only: false
          },
        ],
      };

      const documentJson = {
        request_name:
          requestData?.document_ids?.[0]?.document_name || "document name",
        expiration_days: 1,
        is_sequential: true,
        email_reminders: true,
        reminder_period: 8,
        actions: [actionsJson],
      };

      const data = {
        requests: documentJson,
      };

      const payload = new FormData();
      payload.append("data", JSON.stringify(data));

      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
        ...payload.getHeaders(),
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/submit`;

      const response = await axios.post(requestUrl, payload, {
        headers: headers,
      });

      if (!response.data || !response.data.requests) {
        throw new Error("Failed to initiate signing process");
      }

      return response.data;
    } catch (error) {
      console.error("Error initiating signing process:", error);
      throw error;
    }
  }

  async requestDocumentToZoho(fileName: string): Promise<DocumentType> {
    try {
      const filePath = "/workspace/E-sign/backend/uploads/" + fileName;
      console.log("lksdjfklj");
      console.log(filePath);
      console.log("lksdjfklj");

      const actionJson = {
        recipient_name: "Shivakumara T",
        recipient_email: "shivakumart67@gmail.com",
        action_type: "SIGN",
        private_notes: "Please get back to us for further queries",
        signing_order: 0,
        verify_recipient: false,
        verification_type: "EMAIL",
      };

      const documentJson = {
        request_name: path.basename(filePath),
        expiration_days: 10,
        is_sequential: true,
        notes: "Please sign the document",
        actions: [actionJson],
      };

      const data = {
        requests: documentJson,
      };

      const payload = new FormData();
      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        payload.append("file", fileStream);
      } else {
        throw new Error("File does not exist");
      }
      payload.append("data", JSON.stringify(data));

      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
        ...payload.getHeaders(),
      };

      const requestUrl = "https://sign.zoho.in/api/v1/requests";

      const response = await axios.post(requestUrl, payload, {
        headers: headers,
      });

      if (
        !response.data ||
        !response.data.requests ||
        !response.data.requests.request_id
      ) {
        throw new Error("Failed to upload document");
      }

      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }

  async getDocumentsFromZoho(): Promise<DocumentType[]> {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests?data=%7B%22page_context%22%3A%7B%22row_count%22%3A%22100%22%2C%22start_index%22%3A1%2C%22search_columns%22%3A%7B%7D%2C%22sort_column%22%3A%22created_time%22%2C%22sort_order%22%3A%22DESC%22%7D%7D`;

      const response = await axios.get(requestUrl, {
        headers: headers,
      });

      if (!response.data || !response.data.requests) {
        throw new Error("Failed to complete signing process");
      }

      console.log(response.data.requests);

      return response.data.requests;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async createAndSubmitDocument(): Promise<any> {
    const recipientName = "Shivakumara";
    const recipientEmail = "shivakumart67@gmail.com";
    const signerName = "Shiva"; // Dummy signer name
    const signerEmail = "335me16044@gmail.com"; // Dummy signer email
    const filePath =
      "/workspace/E-sign/backend/uploads/file-1718854760284-544977528.pdf";

    try {
      // Step 1 - Upload document to Zoho Sign
      const request = await this.uploadDocument(
        filePath,
        recipientName,
        recipientEmail
      );
      const requestId = request.requests.request_id;
      const requestData = request.requests;

      // Step 2 - Initiate signing process
      const signResponse = await this.sendForSignature(
        requestData,
        recipientName,
        recipientEmail,
        requestId
      );

      console.log("Signing process initiated successfully:", signResponse);

      // Step 3 - Complete signing process
      const completeResponse = await this.completeSignature(requestId);

      console.log("Signing process completed:", completeResponse);

      // Step 4 - Get signed document
      const signedDocument = await this.getSignedDocument(requestId);

      console.log("Signed document retrieved:", signedDocument);

      return { message: "success" };
    } catch (error) {
      console.error("Error:", error);
      return {
        status: "failure",
        message: "Failed to complete signature process",
      };
    }
  }

  private async uploadDocument(
    filePath: string,
    recipientName: string,
    recipientEmail: string
  ): Promise<any> {
    try {
      const actionJson = {
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        action_type: "SIGN",
        private_notes: "Please get back to us for further queries",
        signing_order: 0,
        verify_recipient: true,
        verification_type: "EMAIL",
      };

      const documentJson = {
        request_name: path.basename(filePath),
        expiration_days: 10,
        is_sequential: true,
        notes: "Please sign the document",
        actions: [actionJson],
      };

      const data = {
        requests: documentJson,
      };

      const payload = new FormData();
      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        payload.append("file", fileStream);
      } else {
        throw new Error("File does not exist");
      }
      payload.append("data", JSON.stringify(data));

      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
        ...payload.getHeaders(),
      };

      const requestUrl = "https://sign.zoho.in/api/v1/requests";

      const response = await axios.post(requestUrl, payload, {
        headers: headers,
      });

      if (
        !response.data ||
        !response.data.requests ||
        !response.data.requests.request_id
      ) {
        throw new Error("Failed to upload document");
      }

      console.log("Document upload successful");
      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }

  private async sendForSignature(
    resp: any,
    recipientName: string,
    recipientEmail: string,
    requestId: string
  ): Promise<any> {
    try {
      console.log(resp);
      const actionsJson = {
        recipient_name: recipientName,
        action_id: resp.actions[0].action_id,
        recipient_email: recipientEmail,
        action_type: "SIGN",
        private_notes: "Please get back to us for further queries",
        signing_order: 0,
        verify_recipient: false,
        verification_type: "EMAIL",
        fields: [
          {
            document_id: resp.document_ids[0].document_id, // Assuming document_id '1' (you should replace with your actual document_id)
            field_name: "SignatureField", // Example field name
            field_type_name: "Signature", // Type of field (signature, initial, text, etc.)
            field_label: "Signature", // Label for the field
            field_category: "Signature",
            abs_width: "200",
            abs_height: "50",
            is_mandatory: true,
            x_coord: "100",
            y_coord: "100",
            page_no: 0,
          },
        ],
      };

      const documentJson = {
        request_name: resp.document_ids[0].document_name,
        expiration_days: 1,
        is_sequential: true,
        email_reminders: true,
        reminder_period: 8,
        actions: [actionsJson],
      };

      const data = {
        requests: documentJson,
      };

      const payload = new FormData();
      payload.append("data", JSON.stringify(data));

      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
        ...payload.getHeaders(),
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/submit`;

      const response = await axios.post(requestUrl, payload, {
        headers: headers,
      });

      if (!response.data || !response.data.requests) {
        throw new Error("Failed to initiate signing process");
      }

      return response.data;
    } catch (error) {
      console.error("Error initiating signing process:", error);
      throw error;
    }
  }

  private async completeSignature(requestId: string): Promise<any> {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/complete`;

      const response = await axios.post(requestUrl, null, {
        headers: headers,
      });

      if (!response.data || !response.data.requests) {
        throw new Error("Failed to complete signing process");
      }

      return response.data;
    } catch (error) {
      console.error("Error completing signing process:", error);
      throw error;
    }
  }

  private async getSignedDocument(requestId: string): Promise<any> {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + this.accessToken,
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/document`;

      const response = await axios.get(requestUrl, {
        headers: headers,
        responseType: "arraybuffer", // Response type to handle binary data
      });

      if (!response.data) {
        throw new Error("Failed to retrieve signed document");
      }

      // Assuming response.data is a Buffer/arraybuffer containing the signed document content
      return response.data;
    } catch (error) {
      console.error("Error retrieving signed document:", error);
      throw error;
    }
  }
}
