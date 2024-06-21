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
import { EsignService } from "src/esign/services/esign/esign.service";

@Controller("esign")
export class EsignController {
  constructor(private zohoSignService: EsignService) {}

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
    const data = await this.zohoSignService.getDocumentsFromZoho();
    return data;
  }

  @Post("requestToEsign")
  async requestForEsign(@Body() fileName: { fileName: string }) {
    if (!fileName.fileName) {
      return { message: "invalid file" };
    }
    return await this.zohoSignService.requestDocumentToZoho(fileName.fileName);
  }

  @Post("initiateEsign")
  async initiateESign(
    @Body() data: { requestId: string; requestData: DocumentType }
  ) {
    if (!data.requestId) {
      return { message: "invalid request" };
    }
    return await this.zohoSignService.initiateEsignFromZoho(
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
    const data = await this.zohoSignService.storeCompletedDocument(
      requestId,
      documentId,
      fileName
    );
    return data;
  }

  @Get("getCompletedCertificate/:requestId/:fileName/")
  async getCompletedCertificate(
    @Param("requestId") requestId: string,
    @Param("fileName") fileName: string
  ) {
    const data = await this.zohoSignService.storeCompletionCertificate(
      requestId,
      fileName
    );
    return data;
  }
}
