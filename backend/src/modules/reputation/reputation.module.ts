import { Module } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { ReputationController } from './reputation.controller';
import { AuthModule } from '../auth/auth.module';
import { RewardsModule } from '../rewards/rewards.module';

@Module({
  imports: [AuthModule, RewardsModule],
  controllers: [ReputationController],
  providers: [ReputationService],
  exports: [ReputationService],
})
export class ReputationModule {}
