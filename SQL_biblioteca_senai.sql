CREATE DATABASE Biblioteca_Senai
GO

CREATE TABLE frequencia (
	ID_User INT,
	NomeCompleto VARCHAR(120),
	Ident_User VARCHAR(100)
)
GO

ALTER TABLE frequencia
ADD ID_User INT IDENTITY PRIMARY KEY;


DELETE FROM frequencia
WHERE ID_User = 1;

ALTER TABLE frequencia
ADD DataHoraMomento DATETIME DEFAULT GETDATE();



SELECT *
FROM frequencia