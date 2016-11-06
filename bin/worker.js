var express = require('express');
var session = require('express-session'); // Сессии
var MongoStore = require('connect-mongo')(session); // Хранилище сессий в монгодб

require('./dbinit'); // Инициализация датабазы
// Загрузим express
var app = express();
// Создадим новый сервер

app.use(require('cookie-parser')());

// Теперь сессия
// поставить хендлер для сессий
app.use(session({
    secret: 'Химера Хирера',
    // Замените на что нибудь
    resave: false,
    // Пересохранять даже если нету изменений
    saveUninitialized: true,
    // Сохранять пустые сессии
    store: new MongoStore({ mongooseConnection: require('mongoose').connection })
    // Использовать монго хранилище
}));

var cons = require('consolidate');
// Используем движок усов
app.engine('html', cons.mustache);
// установить движок рендеринга
app.set('view engine', 'html');
// папка с образами
app.set('views', __dirname + '/../views');

app.get('/',function(req,res,next){
    //Создадим новый handler который сидит по пути `/`
    res.render('index',{title:"Hello, world!"});
    // Отправим рендер образа под именем index
});

// Обработчик ошибок
app.use(require('./errorHandler'));

// Запустим сервер на порту 3000 и сообщим об этом в консоли.
// Все Worker-ы  должны иметь один и тот же порт
app.listen(3000,function(err){
    if(err) console.error(err);
    // Если есть ошибка сообщить об этом
    // Приложение закроется т.к. нет больше handler-ов
    else console.log('Running server at port 3000!') 
    // Иначе сообщить что мы успешно соединились с мастером
    // И ждем сообщений от клиентов
});