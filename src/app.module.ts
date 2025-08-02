import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProducersModule } from './producers/producers.module';
import { FarmsModule } from './farms/farms.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { IsCpfOrCnpjConstraint } from './common/decorators/is-cpf-or-cnpj.decorator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProducersModule,
    FarmsModule,
    DashboardModule,
  ],
  controllers: [],
  // 2. Add the validation class to the providers array
  providers: [IsCpfOrCnpjConstraint],
})
export class AppModule {}
