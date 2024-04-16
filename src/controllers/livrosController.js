import NaoEncontrado from "../erros/NaoEncontrado.js";
import { livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find()
        .populate("autor")
        .exec();

      res.status(200).json(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultados !== null) {
        res.status(200).send(livroResultados);
      } else {
        next(new NaoEncontrado("Id do livro não encontrado"));
      }

    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, {$set: req.body});

      if(livroResultado !== null) {
        res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não encontrado"));
      }

    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);

      if(livroResultado !== null) {
        res.status(200).send({message: "Livro removido com sucesso"});
      } else {
        next(new NaoEncontrado("Id do Livro não encontrado"));
      }

    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = processaBusca(req.query);

      const livrosResultado = await livros.find(busca);

      res.status(200).send(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  };

}

function processaBusca(parametros) {
  const { editora, titulo, minPaginas, maxPaginas } = parametros; // forma simplificada e elegante de extrair valores de um objeto e atribuí-los a variaveis separadas.
  // é o mesmo que: const editora = req.query.editora; const titulo = req.query.titulo; mas essa desestruturação é uma forma mais organizada de se fazer isso.

  const busca = {};

  if (editora) busca.editora = editora;
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" }; // aplica o regex na busca, se o valor do parametro for maiusculo ou minusculo, irá retornar mesmo assim

  if (minPaginas || maxPaginas) busca.numeroPaginas = {}; // se um dos parametros foi informado na busca, o filtro será aplicado

  if(minPaginas) busca.numeroPaginas.$gte = minPaginas; // filtro: busca por um valor maior que o minPaginas
  if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas; // filtro: busca por um valor menor que o maxPaginas

  return busca;
}

export default LivroController;