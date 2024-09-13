import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { StoreDto } from '../store/store.dto';
import { StoreEntity } from '../store/store.entity';
import { ProductStoreService } from './product-store.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductStoreController {
    constructor(private readonly productStoreService: ProductStoreService) {}

    @Post(':productId/stores/:storeId')
    async addStoreToProduct(@Param('productId') productId: string, @Param('storeId') storeId: string) {
        return await this.productStoreService.addStoreToProduct(productId, storeId);
    }

    @Get(':productId/stores')
    async findStoresFromProduct(@Param('productId') productId: string) {
        return await this.productStoreService.findStoresFromProduct(productId);
    }

    @Get(':productId/stores/:storeId')
    async findStoreFromProduct(@Param('productId') productId: string, @Param('storeId') storeId: string) {
        return await this.productStoreService.findStoreFromProduct(productId, storeId);
    }

    @Put(':productId/stores')
    async updateStoresFromProduct(@Param('productId') productId: string, @Body() storesDto: StoreDto[]) {
        const stores = plainToInstance(StoreEntity, storesDto)
        return await this.productStoreService.updateStoresFromProduct(productId, stores);
    }

    @Delete(':productId/stores/:storeId')
    @HttpCode(204)
    async deleteStoreFromProduct(@Param('productId') productId: string, @Param('storeId') storeId: string) {
        return await this.productStoreService.deleteStoreFromProduct(productId, storeId);
    }
}