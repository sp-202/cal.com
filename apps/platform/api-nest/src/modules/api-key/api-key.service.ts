import { hashAPIKey } from "@/lib/api-key";
import { PrismaReadService } from "@/modules/prisma/prisma-read.service";
import { Response } from "@/types";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Request } from "express";

type ApiKeyInfo = {
  hashedKey: string;
  id: string;
  userId: number;
  teamId: number | null;
};

@Injectable()
export class ApiKeyService {
  constructor(private readonly dbRead: PrismaReadService) {}

  private setResponseApiKey = (response: Response, key: ApiKeyInfo) => {
    response.locals.apiKey = key;
  };

  async retrieveApiKey(request: Request, response?: Response) {
    const apiKey = request.get("Authorization")?.replace("Bearer ", "");
    if (!apiKey) throw new BadRequestException("Invalid API Key");

    const hashedKey = hashAPIKey(apiKey.replace("cal_", ""));

    const apiKeyResult = await this.dbRead.prisma.apiKey.findUnique({
      where: {
        hashedKey,
      },
    });

    if (response && apiKeyResult) {
      void this.setResponseApiKey(response, apiKeyResult);
    }

    return apiKeyResult;
  }
}
