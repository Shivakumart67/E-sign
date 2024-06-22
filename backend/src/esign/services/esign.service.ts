import * as fs from "fs";
import axios from "axios";
const FormData = require("form-data");
import { Injectable } from "@nestjs/common";
const path = require("path");
import {
  accessToken,
  completedDocumentsDirectory,
  uploadFilePath,
  recipientEmail,
  recipientName,
  completionCertificateDirectory,
  templateId,
} from "../../utils/constants";

@Injectable()
export class EsignService {
  async storeCompletionCertificate(requestId: string, fileName: string) {
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
        throw new Error("Failed to download the completed document");
      }
      const outputDir = completionCertificateDirectory;

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
            x_coord: 15,
            abs_height: 13,
            text_property: {
              is_italic: false,
              max_field_length: 2048,
              is_underline: false,
              font_color: "000000",
              is_fixed_width: false,
              font_size: 11,
              is_fixed_height: false,
              is_read_only: false,
              is_bold: false,
              font: "Roboto",
            },
            field_category: "textfield",
            field_label: "Text - 1",
            is_mandatory: true,
            default_value: "Radio Button 1",
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Radio Button 1",
            y_value: 69.09162,
            abs_width: 131,
            width: 21.97183,
            y_coord: 582,
            field_type_name: "Textfield",
            description_tooltip: "",
            x_value: 2.535211,
            height: 1.592568,
          },
          {
            x_coord: 165,
            abs_height: 13,
            text_property: {
              is_italic: false,
              max_field_length: 2048,
              is_underline: false,
              font_color: "000000",
              is_fixed_width: false,
              font_size: 11,
              is_fixed_height: false,
              is_read_only: false,
              is_bold: false,
              font: "Roboto",
            },
            field_category: "textfield",
            field_label: "Text - 7",
            is_mandatory: true,
            default_value: "Option 2",
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Option 2",
            y_value: 71.38146,
            abs_width: 98,
            width: 16.431925,
            y_coord: 601,
            field_type_name: "Textfield",
            description_tooltip: "",
            x_value: 27.703932,
            height: 1.592568,
          },
          {
            x_coord: 35,
            abs_height: 13,
            text_property: {
              is_italic: false,
              max_field_length: 2048,
              is_underline: false,
              font_color: "000000",
              is_fixed_width: false,
              font_size: 11,
              is_fixed_height: false,
              is_read_only: false,
              is_bold: false,
              font: "Roboto",
            },
            field_category: "textfield",
            field_label: "Text - 3",
            is_mandatory: true,
            default_value: "Option 1",
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Option 1",
            y_value: 71.38146,
            abs_width: 98,
            width: 16.431925,
            y_coord: 601,
            field_type_name: "Textfield",
            description_tooltip: "",
            x_value: 5.911825,
            height: 1.592568,
          },
          {
            field_category: "radiogroup",
            field_label: "Radiogroup - 5",
            is_mandatory: true,
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Radiogroup - 5",
            sub_fields: [
              {
                y_value: 71.795685,
                x_coord: 24,
                abs_width: 13,
                abs_height: 13,
                width: 2.253521,
                y_coord: 605,
                default_value: false,
                page_no: 0,
                sub_field_name: "Radio30",
                x_value: 4.037559,
                height: 1.592568,
              },
              {
                y_value: 71.80398,
                x_coord: 154,
                abs_width: 12,
                abs_height: 12,
                width: 1.971831,
                y_coord: 605,
                default_value: false,
                page_no: 0,
                sub_field_name: "Radio31",
                x_value: 25.824532,
                height: 1.393497,
              },
            ],
            is_read_only: false,
            field_type_name: "Radiogroup",
            description_tooltip: "",
          },
          {
            x_coord: 15,
            abs_height: 14,
            text_property: {
              is_italic: false,
              max_field_length: 2048,
              is_underline: false,
              font_color: "000000",
              is_fixed_width: false,
              font_size: 11,
              is_fixed_height: true,
              is_read_only: false,
              is_bold: false,
              font: "Roboto",
            },
            field_category: "textfield",
            field_label: "Text - 2",
            is_mandatory: true,
            default_value: "Radio Button 2",
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Radio Button 2",
            y_value: 76.07674,
            abs_width: 131,
            width: 22.065727,
            y_coord: 641,
            field_type_name: "Textfield",
            description_tooltip: "",
            x_value: 2.531543,
            height: 1.658925,
          },
          {
            x_coord: 165,
            abs_height: 13,
            text_property: {
              is_italic: false,
              max_field_length: 2048,
              is_underline: false,
              font_color: "000000",
              is_fixed_width: false,
              font_size: 11,
              is_fixed_height: false,
              is_read_only: false,
              is_bold: false,
              font: "Roboto",
            },
            field_category: "textfield",
            field_label: "Text - 8",
            is_mandatory: true,
            default_value: "Option 2",
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Option 2",
            y_value: 78.35206,
            abs_width: 98,
            width: 16.431925,
            y_coord: 660,
            field_type_name: "Textfield",
            description_tooltip: "",
            x_value: 27.703197,
            height: 1.592568,
          },
          {
            x_coord: 35,
            abs_height: 13,
            text_property: {
              is_italic: false,
              max_field_length: 2048,
              is_underline: false,
              font_color: "000000",
              is_fixed_width: false,
              font_size: 11,
              is_fixed_height: false,
              is_read_only: false,
              is_bold: false,
              font: "Roboto",
            },
            field_category: "textfield",
            field_label: "Text - 4",
            is_mandatory: true,
            default_value: "Option 1",
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Option 1",
            y_value: 78.35206,
            abs_width: 98,
            width: 16.431925,
            y_coord: 660,
            field_type_name: "Textfield",
            description_tooltip: "",
            x_value: 5.911825,
            height: 1.592568,
          },
          {
            field_category: "radiogroup",
            field_label: "Radiogroup - 4",
            is_mandatory: true,
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "Radiogroup - 4",
            sub_fields: [
              {
                y_value: 78.56047,
                x_coord: 24,
                abs_width: 12,
                abs_height: 12,
                width: 1.971831,
                y_coord: 661,
                default_value: false,
                page_no: 0,
                sub_field_name: "Radio26",
                x_value: 4.033891,
                height: 1.393497,
              },
              {
                y_value: 78.5698,
                x_coord: 154,
                abs_width: 12,
                abs_height: 12,
                width: 1.971831,
                y_coord: 662,
                default_value: false,
                page_no: 0,
                sub_field_name: "Radio27",
                x_value: 25.825264,
                height: 1.393497,
              },
            ],
            is_read_only: false,
            field_type_name: "Radiogroup",
            description_tooltip: "",
          },
          {
            x_coord: 24,
            abs_height: 27,
            text_property: {
              is_italic: false,
              max_field_length: 2048,
              is_underline: false,
              font_color: "000000",
              is_fixed_width: false,
              font_size: 11,
              is_fixed_height: false,
              is_read_only: false,
              is_bold: false,
              font: "Roboto",
            },
            field_category: "textfield",
            field_label: "Text - 9",
            is_mandatory: true,
            default_value: "E-Sign:",
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            field_name: "E-Sign",
            y_value: 85.76279,
            abs_width: 94,
            width: 15.774648,
            y_coord: 722,
            field_type_name: "Textfield",
            description_tooltip: "",
            x_value: 4.037559,
            height: 3.185136,
          },
          {
            x_coord: 125,
            abs_height: 30,
            field_category: "image",
            field_label: "Signature",
            is_mandatory: true,
            page_no: 0,
            document_id: requestData?.document_ids?.[0]?.document_id || "",
            is_draggable: true,
            field_name: "Signature",
            y_value: 85.772125,
            abs_width: 215,
            width: 36.05634,
            y_coord: 722,
            field_type_name: "Signature",
            description_tooltip: "",
            is_resizable: true,
            x_value: 20.941168,
            height: 3.583278,
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
    }
  }
}
