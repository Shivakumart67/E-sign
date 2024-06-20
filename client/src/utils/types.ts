interface Document {
  document_name: string;
  document_size: number;
  document_order: string;
  is_nom151_present: boolean;
  is_editable: boolean;
  total_pages: number;
  document_id: string;
}

interface Action {
  verify_recipient: boolean;
  recipient_countrycode_iso: string;
  action_type: string;
  cloud_provider_name: string;
  has_payment: boolean;
  recipient_email: string;
  send_completed_document: boolean;
  allow_signing: boolean;
  recipient_phonenumber: string;
  is_bulk: boolean;
  action_id: string;
  is_revoked: boolean;
  is_embedded: boolean;
  cloud_provider_id: number;
  signing_order: number;
  recipient_name: string;
  delivery_mode: string;
  action_status: string;
  recipient_countrycode: string;
}

export interface DocumentType {
  request_status: string;
  notes: string;
  reminder_period: number;
  owner_id: string;
  description: string;
  request_name: string;
  modified_time: number;
  action_time: number;
  is_deleted: boolean;
  expiration_days: number;
  is_sequential: boolean;
  sign_submitted_time: number;
  templates_used: string[];
  owner_first_name: string;
  sign_percentage: number;
  expire_by: number;
  owner_email: string;
  created_time: number;
  email_reminders: boolean;
  document_ids: Document[];
  self_sign: boolean;
  in_process: boolean;
  validity: number;
  request_type_name: string;
  request_id: string;
  zsdocumentid: string;
  request_type_id: string;
  owner_last_name: string;
  loadingDownloadCertificate?: boolean
  loadingDownloadDocument?: boolean
  actions: Action[];
  loading?: boolean;
}

