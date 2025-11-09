USE PROJETO_SIP; -- Substitua com o nome do seu banco de dados
GO

-- Verifica as roles de segurança associadas ao usuário 'appUserFam'
SELECT 
    dp.name AS Database_Role,
    mp.name AS Member
FROM 
    sys.database_role_members drm
    INNER JOIN sys.database_principals dp ON drm.role_principal_id = dp.principal_id
    INNER JOIN sys.database_principals mp ON drm.member_principal_id = mp.principal_id
WHERE 
    mp.name = 'appUserFam';  -- Substitua 'appUserFam' pelo nome do seu usuário

ALTER ROLE db_owner ADD MEMBER appUserFam;
ALTER ROLE db_datareader ADD MEMBER appUserFam;
ALTER ROLE db_datawriter ADD MEMBER appUserFam;

USE PROJETO_SIP; -- Substitua com o nome do seu banco de dados
GO

-- Verifica se o usuário appUserFam existe no banco
SELECT name
FROM sys.database_principals
WHERE type = 'S';  -- Tipo 'S' refere-se a usuários de banco de dados

USE PROJETO_SIP;
GO

-- Cria o login (se ainda não existir)
CREATE LOGIN appUserFam WITH PASSWORD = '1234@';

-- Cria o usuário no banco de dados
CREATE USER appUserFam FOR LOGIN appUserFam;

-- Agora você pode adicionar o usuário às roles
ALTER ROLE db_owner ADD MEMBER appUserFam;


