CREATE DATABASE Biblioteca
GO

USE Biblioteca
GO

CREATE TABLE Usuarios (
	ID_Usuario INT IDENTITY PRIMARY KEY,
	NomeUsuario VARCHAR(100),
	Turma VARCHAR(100),
	Telefone VARCHAR(11),
	Periodo VARCHAR(20)
)
GO

CREATE TABLE Livros (
	ID_Livro INT IDENTITY PRIMARY KEY,
	Titulo VARCHAR(100),
	Autor VARCHAR(100),
	Editora VARCHAR(100),
	Edicao VARCHAR(100),
	Volume INT,
	Quantidade INT,
	AnoPublicacao INT
)

ALTER TABLE Livros
ADD Imagem NVARCHAR(400)

UPDATE Livros
SET Imagem = 'https://marketplace.canva.com/EAE4oJOnMh0/1/0/1003w/canva-capa-de-livro-de-suspense-O7z4yw4a5k8.jpg'
WHERE ID_Livro = 1;

EXEC sp_rename 'Livros.AnoPublicação', 'AnoPublicacao', 'COLUMN';

CREATE TABLE Emprestimo (
	ID_Emprestimo INT IDENTITY PRIMARY KEY,
	ID_Usuario INT REFERENCES Usuarios(ID_Usuario),
	ID_Livro INT REFERENCES Livros(ID_Livro),
	DataEmprestimo DATE,
	DataDevolucao DATE,
	[Status] VARCHAR(50)
)
GO

ALTER TABLE Emprestimo
ADD [Status] VARCHAR(50)

USE Biblioteca;
GO

CREATE TABLE frequencia (
	ID_User INT IDENTITY PRIMARY KEY,
	NomeCompleto VARCHAR(120),
	Ident_User VARCHAR(100)
)
GO

DELETE FROM frequencia
WHERE ID_User = 1;

ALTER TABLE frequencia
ADD DataHoraMomento DATETIME DEFAULT GETDATE();

SELECT *
FROM frequencia


INSERT INTO Livros (Titulo, Autor, Editora, Edicao, Volume, Quantidade, AnoPublicacao) VALUES
('Introdução à Programação', 'Alice Souza', 'TechBooks', '1ª', 1, 5, 2022),
('Estruturas de Dados', 'Carlos Silva', 'EducaBook', '2ª', 1, 3, 2021),
('Banco de Dados SQL', 'Maria Costa', 'Informatics', '3ª', 1, 4, 2020),
('Algoritmos Avançados', 'Roberto Lima', 'TechPrint', '1ª', 1, 2, 2023),
('JavaScript Essencial', 'Ana Melo', 'DevBooks', '2ª', 1, 6, 2019);

CREATE LOGIN appUser1 
WITH PASSWORD = '12345';
GO

CREATE USER appUser1
FOR LOGIN appUser1;
GO

ALTER ROLE db_owner ADD MEMBER appUser1;
GO

SELECT *
FROM Emprestimo

SELECT *
FROM Usuarios

SELECT *
FROM Livros

DELETE FROM Livros
WHERE ID_Livro IN (29);

 

CREATE VIEW vw_Emprestimo_Completo AS
SELECT
	Usuarios.ID_Usuario,
	NomeUsuario, 
	Turma,
	Periodo,
	Telefone,
	Livros.ID_Livro,
	Titulo,
	Autor,
	Editora,
	Edicao,
	Volume,
	AnoPublicacao,
	Emprestimo.ID_Emprestimo,
	DataEmprestimo,
	DataDevolucao,
	Status
FROM Usuarios

INNER JOIN 
	Emprestimo
ON Usuarios.ID_Usuario = Emprestimo.ID_Usuario

INNER JOIN
	Livros
ON Emprestimo.ID_Livro = Livros.ID_Livro

SELECT *
FROM vw_Emprestimo_Completo

DROP VIEW vw_Emprestimo_Completo

CREATE PROCEDURE AtualizarStatusEmprestimos
AS
BEGIN
    -- Atualiza para "Atrasado" se a data de devolução for passada e o status ainda estiver "Em Aberto"
    UPDATE Emprestimo
    SET [Status] = 'Atrasado'
    WHERE DataDevolucao < GETDATE() AND [Status] = 'Em Aberto';

    -- Atualiza para "Perda" se o empréstimo já está atrasado por mais de 30 dias
    UPDATE Emprestimo
    SET [Status] = 'Perda'
    WHERE DataDevolucao < DATEADD(DAY, -30, GETDATE()) AND [Status] = 'Atrasado';
END;
GO

EXEC AtualizarStatusEmprestimos;

SELECT name 
FROM sys.procedures
WHERE name = 'AtualizarStatusEmprestimos';


-- Trigger para reduzir a quantidade ao registrar um empréstimo
CREATE TRIGGER AtualizarQuantidadeAoEmprestar
ON Emprestimo
AFTER INSERT
AS
BEGIN
    -- Atualizar a quantidade de livros após um novo empréstimo ser registrado
    UPDATE Livros
    SET Quantidade = Quantidade - 1
    FROM Livros
    INNER JOIN Inserted ON Livros.ID_Livro = Inserted.ID_Livro
    WHERE Livros.Quantidade > 0; -- Garantir que não fique negativo

    -- Lidar com o caso de estoque insuficiente
    IF EXISTS (
        SELECT 1
        FROM Livros
        INNER JOIN Inserted ON Livros.ID_Livro = Inserted.ID_Livro
        WHERE Livros.Quantidade <= 0
    )
    BEGIN
        PRINT 'Aviso: Estoque de algum livro está esgotado!';
    END
END;
GO


-- Trigger para aumentar a quantidade ao registrar uma devolução
CREATE TRIGGER AtualizarQuantidadeAoDevolver
ON Emprestimo
AFTER UPDATE
AS
BEGIN
    -- Atualizar a quantidade de livros quando o status muda para "Devolvido"
    UPDATE Livros
    SET Quantidade = Quantidade + 1
    FROM Livros
    INNER JOIN Inserted ON Livros.ID_Livro = Inserted.ID_Livro
    INNER JOIN Deleted ON Inserted.ID_Emprestimo = Deleted.ID_Emprestimo
    WHERE Inserted.Status = 'Devolvido' 
      AND Deleted.Status != 'Devolvido';
END;
GO

-- o Inserted é usado dentro de triggers para armazenar os dados que foram inseridos, atualizados ou excluídos em uma operação.
-- o Inserted contém os registros novos que estão sendo adicionados ou atualizados na tabela-alvo.
-- Na trigger AtualizarQuantidadeAoEmprestar, estamos reagindo a uma inserção na tabela Emprestimo. A tabela lógica Inserted 
-- contém os dados dessa nova linha que está sendo inserida.

-- Explicação desse if:
    --IF EXISTS (
    --    SELECT 1
    --    FROM Livros
    --    INNER JOIN Inserted ON Livros.ID_Livro = Inserted.ID_Livro
    --    WHERE Livros.Quantidade <= 0
    --)
    --BEGIN
    --    PRINT 'Aviso: Estoque de algum livro está esgotado!';
    --END
--Quando tentamos registrar um empréstimo:
-- O IF EXISTS consulta os livros envolvidos no empréstimo (através do JOIN com Inserted).
-- O 'SELECT 1' não retorna dados específicos; ele apenas verifica a existência de uma linha que satisfaça as condições dadas no WHERE.
-- Esse SELECT 1 é eficiente porque o banco de dados para de processar assim que encontra a primeira ocorrência.
-- Esse IF verifica se algum deles tem a Quantidade menor ou igual a zero.
-- Se a condição for verdadeira (ou seja, o estoque está esgotado):
-- O trigger impede a operação (dependendo da lógica definida) ou envia uma mensagem informando que o livro está esgotado.


ALTER TABLE Emprestimo ADD Processado BIT DEFAULT 0;
-- Criando a coluna Processado para registrar as quantidades de emprestimos que não foram considerados.
-- o DEFAULT 0 serve para inserir o número 0 por padrão até que seja inserido outro dado.


-- Para corrigir a quantidade sem duplicações ou inconistências, fazemos os seguintes passos: 
-- Passo 1:
UPDATE Emprestimo
SET Processado = 0
-- Esse update acima coloca valor 0 em todas as linhas existentes da coluna processado

-- Passo 2:
UPDATE Livros
SET Quantidade = CASE
    WHEN Titulo = 'Introdução à Programação' THEN 5
    WHEN Titulo = 'Estruturas de Dados' THEN 3
    WHEN Titulo = 'Banco de Dados SQL' THEN 4
    WHEN Titulo = 'Algoritmos Avançados' THEN 2
    WHEN Titulo = 'JavaScript Essencial' THEN 6
    ELSE Quantidade
END
WHERE Titulo IN ('Introdução à Programação', 'Estruturas de Dados', 'Banco de Dados SQL', 'Algoritmos Avançados', 'JavaScript Essencial');
-- Esse update acima reinicia a quantidade para o seu valor inicial, assim, testamos a procedure pra ver se ela corrigiu os valores.

--UPDATE Emprestimo
--SET Processado = 0
--WHERE ID_Livro = 4 AND Status IN ('Em Aberto', 'Atrasado', 'Perda');
-- Esse update acima só zerava a coluna Processado do ID_Livro = 4, pois era a linha que estava dando mais erro.

--ALTER TABLE Livros
--DROP CONSTRAINT CK_Quantidade_Positive;
-- Guardando código para apagar restrição caso seja necessário

ALTER TABLE Livros
ADD CONSTRAINT CK_Quantidade_Positive
CHECK (Quantidade >= 0);
-- Código para criação da restrição que impede valores negativos na coluna Quantidade da tabela Livros.

-- Passo 3:
-- Procedure para corrigir a coluna Quantidade baseada nos emprestimos já existentes:
ALTER PROCEDURE AjustarQuantidadeLivros
AS
BEGIN
    SET NOCOUNT ON;

    -- Atualiza a quantidade de livros para cada livro na tabela Livros
    DECLARE @ID_Livro INT, @Quantidade INT;

    -- Para cada livro, ajustamos a quantidade de acordo com os empréstimos e devoluções
    DECLARE livro_cursor CURSOR FOR
    SELECT ID_Livro
    FROM Livros;

    OPEN livro_cursor;
    FETCH NEXT FROM livro_cursor INTO @ID_Livro;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Inicializa a quantidade do livro
        SET @Quantidade = (SELECT Quantidade FROM Livros WHERE ID_Livro = @ID_Livro);

        -- Subtrai 1 para cada empréstimo em aberto, atrasado ou em perda
        SET @Quantidade = @Quantidade - (
            SELECT COUNT(*) 
            FROM Emprestimo
            WHERE ID_Livro = @ID_Livro
            AND Status IN ('Em Aberto', 'Atrasado', 'Perda')
            AND Processado = 0
        );

        -- Atualiza a quantidade no estoque, sem ultrapassar a quantidade inicial
        IF @Quantidade < 0
        BEGIN
            SET @Quantidade = 0; -- Não pode ter quantidade negativa
        END

        UPDATE Livros
        SET Quantidade = @Quantidade
        WHERE ID_Livro = @ID_Livro;

        -- Marca os empréstimos como processados para não fazer a mesma atualização de novo
        UPDATE Emprestimo
        SET Processado = 1
        WHERE ID_Livro = @ID_Livro
        AND Processado = 0;

        FETCH NEXT FROM livro_cursor INTO @ID_Livro;
    END

    CLOSE livro_cursor;
    DEALLOCATE livro_cursor;
END;
GO


-- Passo 4: Final
EXEC AjustarQuantidadeLivros;
-- Depois é só verificar se os valores das quantidades fazem sentido em relação ao Status.

SELECT *
FROM Emprestimo

SELECT *
FROM Livros

SELECT *
FROM Usuarios

SELECT Quantidade
FROM Livros
WHERE ID_Livro = 4;

--DELETE FROM Emprestimo
--WHERE ID_Emprestimo = 10;



