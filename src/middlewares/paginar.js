import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

async function paginar (req, res, next) {
  try {
    let { limite = 5, pagina = 1 , ordenacao = "_id:-1" } = req.query;
    
    let [campoOrdenacao, ordem] = ordenacao.split(":"); // na url os parametros fica: ?ordenacao=campoOrdenacao:ordem
    
    limite = parseInt(limite);
    pagina = parseInt(pagina);
    ordem = parseInt(ordem);
    
    const resultado = req.resultado;

    if(limite > 0 && pagina > 0) {
      const resultadoPaginado = await resultado.find()
        .sort({ [campoOrdenacao]: ordem }) // ordena os livros mostrados em livro 1, 2...
        .skip((pagina - 1) * limite) // pra cada página, pula a quantidade de limite de livros, ou seja pag 2 pula 5 livros da pag 1
        .limit(limite) // define o limite de livros por página
        .exec();
          
      res.status(200).json(resultadoPaginado);
    } else {
      next(new RequisicaoIncorreta());
    }
  } catch (erro) {
    next(erro);
  }
}

export default paginar;