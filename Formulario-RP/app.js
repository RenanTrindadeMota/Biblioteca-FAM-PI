const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos da pasta 'public'

// Configuração de conexão com o SQL Server
const config = {
    user: 'appUser4',
    password: '12345',
    server: 'localhost',
    database: 'Biblioteca',
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,  
        enableArithAbort: true,   
        trustServerCertificate: true
    }
};

// Função para gerenciar a conexão com o banco
let pool;

async function connectToDatabase() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log('Conectado ao SQL Server');
        } catch (error) {
            console.error('Erro de conexão com o banco:', error);
            throw error;
        }
    }
    return pool;
}


// Rota para registrar a frequência
app.post('/registrar-frequencia', async (req, res) => {
    const { nomeCompleto, identUser } = req.body;

    try {
        await connectToDatabase();

        // Insere dados na tabela `frequencia`
        await sql.query`INSERT INTO frequencia (NomeCompleto, Ident_User) VALUES (${nomeCompleto}, ${identUser})`;
        res.json({ message: 'Frequência registrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar frequência:', error);
        res.status(500).json({ message: 'Erro ao registrar a frequência' });
    }
});

// Rota para buscar os dados da tabela `frequencia`
app.get('/api/frequencia', async (req, res) => {
    try {
        const { startDate, endDate, date } = req.query;

        // Filtrar por data, se necessário
        let query = `
            SELECT 
                ID_User, 
                NomeCompleto, 
                Ident_User, 
                DataHoraMomento
            FROM frequencia
        `;
        const params = [];

        if (date) {
            query += " WHERE CONVERT(DATE, DataHoraMomento) = CONVERT(DATE, @date)";
            params.push({ name: "date", type: sql.Date, value: date });
        } else if (startDate && endDate) {
            query += " WHERE DataHoraMomento BETWEEN @startDate AND @endDate";
            params.push(
                { name: "startDate", type: sql.DateTime, value: startDate },
                { name: "endDate", type: sql.DateTime, value: endDate }
            );
        }

        const result = await sql.query(query, params);
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao listar registros de frequência:', err);
        res.status(500).json({ error: 'Erro ao listar registros de frequência' });
    }
});


// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
