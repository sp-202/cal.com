import { BookingRepository } from "@/modules/repositories/booking/booking-repository.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [BookingRepository],
  exports: [BookingRepository],
})
export class BookingRepositoryModule {}
