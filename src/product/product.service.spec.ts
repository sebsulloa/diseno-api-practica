import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { faker } from '@faker-js/faker';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for(let i = 0; i < 5; i++){
        const product: ProductEntity = await repository.save({
        name: faker.commerce.productName(), 
        price: parseFloat(faker.commerce.price()), 
        type: i % 2 === 0 ? 'Perecedero' : 'No perecedero'
        })
        productsList.push(product);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductEntity = productsList[0];
    const product: ProductEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name)
    expect(product.price).toEqual(storedProduct.price)
    expect(product.type).toEqual(storedProduct.type)
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('create should return a new product', async () => {
    const product: ProductEntity = {
      id: "",
      name: faker.commerce.productName(), 
      price: parseFloat(faker.commerce.price()),
      type: 'Perecedero',
      stores: []
    }

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductEntity = await repository.findOne({where: {id: newProduct.id}})
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name)
    expect(storedProduct.price).toEqual(newProduct.price)
    expect(storedProduct.type).toEqual(newProduct.type)
  });

  it('create should throw an exception for an invalid product type', async () => {
    const product: ProductEntity = {
      id: "",
      name: faker.commerce.productName(), 
      price: parseFloat(faker.commerce.price()),
      type: 'Invalid',
      stores: []
    }
    await expect(() => service.create(product)).rejects.toHaveProperty("message", "Invalid product type. It must be either 'Perecedero' or 'No perecedero'")
  });

  it('update should modify a product', async () => {
    const product: ProductEntity = productsList[0];
    product.name = "New name";
    product.price = 100;
  
    const updatedProduct: ProductEntity = await service.update(product.id, product);
    expect(updatedProduct).not.toBeNull();
  
    const storedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } })
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(product.name)
    expect(storedProduct.price).toEqual(product.price)
  });
 
  it('update should throw an exception for an invalid product', async () => {
    let product: ProductEntity = productsList[0];
    product = {
      ...product, name: "New name", price: 100
    }
    await expect(() => service.update("0", product)).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('delete should remove a product', async () => {
    const product: ProductEntity = productsList[0];
    await service.delete(product.id);
  
    const deletedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } })
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const product: ProductEntity = productsList[0];
    await service.delete(product.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The product with the given id was not found")
  });
});