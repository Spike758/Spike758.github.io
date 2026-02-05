const path = require("path");
const browserSync = require("browser-sync");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const { spawn } = require("child_process");

const publicPath = path.join(__dirname, "public");
const srcPath = path.join(__dirname, "src");

// Создаем экземпляр BrowserSync
const bs = browserSync.create();

// Компилируем исходный код с помощью Webpack
const compiler = webpack(webpackConfig);

// Используем webpack-dev-middleware для обслуживания скомпилированных ресурсов
const devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
});

// Используем webpack-hot-middleware для горячей перезагрузки модулей
const hotMiddleware = require("webpack-hot-middleware")(compiler);

// Компилируем SASS при каждом сохранении
const sassWatcher = spawn('npm.cmd', ['run', 'style']);

sassWatcher.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

sassWatcher.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

sassWatcher.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// Запускаем сервер, проксируя запросы к стилям в директории src
bs.init({
  server: {
    baseDir: publicPath,
    middleware: [devMiddleware, hotMiddleware],
  },
  files: [path.join(publicPath, "**/*"), path.join(srcPath, "**/*")],
  port: 8000, // Выберите порт, на котором будет работать сервер
  open: false, // Отключаем автоматическое открытие браузера
  notify: false, // Отключаем уведомления в браузере
});

console.log(`Server is running`);
