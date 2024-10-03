import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Company API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('COMPANY', () => {
    it('Create Company', async () => {
      const requestBody = {
        name: faker.word.words(3),          
        cnpj: faker.string.numeric(14),         
        state: 'SC',
        city: 'Criciuma',        
        address: 'Rua Exemplo, 123',
        sector: 'Tecnologia'    
      };

      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson(requestBody)
        .expectStatus(StatusCodes.CREATED);
    });
  });
  
  it('Get All Companies', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company`)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('id') //se tem id ta valendo
  });

  it('Update Company by ID', async () => {
    const companyId = 1;  
    const requestBody = {
      name: faker.word.words(3), 
      cnpj: '12345678000195',
      state: 'SC',
      city: 'Criciuma',
      address: 'rua exemplo, 123',
      sector: 'Tecnologia'
    };

    await p
      .spec()
      .put(`${baseUrl}/company/${companyId}`)
      .withJson(requestBody)
      .expectStatus(StatusCodes.OK); 
  });

  it('Get Company by ID', async () => {
    const companyId = 1;
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK)
  });

  it('Delete Company by ID', async () => {
    const companyId = 1;
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK);
    }
  );

  it('Get Company by ID - Not Found', async () => {
    const companyId = 999;
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  fit('Add Product to a Company', async () => {
    const company = {
      name: faker.word.words(3), 
      cnpj: '12345678000195',
      state: 'SC',
      city: 'Criciuma',
      address: 'rua exemplo, 123',
      sector: 'Tecnologia'
    };
   
    const requestBody = {
      productName: faker.word.words(1),
      productDescription: faker.word.words(1),
      price: faker.commerce.price()                       
    };

    const response =  await p
      .spec()
      .post(`${baseUrl}/company`)
      const companyID = response.body.id;

    await p
      .spec()
      .post(`${baseUrl}/company/${companyID}/products`)
      .withJson(requestBody)
      .expectStatus(StatusCodes.CREATED)  
      // .expectBodyContains('productName'); 
  });

});
