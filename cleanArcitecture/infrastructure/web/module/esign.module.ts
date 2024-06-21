import { Module } from "@nestjs/common";
import { EsignController } from "../controllers/esign.controller";
import { EsignService } from "../../../domain/services/esign.service";
import { ZohoSignService } from "../../zoho-sign/zoho-sign.service";
import { GetDocumentsUseCase } from "../../../usecases/esign/get-documents.usecase";
import { RequestEsignUseCase } from "../../../usecases/esign/request-esign.usecase";
import { InitiateEsignUseCase } from "../../../usecases/esign/initiate-esign.usecase";
import { StoreCompletedDocumentUseCase } from "../../../usecases/esign/store-completed-document.usecase";
import { StoreCompletionCertificateUseCase } from "../../../usecases/esign/store-completion-certificate.usecase";
import { FileStorageModule } from "./file.module";

@Module({
  imports: [FileStorageModule],
  controllers: [EsignController],
  providers: [
    EsignService,
    ZohoSignService,
    GetDocumentsUseCase,
    RequestEsignUseCase,
    InitiateEsignUseCase,
    StoreCompletedDocumentUseCase,
    StoreCompletionCertificateUseCase,
  ],
})
export class EsignModule {}
