import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from '../product/product.entity';
import { StoreEntity } from '../store/store.entity';
import { ProductStoreService } from './product-store.service';
import { faker } from '@faker-js/faker';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  let productRepository: Repository<ProductEntity>;
  let storeRepository: Repository<StoreEntity>;
  let product: ProductEntity;
  let storesList: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductStoreService],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    storeRepository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    storeRepository.clear();
    productRepository.clear();

    storesList = [];
    for(let i = 0; i < 5; i++){
      const store: StoreEntity = await storeRepository.save({
        name: faker.company.name(),
        city: faker.helpers.arrayElement(['BOG', 'MED', 'NYC']),
        address: faker.location.streetAddress()
      });
      storesList.push(store);
    }

    product = await productRepository.save({
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      stores: [storesList[0]]
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add a store to a product', async () => {
    const newStore: StoreEntity = storesList[1];
    const updatedProduct: ProductEntity = await service.addStoreToProduct(product.id, newStore.id);
    expect(updatedProduct.stores.length).toBe(2);
    expect(updatedProduct.stores.some(store => store.id === newStore.id)).toBeTruthy();
  });

  it('addStoreToProduct should throw an exception for an invalid store', async () => {
    await expect(() => service.addStoreToProduct(product.id, "0")).rejects.toHaveProperty("message", "The store with the given id was not found");
  });

  it('findStoreFromProduct should return store by product', async () => {
    const store: StoreEntity = storesList[0];
    const storedStore: StoreEntity = await service.findStoreFromProduct(product.id, store.id);
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toBe(store.name);
  });

  it('findStoreFromProduct should throw an exception for an invalid store', async () => {
    await expect(() => service.findStoreFromProduct(product.id, "0")).rejects.toHaveProperty("message", "The store with the given id was not found");
  });

  it('findStoresFromProduct should return stores by product', async () => {
    const stores: StoreEntity[] = await service.findStoresFromProduct(product.id);
    expect(stores.length).toBe(1);
  });

  it('findStoresFromProduct should throw an exception for an invalid product', async () => {
    await expect(() => service.findStoresFromProduct("0")).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('updateStoresFromProduct should update stores list for a product', async () => {
    const newStores: StoreEntity[] = [storesList[1], storesList[2]];
    const updatedProduct: ProductEntity = await service.updateStoresFromProduct(product.id, newStores);
    expect(updatedProduct.stores.length).toBe(2);
    expect(updatedProduct.stores.some(store => store.id === newStores[0].id)).toBeTruthy();
    expect(updatedProduct.stores.some(store => store.id === newStores[1].id)).toBeTruthy();
  });

  it('updateStoresFromProduct should throw an exception for an invalid product', async () => {
    const newStores: StoreEntity[] = [storesList[1], storesList[2]];
    await expect(() => service.updateStoresFromProduct("0", newStores)).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('deleteStoreFromProduct should remove a store from a product', async () => {
    const store: StoreEntity = storesList[0];
    
    await service.deleteStoreFromProduct(product.id, store.id);

    const updatedProduct: ProductEntity = await productRepository.findOne({where: {id: product.id}, relations: ['stores']});
    const deletedStore = updatedProduct.stores.find(s => s.id === store.id);

    expect(deletedStore).toBeUndefined();
  });

  it('deleteStoreFromProduct should throw an exception for a non associated store', async () => {
    const store: StoreEntity = storesList[2];
    await expect(() => service.deleteStoreFromProduct(product.id, store.id)).rejects.toHaveProperty("message", "The store with the given id is not associated to the product");
  });
});