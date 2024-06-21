import { EsignService } from "../../domain/services/esign.service";

export class StoreCompletionCertificateUseCase {
  constructor(private readonly esignService: EsignService) {}

  async execute(requestId: string, fileName: string): Promise<string> {
    return this.esignService.storeCompletionCertificate(requestId, fileName);
  }
}
