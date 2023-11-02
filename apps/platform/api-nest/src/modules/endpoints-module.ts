import { BookingModule } from "@/modules/booking/booking.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

@Module({
  imports: [BookingModule],
})
export class EndpointsModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(_consumer: MiddlewareConsumer) {
    // TODO: apply ratelimits
  }
}
