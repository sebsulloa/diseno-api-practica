import { Module } from '@nestjs/common';
import { ProductStoreService } from './product-store.service';
import { ProductStoreController } from './product-store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity, ProductEntity])],
  providers: [ProductStoreService],
  controllers: [ProductStoreController]
})
export class ProductStoreModule {}
