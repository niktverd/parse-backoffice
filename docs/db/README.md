# Документация Публичного API

## Базовые

```ts
export type Selector = Record<string, string> & {
    container: string;
};

export type Source = {
    data: {
        id: string;
        name: string;
        description: string;
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

`/api/public` GET возвращает список источников данных

@return `Source[]`

### Источник данных

`/api/public?sourceId=<SOURCE_ID>` GET возвращает источник данных по ID источника

@return `Source`

### Добавление источника данных

`/api/public` POST Добавляет источник и возвращает добавленный

@return `Source`

В качестве параметра нужно передать НИЧЕГО

### Обновление источника данных

`/api/public` PATCH Обновляет источник и возвращает обновленный

@return `Source`

В качестве параметра нужно передать измененое значение

!!! Объект переписывается полностью и не валидируется в MVP
