import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { Injectable } from "@nestjs/common";
import { EsignRepository } from "../../domain/repositories/esign.repository";
import { DocumentType } from "../../domain/entities/esign.entity";
import {
  accessToken,
  completedDocumentsDirectory,
  uploadFilePath,
  recipientEmail,
  recipientName,
  completionCertificateDirectory,
} from "../../shared/utils/constants";
import FormData from "form-data";
import { FileStorageService } from "../file-storage/file-storage.service";

@Injectable()
export class ZohoSignService implements EsignRepository {
  constructor(private readonly fileStorageService: FileStorageService) {}

  async getDocumentsFromZoho(): Promise<DocumentType[]> {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + accessToken,
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests?data=%7B%22page_context%22%3A%7B%22row_count%22%3A%22100%22%2C%22start_index%22%3A1%2C%22search_columns%22%3A%7B%7D%2C%22sort_column%22%3A%22created_time%22%2C%22sort_order%22%3A%22DESC%22%7D%7D`;

      const response = await axios.get(requestUrl, {
        headers: headers,
      });

      if (!response.data || !response.data.requests) {
        throw new Error("Failed to complete signing process");
      }

      return response.data.requests;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async requestDocumentToZoho(fileName: string): Promise<DocumentType> {
    try {
      const filePath = uploadFilePath + fileName;

      const actionJson = {
        recipient_name: recipientName,
        recipient_email: recipientEmail,
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
        Authorization: "Zoho-oauthtoken " + accessToken,
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

  async initiateEsignFromZoho(
    requestId: string,
    requestData: DocumentType
  ): Promise<any> {
    try {
      const actionsJson = {
        recipient_name:
          requestData?.actions?.[0]?.recipient_name || recipientName,
        action_id: requestData?.actions?.[0]?.action_id || "",
        recipient_email:
          requestData?.actions?.[0]?.recipient_email || recipientEmail,
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
            x_coord: "400",
            y_coord: "600",
            page_no: 0,
            is_read_only: false,
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
        Authorization: "Zoho-oauthtoken " + accessToken,
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

  async storeCompletedDocument(
    requestId: string,
    documentId: string,
    fileName: string
  ): Promise<string> {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + accessToken,
      };
      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/documents/${documentId}/pdf`;
      const response = await axios.get(requestUrl, {
        headers: headers,
        responseType: "stream",
      });

      if (!response || response.status !== 200) {
        throw new Error("Failed to download the completed document");
      }

      const outputDir = completedDocumentsDirectory;
      const filePath = path.join(outputDir, `${fileName}`);

      this.fileStorageService.createDirectoryIfNotExists(outputDir);

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

  async storeCompletionCertificate(
    requestId: string,
    fileName: string
  ): Promise<string> {
    try {
      const headers = {
        Authorization: "Zoho-oauthtoken " + accessToken,
      };
      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/completioncertificate`;
      const response = await axios.get(requestUrl, {
        headers: headers,
        responseType: "stream",
      });

      if (!response || response.status !== 200) {
        throw new Error("Failed to download the completed certificate");
      }

      const outputDir = completionCertificateDirectory;
      const filePath = path.join(outputDir, `${fileName}`);

      this.fileStorageService.createDirectoryIfNotExists(outputDir);

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          resolve(`/downloads/completionCertificate/${fileName}`);
        });
        writer.on("error", (error) => {
          console.error("Error writing the file:", error);
          reject("Failed to save the downloaded certificate");
        });
      });
    } catch (error) {
      console.error("Error downloading the completed certificate:", error);
      throw error;
    }
  }
}
