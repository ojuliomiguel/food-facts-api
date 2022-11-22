# Requisitos da aplicação

- Criar um banco de dados MongoDB usando Atlas: https://www.mongodb.com/cloud/atlas ou algum Banco de Dados SQL se não sentir confortável com NoSQL;
- Criar uma REST API usando NodeJS com as melhores práticas de desenvolvimento.
- Integrar a API com o banco de dados criado para persistir os dados
- Recomendável usar Drivers oficiais para integração com o DB
- Desenvolver Testes Unitários

### Modelo de Dados:

Para a definição do modelo, consultar o arquivo [products.json](./products.json) que foi exportado do Open Food Facts, um detalhe importante é que temos dois campos personalizados para poder fazer o controle interno do sistema e que deverão ser aplicados em todos os alimentos no momento da importação, os campos são:

- `imported_t`: campo do tipo Date com a dia e hora que foi importado;
- `status`: campo do tipo Enum com os possíveis valores draft, trash e published;

### Sistema do CRON

Para prosseguir com o desafio, precisaremos criar na API um sistema de atualização que vai importar os dados para a Base de Dados com a versão mais recente do [Open Food Facts](https://br.openfoodfacts.org/data) uma vez ao día. Adicionar aos arquivos de configuração o melhor horário para executar a importação.

A lista de arquivos do Open Food, pode ser encontrada em: 

- https://challenges.coode.sh/food/data/json/index.txt
- https://challenges.coode.sh/food/data/json/data-fields.txt

Onde cada linha representa um arquivo que está disponível em https://challenges.coode.sh/food/data/json/{filename}.

É recomendável utilizar uma Collection secundária para controlar os históricos das importações e facilitar a validação durante a execução.

Ter em conta que:

- Todos os produtos deverão ter os campos personalizados `imported_t` e `status`.
- Limitar a importação a somente 100 produtos de cada arquivo.

### A REST API

Na REST API teremos um CRUD com os seguintes endpoints:

 - `GET /`: Detalhes da API, se conexão leitura e escritura com a base de dados está OK, horário da última vez que o CRON foi executado, tempo online e uso de memória.
 - `PUT /products/:code`: Será responsável por receber atualizações do Projeto Web
 - `DELETE /products/:code`: Mudar o status do produto para `trash`
 - `GET /products/:code`: Obter a informação somente de um produto da base de dados
 - `GET /products`: Listar todos os produtos da base de dados, adicionar sistema de paginação para não sobrecarregar o `REQUEST`.