import { Injectable } from '@nestjs/common';

@Injectable()
export class SignatureService {
  verifySignature(address: string, message: string, signature: string): boolean {
    return false;
  }
}
