<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Описание

### Конфигурация

В продакшене для получения доступа к Apollo Sandbox необходимо передать в качестве query-параметров один из **5 API ключей**, которые генерируются каждый раз при старте приложения с помощью функции randomBytes встроенного модуля [crypto](https://nodejs.org/api/crypto.html) в файл **config/sandboxAPIKeys.txt**, а затем дублируются в консоль сервера.

Файлы конфигурации определены в деректории **config**.

### Оптимизация

Для оптимизации работы GraphQL с вложенными данными при запросах к базе данных из объекта GraphQLResolveInfo GraphQL запроса формируется объект с полями, которые запросил клиент, а затем этот объект передается в кастомное свойство HTTP-запроса. 

Для того, чтобы в ресолвер не передавать целый объект запроса, в декораторе извлекается объект с запрошенными полями для конректной модели.

### Структура проекта

Все сущности таблиц базы данных определены в одну деректорию **src/common-entities**.

Глобальный фильтр HTTP и GraphQL ошибок определен и деректории **src/filter**.

В деректории **src/graphql** определены сущности, которые используются для работы с GraphQL:
- **src/graphql/decorators/requested-include-fields**: Декоратор, используемый для извлечения объекта запрошенных клиентом полей, для конкретной модели
- **src/graphql/interceptors/graphql-data**: Перехватчик, используемый для формирования объекта запрошенных клиентом полей
- **src/graphql/middlewares/sandbox-token**: Промежуточный обработчик, необходимый для проверки API ключей для доступа к Apollo Sandbox в продакшене
- **src/graphql/models**: Модели, описывающие GraphQL схему

Также в деректорию **src/graphql** генерируется файл **schema.gql**.

В деректории **src/prisma** определены: 
- **prisma.module.ts**, **prisma.service.ts**: Для работы с Prisma
- **seed.ts**: Для заполнения базы данных исходными данными

В эту же деректорию Prisma генерует типы и интерфейсы таблиц при выполнении команды npx prisma generate.

Деректория **src/types** содержит типы и интерфейсы для работы с Prisma и GraphQL.