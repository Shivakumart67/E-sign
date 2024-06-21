import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  Get,
  Body,
  Param,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { Express } from "express";
import { EsignService } from "../../../domain/services/esign.service";
import { InitiateEsignUseCase } from "../../../usecases/esign/initiate-esign.usecase";
import { RequestEsignUseCase } from "../../../usecases/esign/request-esign.usecase";
import { StoreCompletedDocumentUseCase } from "../../../usecases/esign/store-completed-document.usecase";
import { StoreCompletionCertificateUseCase } from "../../../usecases/esign/store-completion-certificate.usecase";
import { GetDocumentsUseCase } from "../../../usecases/esign/get-documents.usecase";
import { DocumentType } from "src/domain/entities/esign.entity";

@Controller("esign")
export class EsignController {
  constructor(
    private readonly getDocumentsUseCase: GetDocumentsUseCase,
    private readonly requestEsignUseCase: RequestEsignUseCase,
    private readonly initiateEsignUseCase: InitiateEsignUseCase,
    private readonly storeCompletedDocumentUseCase: StoreCompletedDocumentUseCase,
    private readonly storeCompletionCertificateUseCase: StoreCompletionCertificateUseCase,
    private readonly esignService: EsignService
  ) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const timestamp = new Date().toISOString().replace(/[-T:]/g, "");
          const originalName = file.originalname
            .split(".")
            .slice(0, -1)
            .join(".");
          const ext = extname(file.originalname);
          callback(null, `${originalName}_${timestamp}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return callback(new Error("Only PDF files are allowed!"), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      console.error("No file uploaded");
      throw new BadRequestException("No file uploaded");
    }
    try {
      console.log("File uploaded successfully:", file);
      return { filePath: file.path, file: file };
    } catch (error) {
      console.error("Error during file upload:", error);
      throw new InternalServerErrorException("File upload failed");
    }
  }

  @Get("getDocuments")
  async getZohoDocuments() {
    return await this.getDocumentsUseCase.execute();
  }

  @Post("requestToEsign")
  async requestForEsign(@Body() fileName: { fileName: string }) {
    if (!fileName.fileName) {
      return { message: "invalid file" };
    }
    return await this.requestEsignUseCase.execute(fileName.fileName);
  }

  @Post("initiateEsign")
  async initiateESign(
    @Body() data: { requestId: string; requestData: DocumentType }
  ) {
    if (!data.requestId) {
      return { message: "invalid request" };
    }
    return await this.initiateEsignUseCase.execute(
      data.requestId,
      data.requestData
    );
  }

  @Get("getCompletedDocument/:requestId/:fileName/:documentId")
  async getCompletedDoument(
    @Param("requestId") requestId: string,
    @Param("fileName") fileName: string,
    @Param("documentId") documentId: string
  ) {
    return await this.storeCompletedDocumentUseCase.execute(
      requestId,
      documentId,
      fileName
    );
  }

  @Get("getCompletedCertificate/:requestId/:fileName/")
  async getCompletedCertificate(
    @Param("requestId") requestId: string,
    @Param("fileName") fileName: string
  ) {
    return await this.storeCompletionCertificateUseCase.execute(
      requestId,
      fileName
    );
  }
}
