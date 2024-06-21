import { EsignService } from "../../domain/services/esign.service";
import { DocumentType } from "../../domain/entities/esign.entity";

export class InitiateEsignUseCase {
  constructor(private readonly esignService: EsignService) {}

  async execute(requestId: string, requestData: DocumentType): Promise<any> {
    return this.esignService.initiateEsignFromZoho(requestId, requestData);
  }
}
