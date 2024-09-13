import { Test, TestingModule } from '@nestjs/testing';
import { ProductStoreController } from './product-store.controller';

describe('ProductStoreController', () => {
  let controller: ProductStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductStoreController],
    }).compile();

    controller = module.get<ProductStoreController>(ProductStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
