# Библиотека доступа к сервисам api.tks.ru и calc.tks.ru

Является примером работы с методами API ТН ВЭД и API Расчет таможенных платежей.

## Оглавление.

+ [Общие положения.](#общие-положения)
+ [Идентификация пользователей API.](#идентификация-пользователей-api)
+ [ТН ВЭД.](#api-тн-вэд)
+ [Расчет таможенных платежей.](#расчет-таможенных-платежей)

    + [Описание сервиса](#описание-сервиса-расчета-таможенных-платежей)
    + [Предлагаемый порядок использования](#предлагаемый-порядок-использования)

        + [Самостоятельная реализация](#самостоятельная-реализация)
        + [Использование готового приложения](#использование-готового-приложения)

+ [Порядок встраивания](#порядок-встраивания-компонентов-приложения-в-страницу)

## Общие положения.

Состоит из нескольких частей.
1. `tnved` - компоненты доступа к функциям API ТН ВЭД. Содержит примеры реализации построения дерева кодов ТН ВЭД, поиска по базе примеров декларирования, получания информации по ставкам/признакам.
2. `contract` - компоненты доступа к функциям API Расчет таможенных платежей. Содержит примеры реализации работы информацией о ставках, обмена информацией с API Расчет таможенных платежей.
3. `common` - общие файлы, используемые в работе других компонент системы.

Представлена реализация с помощью React.
Для сборки приложений можно воспользоваться node.js и нашими скриптами для сборки https://github.com/tkssoft/bat

## Идентификация пользователей API.

Работа с сервисами требует наличия клиентского сертификата.
Предполагается, что сертификат можно получить с использованием лицензионного ключа с помощью сервиса сертификатов.

Дополнительную информацию можно получить, прочитав документацию по работе с сервисом сертификатов - https://github.com/tkssoft/my.tks.ru-docs#сертификаты.

Указать сертификат можно, например, так:

    <script type="text/javascript" src="https://my.tks.ru/products/lic/js/<лицензионный ключ>.js"></script>

## API ТН ВЭД.

API ТН ВЭД предоставляет доступ к информации по кодам ТН ВЭД, мерах тарифного и нетарифного регулирования. Имеется возможность построения дерева кодов с помощью специального сервиса. Пример реализации есть в библиотеке.

+ [Документация по работе с АПИ ТН ВЭД](https://api1.tks.ru/docs/tnved.json/)
+ [Документация по дереву ТН ВЭД](https://api1.tks.ru/docs/tree.json/)
+ [Документация для сервиса подбора кода по наименованию](https://api1.tks.ru/docs/goods.json/)

## Расчет таможенных платежей.

### Описание сервиса расчета таможенных платежей.

* `Адрес:` http://calc.tks.ru/calc/<сертификат_клиента>/
* `Метод:` POST
* `Формат передаваемых данных:` application/json
* `Входные данные:` Это информация в виде перечня данных с определенным названием.
Сейчас используются следующие названия

`kontrakt` - общие сведения по контракту (тип, номер, валюта расчета, дата)
`kontdop` - информация об одном товаре или нескольких товарах.

Например,

    {
        'kontrakt':
            {
                "NUM": 1, // Номер контракта
                "G221": "840", // Валюта расчета
                "G542": "2019-01-01" // Дата расчета
            },
        'kontdop':
            [{
                "NUM": 1, // Номер контракта
                "G32": 1, // Номер товара
                "G33": "2709001001", // Код товара по ТН ВЭД
                "G34": "008", // Код страны происхождения
                "G45": 559288.0, // Таможенная стоимость
                "G45V": "643", // Валюта таможенной стоимости
                "G38": 1000.0, // Вес брутто

                "GEDI1": 1000.0, // Количество товаров в дополнительных единицах измерения
                "GEDI2": null, // Количество товаров в единицах физического объема
                "GEDI3": null, // Мощность

                "IMP": 5.0, // Информация об импортной пошлине
                "IMP2": null,
                "IMP3": null,
                "IMPEDI": "1",
                "IMPEDI2": null,
                "IMPEDI3": null,
                "IMPPREF": null,
                "IMPSIGN": null,
                "IMPSIGN2": null,

                "NDS": 18.0, // Информация о ставке НДС
                "NDSEDI": null, // Преференция по НДС

                "AKC": null, // Информация о ставке акциза
                "AKC2": null,
                "AKC3": null,
                "AKCEDI": null,
                "AKCEDI2": null,
                "AKCEDI3": null,
                "AKCSIGN": null,
                "AKCSIGN2": null,

                "IMPCOMP": null, // Информация о ставке компенсационной пошлины
                "IMPCOMP2": null,
                "IMPCOMPEDI": null,
                "IMPCOMPEDI2": null,
                "IMPCOMPSIGN": null,

                "IMPDEMP": null, // Информация о ставке антидемпинговой пошлины
                "IMPDEMP2": null,
                "IMPDEMPEDI": null,
                "IMPDEMPEDI2": null,
                "IMPDEMPSIGN": null,

                "IMPDOP": null, // Дополнительная пошлина

                "IMPTMP": null, // Временная (специальная пошлина)
                "IMPTMP2": null,
                "IMPTMPEDI": null,
                "IMPTMPEDI2": null,
                "IMPTMPSIGN": null,

                "EXP": 0.0, // Информация о ставке экспортной пошлины
                "EXP2": null,
                "EXP3": null,
                "EXPEDI": "1",
                "EXPEDI2": null,
                "EXPEDI3": null,
                "EXPSIGN": null,
                "EXPSIGN2": null,

            }]
    }

* `Выходные данные:` Результат расчета представляет собой информацию о начислениях в разрезе типа платежа.

Например,

    {
        "totals": {
            "sum": 100, // общая сумма таможенных платежей
            "valname": "ДОЛЛАР США" // Наименование валюты
        },
        "kont47": [
            {
                "G32": 1, // Номер товара
                "G471": "2010", // Код вида платежа
                "G472": 559288.0, // Основа начисления
                "G4721": "643", // Код валюты основы начисления
                "G473": "5%", // Ставка
                "G4730": "2018-01-26", // Дата ставки
                "G4731": "%", // Вид ставки (% - адвалорная, * - специфическая)
                "G474": 27964.4, // Сумма платежа
                "G4740": "2018-01-26", // Дата курса валюты
                "G4741": "643", // Код валюты суммы
                "LETTER": "2", // Вид ставки
                // "" - сборы
                // "2" - пошлина
                // "5" - антидемпинговая пошлина
                // "6" - компенсационная пошлина
                // "7" - акциз
                // "8" - НДС
            },
            {
                "G32": 1,
                "G471": "5010",
                "G472": 587252.4,
                "G4721": "643",
                "G473": "18%",
                "G4730": "2018-01-26",
                "G4731": "%",
                "G474": 105705.43,
                "G4740": "2018-01-26",
                "G4741": "643",
                "LETTER": "8",
            },
            {
                "G32": 1,
                "G471": "1010",
                "G472": 559288.0,
                "G4721": "643",
                "G473": "2000РУБ",
                "G4730": "2018-01-26",
                "G4731": "*",
                "G4732": "643",
                "G474": 2000.0,
                "G4740": "2018-01-26",
                "G4741": "643",
                "LETTER": "",
            }
        ],
        "log": {
            "1": [
                "Сообщение 1",
                "Сообщение 2",
                "Сообщение 3",
            ]
        }
    }

### Предлагаемый порядок использования.

Использовать сервис можно несколькими путями.

#### Самостоятельная реализация.

Самостоятельная реализация запроса данных у пользователя и формирование соотвествующих запросов к сервису расчета таможенных платежей, а также обработка полученных результатов.

* Запросить у пользователя код ТН ВЭД - поле `kontdop[0].G33`
* Запросить код валюты расчетов - поле `kontdop[0].G45V`
* Запросить таможенную стоимость - поле `kontdop[0].G45`
* Сделать запрос к API ТН ВЭД по коду товара.
* Внести соотвествующие поля в структуру товара `kontdop[0]`
* Получить список необходимых единиц измерения.

Пример обработки:

    const get_edizm_list = (data, type=TYPE_IM) => {

        let a;
        if (type === TYPE_EK) {
            a = [
                data.EXPEDI,
                data.EXPEDI2,
                data.EXPEDI3
            ]
        } else {
            a = [
                data.IMPEDI,
                data.IMPEDI2,
                data.IMPEDI3,
                data.AKCEDI,
                data.AKCEDI2,
                data.AKCEDI3,
                data.IMPTMPEDI,
                data.IMPTMPEDI2,
                data.IMPCOMPEDI,
                data.IMPCOMPEDI2,
                data.IMPDEMPEDI,
                data.IMPDEMPEDI2
            ]
        }

        let init = [];

        return a.reduce((r, v) => {
            if (v && (v.length > 1)) {
                let edi = v.slice(0, 3);
                if (r.indexOf(edi) === -1) {
                    r.push(edi)
                }
            }
            return r
        }, init)
    };

* Запросить у пользователя количество и заполнить поля G38, GEDI1, GEDI2, GEDI3

Пример обработки

    doEdizmChange = (e) => {
        switch (e.target.getAttribute('data-edi')) {
            /*если килограммы заполняем G38*/
            case "166":
                data: {
                    G38: parseFloat(e.target.value)
                }
                break;
            /*если тонны, переводим в кг и заполняем G38*/
            case "168":
                data: {
                    G38: parseFloat(e.target.value) * 1000
                }
                break;
            /*Единица измерения совпадает с дополнительной*/
            case this.state.tnved.TNVED.EDI2:
                data: {
                    GEDI1: parseFloat(e.target.value)
                }
                break;
            /*Мощность (251 - Л.С. или 214 - кВт)*/
            case nsi.POWER_CODES[0]:
            case nsi.POWER_CODES[1]:
                data: {
                    GEDI3: parseFloat(e.target.value)
                }
                break;
            default:
                data: {
                    GEDI2: parseFloat(e.target.value)
                }
        }
    };

* Отправить запрос на расчет. https://calc.tks.ru/calc/<сертификат_клиента>/
* Получить результаты расчетов.

#### Использование готового приложения

Библиотека содержит реализацию приложения с расчетом ставок по одному коду ТН ВЭД (contract/simple)

## Порядок встраивания компонентов приложения в страницу

Для встраивания приложения расчета контракта в свою страницу необходимо:

* Добавить на страницу ссылку на лицензию.

Например,

    <script type="text/javascript" src="https://my.tks.ru/products/lic/js/<лицензионный ключ>.js"></script>


* Добавить файлы стилей для оформления дерева ТН ВЭД, окна поиска и пр.

Например,

    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" type="text/css" />
    <link rel="stylesheet" href="/styles/tnvtree.css" type="text/css" />
    <link rel="stylesheet" href="/styles/goods.css" type="text/css" />
    <link rel="stylesheet" href="/styles/modal.css" type="text/css" />

* Добавить на страницу div-элемент с идентификатором #ccs-contract (идентификатор задается в вызове `ReactDOM.render`)

* Сформировать скрипт для генерации html элементов. `contract_main.min.js`.

* Добавить ссылку на сформированный скрипт на страницу

Например,

    <script type="text/javascript" src="/contract/contract_main.min.js"></script>

Готовый шаблон для встраивания можно посмотреть на сайте https://calc.tks.ru
