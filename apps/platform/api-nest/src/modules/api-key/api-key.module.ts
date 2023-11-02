import { ApiKeyService } from "@/modules/api-key/api-key.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
