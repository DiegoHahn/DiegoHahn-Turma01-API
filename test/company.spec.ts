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

  it('Create Company with empty fields', async () => {
    const invalidRequestBody = {
      name: '',  
      cnpj: '',
      state: '',
      city: '',
      address: 'Rua Exemplo, 123',
      sector: 'Tecnologia'
    };
    await p
      .spec()
      .post(`${baseUrl}/company`)
      .withJson(invalidRequestBody)
      .expectStatus(StatusCodes.BAD_REQUEST);
  });

  it('Create Company with Invalid CNPJ Format', async () => {
    const requestBody = {
      name: faker.word.words(3),          
      cnpj: 'cnpj',        
      state: 'SC',
      city: 'Criciuma',        
      address: 'Rua Exemplo, 123',
      sector: 'Tecnologia'    
    };
    await p
      .spec()
      .post(`${baseUrl}/company`)
      .withJson(requestBody)
      .expectStatus(StatusCodes.BAD_REQUEST);
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

  it('Update Non-existent Company', async () => {
    const nonExistentCompanyId = 99999;
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
      .put(`${baseUrl}/company/${nonExistentCompanyId}`)
      .withJson(requestBody)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Get Company by ID', async () => {
    const companyId = 1;
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK)
  });

  it('Get Company with Invalid ID Format', async () => {
    const invalidCompanyId = 'letras';
    await p
      .spec()
      .get(`${baseUrl}/company/${invalidCompanyId}`)
      .expectStatus(StatusCodes.BAD_REQUEST);
  });

  it('Delete Company by ID', async () => {
    const companyId = 1;
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK);
    }
  );

  it('Delete invalid Company', async () => {
    const companyId = "letras";
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.BAD_REQUEST);
    }
  );

  it('Get Company by ID - Not Found', async () => {
    const companyId = 999;
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });
});
