// Carregar registros da API e atualizar a tabela
async function carregarRegistros(startDate = "", endDate = "") {
  try {
    // Construir a URL para a API
    let url = "/api/frequencia";
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    } else if (startDate) {
      url += `?date=${startDate}`;
    }

    // Realizar a requisição para a API
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);

    const dados = await response.json();
    atualizarTabela(dados);
  } catch (error) {
    console.error("Erro ao carregar registros:", error);
    exibirMensagemErro("Não foi possível carregar os registros. Tente novamente mais tarde.");
  }
}

// Atualizar a tabela com os dados recebidos
function atualizarTabela(dados) {
  const tabela = document.querySelector("#tabelaFrequencia tbody");
  tabela.innerHTML = ""; // Limpar tabela

  if (!dados || dados.length === 0) {
    tabela.innerHTML = "<tr><td colspan='4'>Nenhum registro encontrado.</td></tr>";
    return;
  }

  // Preencher tabela com os registros
  dados.forEach((item) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${item.ID_User}</td>
      <td>${item.NomeCompleto}</td>
      <td>${item.Ident_User}</td>
      <td>${new Date(item.DataHoraMomento).toLocaleString()}</td>
    `;
    tabela.appendChild(linha);
  });
}

// Exibir mensagem de erro na tabela
function exibirMensagemErro(mensagem) {
  const tabela = document.querySelector("#tabelaFrequencia tbody");
  tabela.innerHTML = `<tr><td colspan='4' class='erro'>${mensagem}</td></tr>`;
}

// Obter início e fim da semana atual
function getStartAndEndOfWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Domingo, ..., 6 = Sábado

  // Calcular início da semana (segunda-feira)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Ajusta para segunda-feira
  startOfWeek.setHours(0, 0, 0, 0); // Meia-noite do início do dia

  // Calcular fim da semana (domingo)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Adiciona 6 dias
  endOfWeek.setHours(23, 59, 59, 999); // Final do dia

  return {
    startOfWeek: startOfWeek.toISOString(),
    endOfWeek: endOfWeek.toISOString(),
  };
}

// Evento de filtro baseado na data selecionada
document.getElementById("selecionarData").addEventListener("change", (e) => {
  const selectedDate = e.target.value;
  if (selectedDate) {
    carregarRegistros(selectedDate); // Carregar com a data selecionada
  } else {
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
    carregarRegistros(startOfWeek, endOfWeek); // Carregar semana atual
  }
});

// Carregar registros para a semana atual ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
  carregarRegistros(startOfWeek, endOfWeek);
});
