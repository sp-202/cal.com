import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaClient, customPrisma } from "@calcom/prisma";

@Injectable()
export class PrismaWriteService implements OnModuleInit {
  public prisma: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    const dbUrl = configService.get("db.writeUrl", { infer: true });

    this.prisma = customPrisma({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    this.prisma.$connect();
  }
}
