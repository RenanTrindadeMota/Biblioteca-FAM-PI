USE Biblioteca

CREATE TABLE Assuntos (
    AssuntoID INT IDENTITY(1,1) PRIMARY KEY,
    Assunto_Nome NVARCHAR(255) NOT NULL
);
GO

--Criação da Tabela de relação entre livros e assuntos
CREATE TABLE LivroAssunto (
    ID_Livro INT NOT NULL,
    AssuntoID INT NOT NULL,
    PRIMARY KEY (ID_Livro, AssuntoID),
    FOREIGN KEY (ID_Livro) REFERENCES Livros(ID_Livro) ON DELETE CASCADE,
    FOREIGN KEY (AssuntoID) REFERENCES Assuntos(AssuntoID) ON DELETE CASCADE
);
GO

SELECT *
FROM Assuntos

--Inserção de Dados

-- Inserção dos Assuntos
INSERT INTO Assuntos (Assunto_Nome)
VALUES 

-- Educativo
('Matemática'),
('Português'),
('Ciências'),
('História'),
('Geografia'),
('Filosofia'),
('Educação Física'),
('Arte'),
('Tecnologia'),

-- Ficção
('Fantasia'),
('Ficção científica'),
('Suspense'),
('Terror'),
('Romance'),
('Distopia'),
('Viagem no tempo'),
('Super-heróis'),
('Mistério policial'),

-- Biografias
('Líderes políticos'),
('Artistas e músicos'),
('Cientistas e inventores'),
('Atletas'),
('Filantropos'),
('Escritores e poetas'),

-- Autoajuda
('Desenvolvimento pessoal'),
('Carreira e negócios'),
('Relacionamentos'),
('Saúde mental'),
('Espiritualidade'),
('Motivação'),

-- História
('História antiga'),
('Idade Média'),
('História moderna'),
('História contemporânea'),
('Guerras mundiais'),
('História cultural'),

-- Científico
('Física'),
('Biologia'),
('Química'),
('Astronomia'),
('Tecnologia e inovação'),
('Meio ambiente'),

-- Infantil
('Contos de fadas'),
('Histórias com animais'),
('Aventuras mágicas'),
('Histórias educativas'),
('Histórias para dormir'),
('Histórias em quadrinhos'),

-- Fantasia
('Alta fantasia'),
('Fantasia urbana'),
('Fantasia sombria'),
('Fantasia histórica'),
('Fantasia juvenil'),
('Fantasia mitológica'),

-- Romance
('Romance histórico'),
('Romance contemporâneo'),
('Romance de época'),
('Romance sobrenatural'),
('Romance LGBTQIA+'),
('Romance adolescente'),

-- Suspense
('Thriller psicológico'),
('Suspense policial'),
('Suspense jurídico'),
('Suspense tecnológico'),
('Suspense de espionagem'),
('Suspense médico'),

-- Terror
('Terror psicológico'),
('Horror cósmico'),
('Terror sobrenatural'),
('Terror gore'),
('Terror de sobrevivência'),
('Terror de lendas urbanas'),

-- Aventura
('Aventuras marítimas'),
('Aventuras arqueológicas'),
('Sobrevivência na natureza'),
('Exploração espacial'),
('Aventuras urbanas'),
('Aventuras em reinos desconhecidos'),

-- História Alternativa
('E se históricos'),
('Ficção de realidades paralelas'),
('Eventos divergentes'),
('História com tecnologia moderna'),
('História com magia integrada'),

-- Juvenil (YA)
('Coming of age'),
('Aventura escolar'),
('Ficção de superação'),
('Romance adolescente'),
('Fantasia juvenil'),
('Mistério e investigação juvenil'),

-- Humor
('Comédia absurda'),
('Paródias'),
('Comédia romântica'),
('Comédia do cotidiano'),
('Humor negro'),
('Humor satírico'),

-- Esportes
('Histórias de superação'),
('Bastidores de eventos esportivos'),
('Biografias de atletas'),
('A evolução de esportes'),
('Esportes radicais'),
('Ficção esportiva'),

-- Tecnologia
('Programação para iniciantes'),
('Inteligência artificial'),
('Blockchain'),
('História da tecnologia'),
('Ética na tecnologia'),
('Futuro da inovação'),

-- Criminal
('True crime'),
('Ficção de detetive'),
('Histórias de mafiosos'),
('Mistérios não resolvidos'),
('Casos famosos'),
('Crimes cibernéticos');
GO

INSERT INTO Assuntos (Assunto_Nome)
VALUES

('Economia'),
('Educação Financeira'),
('Finanças'),
('Sustentabilidade')