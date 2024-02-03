# Документация Публичного API

## Базовые

Есть у конфига обязательное поле `container`. Это поле должно отсылать к общему родителю, внутри которого находятся все собираемые поля. Иначе не получается объединить. Кажется, что его можно высчитывать на странице. Пока я сделал, чтобы его можно было добавить руками

```ts
export type Selector = Record<string, string> & {
  container: string;
};

export type Source = {
  data: {
    id: string;
    name: string;
    description: string;
    link: string;
    status: 'run' | 'stop';
  };
  configs: {
    list: Selector;
    item: Selector;
  };
};
```

## Заголовок

Чтобы отправить запрос, в запросе должен быть заголовок `authorization`. Значение заголовка должно быть в формате `"Bearer <API_KEY>"`

## Ручки

### Список источников данных

`/api/public/sources` GET возвращает список источников данных

@return `Source[]`

### Источник данных

`/api/public/sources/?sourceId=<SOURCE_ID>` GET возвращает источник данных по ID источника

@return `Source`

### Добавление источника данных

`/api/public/sources` POST Добавляет источник и возвращает добавленный

@return `Source`

В качестве параметра нужно передать НИЧЕГО

### Обновление источника данных

`/api/public/sources` PATCH Обновляет источник и возвращает обновленный

@return `Source`

В качестве параметра нужно передать измененое значение

!!! Объект переписывается полностью и не валидируется в MVP

## Успешные конфиги

```json
{
   "configs": {
      "item": {
         "container": "//*[@id=\"app_body\"]",
         "header": "//*[@id=\"header\"]/h1",
         "location": "//*[@id=\"header\"]/div",
         "content": "//*[@id=\"content\"]"
      },
      "list": {
         "container": "//*[@id=\"main\"]/section/div",
         "link": "//*[@id=\"main\"]/section/div/a",
         "shortDescription": "//*[@id=\"main\"]/section/div/span"
      }
   },
   "data": {
      "name": "Abbyy",
      "link": "https://boards.eu.greenhouse.io/abbyy",
      "description": "",
      "id": "7af823a2-9103-4061-95c5-b3152f1229b7",
      "status": "stop"
   },
   "id": "7af823a2-9103-4061-95c5-b3152f1229b7"
}

{
   "configs": {
      "item": {
         "container": "/html/body",
         "content": "/html/body/div"
      },
      "list": {
         "container": "/html/body/div/div[4]/div[1]/div/div/div",
         "link": "/html/body/div/div[4]/div[1]/div/div/div/h3/a",
         "desc": "/html/body/div/div[4]/div[1]/div/div/div/p"
      }
   },
   "data": {
      "name": "peopleforce",
      "link": "https://adapty.peopleforce.io/careers/?locale=ru",
      "description": "",
      "id": "f9c69ee7-001a-463e-aef3-11e4b359318a",
      "status": "stop"
   },
   "id": "f9c69ee7-001a-463e-aef3-11e4b359318a"
}
```