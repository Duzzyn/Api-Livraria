import mongoose from "mongoose";

mongoose.Schema.Types.String.set("validate", { // todos os schemas que estiverem uma string vazia, vai estourar um erro indicando que 
  // o campo está vazio
  validator: (valor) => valor.trim() !== "", // (trim) faz com que tire os espaços em branco, como por exemplo: " "
  // !== se for diferente, irá retornar verdadeiro, o operador !== valida se os valores são diferentes e do mesmo tipo
  message: ({ path }) => `O campo ${path} foi fornecido em branco.`
}); // define uma propriedade para todos os campos que tem o tipo STRING nos modelos