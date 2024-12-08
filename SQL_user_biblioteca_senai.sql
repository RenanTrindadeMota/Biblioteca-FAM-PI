USE Biblioteca_Senai; -- Substitua com o nome do seu banco de dados
GO

-- Verifica as roles de segurança associadas ao usuário 'appUser'
SELECT 
    dp.name AS Database_Role,
    mp.name AS Member
FROM 
    sys.database_role_members drm
    INNER JOIN sys.database_principals dp ON drm.role_principal_id = dp.principal_id
    INNER JOIN sys.database_principals mp ON drm.member_principal_id = mp.principal_id
WHERE 
    mp.name = 'appUser';  -- Substitua 'appUser' pelo nome do seu usuário

ALTER ROLE db_owner ADD MEMBER appUser;
ALTER ROLE db_datareader ADD MEMBER appUser;
ALTER ROLE db_datawriter ADD MEMBER appUser;

USE Biblioteca_Senai; -- Substitua com o nome do seu banco de dados
GO

-- Verifica se o usuário appUser existe no banco
SELECT name
FROM sys.database_principals
WHERE type = 'S';  -- Tipo 'S' refere-se a usuários de banco de dados

USE Biblioteca_Senai;
GO

-- Cria o login (se ainda não existir)
CREATE LOGIN appUser WITH PASSWORD = '1234@';

-- Cria o usuário no banco de dados
CREATE USER appUser FOR LOGIN appUser;

-- Agora você pode adicionar o usuário às roles
ALTER ROLE db_owner ADD MEMBER appUser;


