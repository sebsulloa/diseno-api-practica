import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { ProductStoreModule } from './product-store/product-store.module';

@Module({
  imports: [ProductModule, StoreModule, ProductStoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
