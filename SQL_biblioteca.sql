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

CREATE TABLE Emprestimo (
	ID_Emprestimo INT IDENTITY PRIMARY KEY,
	ID_Usuario INT REFERENCES Usuarios(ID_Usuario),
	ID_Livro INT REFERENCES Livros(ID_Livro),
	DataEmprestimo DATE,
	DataDevolucao DATE,
	[Status] VARCHAR(50)
)
GO


USE Biblioteca;
GO

INSERT INTO Livros (Titulo, Autor, Editora, Edicao, Volume, Quantidade, AnoPublicacao) VALUES
('Introdução à Programação', 'Alice Souza', 'TechBooks', '1ª', 1, 5, 2022),
('Estruturas de Dados', 'Carlos Silva', 'EducaBook', '2ª', 1, 3, 2021),
('Banco de Dados SQL', 'Maria Costa', 'Informatics', '3ª', 1, 4, 2020),
('Algoritmos Avançados', 'Roberto Lima', 'TechPrint', '1ª', 1, 2, 2023),
('JavaScript Essencial', 'Ana Melo', 'DevBooks', '2ª', 1, 6, 2019);

CREATE LOGIN appUser4 
WITH PASSWORD = '12345';
GO

CREATE USER appUser4
FOR LOGIN appUser4;
GO

ALTER ROLE db_owner ADD MEMBER appUser4;
GO

SELECT *
FROM Emprestimo

SELECT *
FROM Usuarios

SELECT *
FROM Livros

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

--DROP VIEW vw_Emprestimo_Completo

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
