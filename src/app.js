import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js";
import manipulador404 from "./middlewares/manipulador404.js";

db.on("error", console.log.bind(console, "Erro de conexão"));
db.once("open", () => {
  console.log("conexão com o banco feita com sucesso");
});

const app = express();
app.use(express.json());
routes(app);

app.use(manipulador404); // o express salva cada rota e ao executar, ele lê rota por rota, caso não exista alguma rota, ele passará essa função
// para um middleware, e ai esse middleware em especifico trata o erro da pagina nao encontrada

app.use(manipuladorDeErros);

export default app;