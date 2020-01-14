const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();

app.use(serve('src/static'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
