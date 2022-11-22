# NodeJs Challenge

## Descrição

**Esta aplicação realiza download de um arquivo (contendo dados a respeito de alimentos) a cada x período de tempo e disponibiliza os dados através de endpoints**.

## [Requisitos](REQUISITOS.md)

## Tech

- node.js - javascript runtime
- [nestjs](https://nestjs.com/) - Construção de aplicativos eficientes, confiáveis e escaláveis do lado do servidor
- docker

## Instalação

- Node >= v16.13.2
- docker

> Recomendo utilizar yarn


Modificar o arquivo `docker-compose.yml` com os dados de sua preferencia e subir
o banco com o comando:

```bash
$ docker compose up -d
```

```yml
version: "3.9"
services: 
  food-facts-db:
    volumes: 
      - /var/lib/pg_food_facts/pgdata:/var/lib/postgresql/data
    image: postgres
    ports:
      - '5477:5432'
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: food_facts
```

criar um arquivo .env com base no .env.exemplo do projeto

```
DB_PORT=5477
DB_HOST=localhost
BASE_URL=www.google.com
DB_USER=julio
DB_NAME=food_facts
DB_PWD=code42
CRON_EXPRESSION=*/10 * * * * *

```

```bash
$ npm install
```

## Executando a app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Endpoints:

Endpoint base `http://localhost:3007`

Status da aplicação 

```json
{
  "memoryUsage": 49841328,
  "uptime": 37261.21
}
```

##### `GET` -> `http://localhost:3007/products/:id`

Localizar produto por id

```json
{
	"id": "d8fb5da4-06c2-47c6-80d9-99c42c9b8fb5",
	"code": "815361016313",
	"status": "published",
	"importedT": "2022-10-28T19:56:14.910Z",
	"url": "www.google.com",
	"creator": "kiliweb",
	"createdT": "2022-10-28T19:56:14.910Z",
	"lastModifiedT": "2022-10-28T19:56:14.910Z",
	"productName": "Prout",
	"quantity": "0",
	"brands": "",
	"categories": "",
	"labels": "",
	"cities": "",
	"purchasePlaces": "",
	"stores": "",
	"ingredientsText": "",
	"traces": "",
	"servingSize": "0",
	"servingQuantity": 0,
	"nutriscoreScore": 0,
	"nutriscoreGrade": "0",
	"mainCategory": "",
	"imageUrl": "https://static.openfoodfacts.org/images/products/081/536/101/6313/front_fr.3.400.jpg",
	"deletedAt": null
}
```

##### `GET` -> `http://localhost:3007/products`

Listar todos os produto

```json
{
"items": [...],  
"meta": {
		"totalItems": 90,
		"itemCount": 10,
		"itemsPerPage": 10,
		"totalPages": 9,
		"currentPage": 1
	}
}
```

##### `DELETE` -> `http://localhost:3007/products/:id`

Deletar um produto

##### `PUT` -> `http://localhost:3007/products/:id`

Atualizar um produto


```json
{
	
	"url": "www.google.com",
  "creator": "julio",
  "...": "..."
} 
```