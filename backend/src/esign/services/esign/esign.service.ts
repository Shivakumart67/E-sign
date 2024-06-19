import * as fs from 'fs';
import axios from 'axios';
const FormData = require('form-data');
import { Injectable } from '@nestjs/common';
const path = require('path');

@Injectable()
export class EsignService {
  private readonly accessToken =
    '1000.e7e1ef374d859ee92cd45bbda5b06aa8.a96bf15eb29e4e5571925d69e9438593';

  async createAndSubmitDocument(): Promise<any> {
    const recipientName = 'Shivakumara';
    const recipientEmail = 'shivakumart67@gmail.com';
    const signerName = 'Shiva'; // Dummy signer name
    const signerEmail = '335me16044@gmail.com'; // Dummy signer email
    const filePath =
      '/workspace/E-sign/backend/uploads/file-1718795672216-165528176.pdf';

    try {
      // Step 1 - Upload document to Zoho Sign
      const request = await this.uploadDocument(
        filePath,
        recipientName,
        recipientEmail,
      );
      const requestId = request.requests.request_id;
      const requestData = request.requests;

      // Step 2 - Initiate signing process
      const signResponse = await this.sendForSignature(
        requestData,
        recipientName,
        recipientEmail,
        requestId,
      );

      console.log('Signing process initiated successfully:', signResponse);

      // Step 3 - Complete signing process
      const completeResponse = await this.completeSignature(requestId);

      console.log('Signing process completed:', completeResponse);

      // Step 4 - Get signed document
      const signedDocument = await this.getSignedDocument(requestId);

      console.log('Signed document retrieved:', signedDocument);

      return { message: 'success' };
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 'failure',
        message: 'Failed to complete signature process',
      };
    }
  }

  private async uploadDocument(
    filePath: string,
    recipientName: string,
    recipientEmail: string,
  ): Promise<any> {
    try {
      const actionJson = {
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        action_type: 'SIGN',
        private_notes: 'Please get back to us for further queries',
        signing_order: 0,
        verify_recipient: true,
        verification_type: 'EMAIL',
      };

      const documentJson = {
        request_name: path.basename(filePath),
        expiration_days: 10,
        is_sequential: true,
        notes: 'Please sign the document',
        actions: [actionJson],
      };

      const data = {
        requests: documentJson,
      };

      const payload = new FormData();
      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        payload.append('file', fileStream);
      } else {
        throw new Error('File does not exist');
      }
      payload.append('data', JSON.stringify(data));

      const headers = {
        Authorization: 'Zoho-oauthtoken ' + this.accessToken,
        ...payload.getHeaders(),
      };

      const requestUrl = 'https://sign.zoho.in/api/v1/requests';

      const response = await axios.post(requestUrl, payload, {
        headers: headers,
      });

      if (
        !response.data ||
        !response.data.requests ||
        !response.data.requests.request_id
      ) {
        throw new Error('Failed to upload document');
      }

      console.log('Document upload successful');
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  private async sendForSignature(
    resp: any,
    recipientName: string,
    recipientEmail: string,
    requestId: string,
  ): Promise<any> {
    try {
      console.log(resp);
      const actionsJson = {
        recipient_name: recipientName,
        action_id: resp.actions[0].action_id,
        recipient_email: recipientEmail,
        action_type: 'SIGN',
        private_notes: 'Please get back to us for further queries',
        signing_order: 0,
        verify_recipient: true,
        verification_type: 'EMAIL',
        fields: [
          {
            document_id: resp.document_ids[0].document_id, // Assuming document_id '1' (you should replace with your actual document_id)
            field_name: 'SignatureField', // Example field name
            field_type_name: 'Signature', // Type of field (signature, initial, text, etc.)
            field_label: 'Signature', // Label for the field
            field_category: 'Signature',
            abs_width: '200',
            abs_height: '50',
            is_mandatory: true,
            x_coord: '100',
            y_coord: '100',
            page_no: 0,
          },
        ],
      };

      const documentJson = {
        request_name: 'Request for Signature',
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
      payload.append('data', JSON.stringify(data));

      const headers = {
        Authorization: 'Zoho-oauthtoken ' + this.accessToken,
        ...payload.getHeaders(),
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/submit`;

      const response = await axios.post(requestUrl, payload, {
        headers: headers,
      });

      if (!response.data || !response.data.requests) {
        throw new Error('Failed to initiate signing process');
      }

      return response.data;
    } catch (error) {
      console.error('Error initiating signing process:', error);
      throw error;
    }
  }

  private async completeSignature(requestId: string): Promise<any> {
    try {
      const headers = {
        Authorization: 'Zoho-oauthtoken ' + this.accessToken,
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/complete`;

      const response = await axios.post(requestUrl, null, {
        headers: headers,
      });

      if (!response.data || !response.data.requests) {
        throw new Error('Failed to complete signing process');
      }

      return response.data;
    } catch (error) {
      console.error('Error completing signing process:', error);
      throw error;
    }
  }

  private async getSignedDocument(requestId: string): Promise<any> {
    try {
      const headers = {
        Authorization: 'Zoho-oauthtoken ' + this.accessToken,
      };

      const requestUrl = `https://sign.zoho.in/api/v1/requests/${requestId}/document`;

      const response = await axios.get(requestUrl, {
        headers: headers,
        responseType: 'arraybuffer', // Response type to handle binary data
      });

      if (!response.data) {
        throw new Error('Failed to retrieve signed document');
      }

      // Assuming response.data is a Buffer/arraybuffer containing the signed document content
      return response.data;
    } catch (error) {
      console.error('Error retrieving signed document:', error);
      throw error;
    }
  }
}
