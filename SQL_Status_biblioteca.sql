CREATE PROCEDURE AtualizarStatusEmprestimo
AS
BEGIN
    -- Atualizar para "Atrasado" se a data atual passou da DataDevolucao e ainda estiver "Em Aberto"
    UPDATE Emprestimo
    SET Status = 'Atrasado'
    WHERE Status = 'Em Aberto' AND DataDevolucao < GETDATE();

    -- Atualizar para "Perda" se passaram mais de 30 dias da DataDevolucao e ainda estiver "Atrasado"
    UPDATE Emprestimo
    SET Status = 'Perda'
    WHERE Status = 'Atrasado' AND DATEADD(DAY, 30, DataDevolucao) < GETDATE();
END;
