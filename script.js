// Registrar empréstimo
async function registrarEmprestimo() {
    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const turma = document.getElementById("turma").value;
    const telefone = document.getElementById("telefone").value;
    const periodo = document.getElementById("periodo").value;
    const livroId = document.getElementById("livroId").value;
    const dataEmprestimo = document.getElementById("dataEmprestimo").value;
    const dataDevolucao = document.getElementById("dataDevolucao").value;

    try {
        const usuarioResponse = await fetch('/verificarUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nomeUsuario, turma, telefone, periodo })
        });

        const usuarioData = await usuarioResponse.json();
        let usuarioId = usuarioData.usuarioId;

        if (!usuarioId) {
            const novoUsuarioResponse = await fetch('/registrarUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nomeUsuario, turma, telefone, periodo })
            });
            const novoUsuarioData = await novoUsuarioResponse.json();
            usuarioId = novoUsuarioData.usuarioId;
        }

        const emprestimoResponse = await fetch('/registrarEmprestimo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId, livroId, dataEmprestimo, dataDevolucao, status: "Em Aberto"
            })
        });

        if (emprestimoResponse.ok) {
            alert("Empréstimo registrado com sucesso!");
            carregarEmprestimos(); // Atualiza a tabela automaticamente
        } else {
            alert("Erro ao registrar empréstimo.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar ao sistema.");
    }
}

// Registrar devolução
async function registrarDevolucao() {
    const idEmprestimo = document.getElementById("emprestimoId").value;

    if (!idEmprestimo) {
        alert("Por favor, insira o ID do empréstimo.");
        return;
    }

    try {
        const response = await fetch('/registrarDevolucao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idEmprestimo }),
        });

        const result = await response.json();

        if (result.success) {
            alert("Devolução registrada com sucesso!");
            carregarEmprestimos(); // Atualiza a tabela automaticamente
        } else {
            alert(`Erro ao registrar devolução: ${result.message}`);
        }
    } catch (error) {
        console.error("Erro ao registrar devolução:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

// Carregar empréstimos
let emprestimosOriginais = []; // Para armazenar os dados originais

async function carregarEmprestimos() {
    try {
        const response = await fetch('/listarEmprestimos');
        const emprestimos = await response.json();
        emprestimosOriginais = emprestimos; // Salva os dados originais para filtragem

        atualizarTabela(emprestimos);
    } catch (error) {
        console.error("Erro ao carregar empréstimos:", error);
        alert("Erro ao carregar empréstimos.");
    }
}

function atualizarTabela(emprestimos) {
    const tabela = document.getElementById("tabelaEmprestimos").querySelector("tbody");
    tabela.innerHTML = ""; // Limpa a tabela

    emprestimos.forEach(emprestimo => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = emprestimo.ID_Emprestimo;
        row.insertCell(1).textContent = emprestimo.NomeUsuario;
        row.insertCell(2).textContent = emprestimo.Titulo;
        row.insertCell(3).textContent = formatarData(emprestimo.DataEmprestimo);
        row.insertCell(4).textContent = formatarData(emprestimo.DataDevolucao);
        row.insertCell(5).textContent = emprestimo.Status;
    });
}

function aplicarFiltros() {
    const filtroStatus = document.getElementById("filtroStatus").value;
    const filtroUsuario = document.getElementById("filtroUsuario").value;
    const filtroLivro = document.getElementById("filtroLivro").value.toLowerCase();

    const emprestimosFiltrados = emprestimosOriginais.filter(emprestimo => {
        const statusMatch = filtroStatus ? emprestimo.Status === filtroStatus : true;
        const usuarioMatch = filtroUsuario ? emprestimo.ID_Usuario == filtroUsuario : true;
        const livroMatch = filtroLivro ? emprestimo.Titulo.toLowerCase().includes(filtroLivro) : true;

        return statusMatch && usuarioMatch && livroMatch;
    });

    atualizarTabela(emprestimosFiltrados);
}

function formatarData(data) {
    if (!data) return ''; // Retorna vazio se a data for nula ou indefinida
    const dateObj = new Date(data);
    return dateObj.toLocaleDateString('pt-BR');
}

// Carrega os empréstimos ao iniciar
carregarEmprestimos();

// O Date serve para converter a string em data, mas ela é convertida no formato padrão.
// Por isso depois usamos toLocaleDateString('pt-BR') para converter no formato brasileiro.


// Tornar funções acessíveis globalmente
window.registrarEmprestimo = registrarEmprestimo;
window.registrarDevolucao = registrarDevolucao;
window.carregarEmprestimos = carregarEmprestimos;
