const express = require('express');
// express: Framework para construir aplicações web em Node.js, usado aqui para criar o servidor.

const sql = require('mssql');
// mssql: Biblioteca para se conectar e interagir com o banco de dados SQL Server.

const cron = require('node-cron');
// código para instalar node-cron, que torna funções automáticas: npm install node-cron
// o cron é um job, serve para automatizar, como em casos que uma tabela precise ser atualizada as 2h da manhã.


const bodyParser = require('body-parser');
// body-parser: Middleware para interpretar o corpo das requisições HTTP em formatos como JSON. Isso facilita acessar os dados 
// enviados pelos clientes.

// um middleware é uma função que intercepta, processa ou modifica as requisições (requests) ou respostas (responses) em um fluxo
// antes que cheguem ao destino final (rota, controlador, etc.).

// O body-parser é um middleware que:
// Intercepta as requisições antes que elas cheguem às rotas finais.
// Analisa o corpo da requisição (request body) para convertê-lo em um formato que pode ser facilmente manipulado no código.
// Adiciona os dados analisados na propriedade req.body.
// Exemplo:
// JSON: 
// {
//     "nome": "João",
//     "idade": 25
//   }
// JAVASCRIPT:
// req.body = { nome: "João", idade: 25 };

  

const app = express();
// Cria a aplicação Express.

app.use(bodyParser.json());
// Configura o middleware para processar requisições com corpos no formato JSON.

app.use(express.static('public'));
// Permite que arquivos estáticos (HTML, CSS, JS, imagens) da pasta public sejam acessados diretamente pelo navegador.

// Configuração de conexão com o banco de dados
const dbConfig = {
    user: 'appUser1',        // Substitua com seu usuário do SQL Server
    password: '12345',      // Substitua com sua senha do SQL Server
    server: 'localhost',        // Ou o nome do seu servidor SQL
    database: 'Biblioteca',
    options: {
        encrypt: true,          // Define se a conexão será criptografada (necessário para Azure).
        enableArithAbort: true,   // Controla como erros aritméticos são tratados.
        trustServerCertificate: true // Ignora a validação do certificado SSL,  Aceita conexões mesmo com certificado 
                                    // autoassinado (resolve problemas de conexão SSL).
    }
};


// Função para conectar ao banco de dados:
let pool; // Variável global para armazenar a conexão

async function connectToDatabase() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('Conectado ao banco de dados');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

// Chama a função para conectar ao banco
connectToDatabase();

// sql.connect(dbConfig): Tenta estabelecer a conexão com o banco de dados.
// try/catch: Captura erros, caso a conexão falhe.
// connectToDatabase(): É chamada assim que o arquivo é executado.


// As rotas configuram como o servidor responde a diferentes requisições HTTP. Aqui, usamos o método POST para enviar dados ao servidor.

// Essa rota é responsável por:
// Receber os dados enviados via POST.
// Consultar o banco de dados para verificar se o usuário já existe.
// Retornar o ID do usuário (se existir) ou null (se não existir).
app.post('/verificarUsuario', async (req, res) => {
    const { nomeUsuario, turma, telefone, periodo } = req.body;

    try {
        const result = await sql.query`SELECT ID_Usuario FROM Usuarios WHERE NomeUsuario = ${nomeUsuario}`;
        if (result.recordset.length > 0) {
            res.json({ usuarioId: result.recordset[0].ID_Usuario });
        } else {
            res.json({ usuarioId: null });
        }
    } catch (err) {
        console.error('Erro ao verificar usuário:', err);
        res.status(500).send('Erro ao verificar usuário');
        // 500 (Código de status HTTP):
        // O código HTTP 500 significa "Internal Server Error" (Erro Interno no Servidor).
        // Indica que algo deu errado no lado do servidor.
        // Usamos o método res.status(500).send() para:
        // Informar ao cliente que ocorreu um erro no servidor.
        // Enviar uma mensagem de erro descritiva.
    }
});
// req e res: Essas duas variáveis representam os objetos de requisição e resposta no Express.js.

// req (Request):
// Contém todas as informações enviadas pelo cliente (navegador, aplicação, etc.).
// Exemplos:
// Cabeçalhos da requisição.
// Dados no corpo da requisição (req.body), enviados em formatos como JSON ou formulário.
// Query strings (parâmetros na URL).

// res (Response):
// É usado para enviar a resposta do servidor ao cliente.
// Métodos comuns incluem:
// res.json(): Envia uma resposta em formato JSON.
// res.status(): Define o código HTTP da resposta (como 200 OK ou 500 Internal Server Error).
// res.send(): Envia uma resposta simples, como texto.

// A palavra-chave async indica que a função é assíncrona e pode conter operações que não são imediatas (como consultas a banco
//  de dados ou chamadas de API).
// Combinado com await, ele permite que o código assíncrono seja escrito de maneira que pareça síncrono:
// O código "espera" a conclusão de operações demoradas (como sql.query) antes de continuar.

// Lógica de result.recordset.length > 0:
// result:
// É o objeto retornado pelo método sql.query após executar a consulta SQL.
// No SQL Server, a consulta retorna um conjunto de resultados que fica armazenado na propriedade recordset.
// recordset.length > 0:
// Verifica se a consulta retornou alguma linha.

// Lógica de usuarioId: result.recordset[0].ID_Usuario
// result.recordset[0]: Acessa a primeira linha (registro) retornada pela consulta SQL.
// ID_Usuario: É o campo específico na linha que contém o ID do usuário encontrado.
// Lógica:
// Retornamos o ID_Usuario encontrado no banco como parte da resposta JSON.
// Isso permite ao cliente saber qual é o ID associado ao nomeUsuario enviado.



// Rota para registrar novo usuário
app.post('/registrarUsuario', async (req, res) => {
    const { nomeUsuario, turma, telefone, periodo } = req.body;

    try {
        const result = await sql.query`
            INSERT INTO Usuarios (NomeUsuario, Turma, Telefone, Periodo)
            OUTPUT INSERTED.ID_Usuario
            VALUES (${nomeUsuario}, ${turma}, ${telefone}, ${periodo})
        `;
        res.json({ usuarioId: result.recordset[0].ID_Usuario });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).send('Erro ao registrar usuário');
    }
});

// Rota para registrar o empréstimo
app.post('/registrarEmprestimo', async (req, res) => {
    const { usuarioId, livroId, dataEmprestimo, dataDevolucao, status } = req.body;

    try {
        // Consultar a quantidade do livro usando o livroId recebido
        const result = await sql.query`
            SELECT Quantidade
            FROM Livros
            WHERE ID_Livro = ${livroId};
        `;
        
        const quantidadeDisponivel = result.recordset[0].Quantidade;

        // Se a quantidade for 0, impedir o empréstimo
        if (quantidadeDisponivel === 0) {
            console.log('Livro esgotado no estoque');
            return res.status(400).send('Empréstimo não permitido: livro esgotado no estoque.');
        }

        // Registrar o empréstimo
        await sql.query`
            INSERT INTO Emprestimo (ID_Usuario, ID_Livro, DataEmprestimo, DataDevolucao, Status)
            VALUES (${usuarioId}, ${livroId}, ${dataEmprestimo}, ${dataDevolucao}, ${status});
        `;

        res.send('Empréstimo registrado com sucesso');

        // Chamar a procedure para atualizar o status
        await pool.request().execute('AtualizarStatusEmprestimos');
        console.log("Procedure AtualizarStatusEmprestimos executada.");

    } catch (err) {
        console.error('Erro ao registrar empréstimo:', err);
        res.status(500).send('Erro ao registrar empréstimo');
    }
});


// Rota para registrar devolução
app.post('/registrarDevolucao', async (req, res) => {
    try {
        const { idEmprestimo } = req.body;

        if (!idEmprestimo) {
            return res.status(400).json({ success: false, message: "ID do empréstimo é obrigatório." });
        }

        // Atualize o nome da coluna para "ID_Emprestimo"
        await pool.request()
            .input('ID_Emprestimo', sql.Int, idEmprestimo)
            .query('UPDATE Emprestimo SET Status = \'Devolvido\' WHERE ID_Emprestimo = @ID_Emprestimo');

        res.status(200).json({ success: true, message: "Devolução registrada com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar devolução:", error);
        res.status(500).json({ success: false, message: "Erro ao registrar devolução." });
    }
});



// Rota para criar tabela emprestimo
app.get('/listarEmprestimos', async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT 
                E.ID_Emprestimo AS ID_Emprestimo, 
                U.NomeUsuario AS NomeUsuario, 
                L.Titulo AS Titulo, 
                E.DataEmprestimo, 
                E.DataDevolucao, 
                E.Status
            FROM Emprestimo E
            JOIN Usuarios U ON E.ID_Usuario = U.ID_Usuario
            JOIN Livros L ON E.ID_Livro = L.ID_Livro
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao listar empréstimos:', err);
        res.status(500).json({ error: 'Erro ao listar empréstimos' });
    }
});


// Agendar execução da procedure diariamente às 00:00
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Executando AtualizarStatusEmprestimos...');
        await pool.request().execute('AtualizarStatusEmprestimos');
        console.log('Procedure AtualizarStatusEmprestimos executada com sucesso.');
    } catch (err) {
        console.error('Erro ao executar AtualizarStatusEmprestimos:', err);
    }
});


// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

