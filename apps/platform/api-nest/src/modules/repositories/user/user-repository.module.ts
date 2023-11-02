import { UserRepository } from "@/modules/repositories/user/user-repository.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
