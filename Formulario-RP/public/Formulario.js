document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  let formulario = document.getElementById("formulario");

  // Verifica se o formulário existe antes de adicionar o evento
  if (formulario) {
      formulario.addEventListener("submit", async function (event) {
          event.preventDefault(); // Previne o envio padrão do formulário
          await salvar(); // Chama a função 'salvar' uma única vez
      });
  } else {
      console.error("Form element not found");
  }

  let select = document.querySelector(".select"),
    selectedValue = document.getElementById("select-value"),
    optionsViewButton = document.getElementById("options-view-button"),
    inputOptions = document.querySelectorAll(".option input");

  // Ocultar/mostrar botão "Registrar" quando as opções estão abertas/fechadas
  optionsViewButton.addEventListener("input", () => {
    select.classList.toggle("open");
    const input = document.querySelector(".option input:checked") || document.querySelector(".option input");
    input.focus();
  });

  // Atualizar o valor selecionado quando uma opção for clicada
  inputOptions.forEach((input) => {
    input.addEventListener("click", (event) => {
      selectedValue.textContent = input.dataset.label;
      const isMouseOrTouch = event.pointerType == "mouse" || event.pointerType == "touch";
      if (isMouseOrTouch) {
        optionsViewButton.click();
      }
    });
  });

  // Fechar as opções ao pressionar a tecla ESC ou espaço
  window.addEventListener("keydown", (e) => {
    if (!select.classList.contains("open")) return;
    if (e.key == "Escape" || e.key == " ") {
      optionsViewButton.click();
    }
  });

  // Fechar as opções se clicar fora da área
  document.addEventListener("click", (event) => {
    if (!select.contains(event.target) && select.classList.contains("open")) {
      optionsViewButton.click();
    }
  });

  // **Alteração no evento de limpar o formulário**
  const resetButton = document.getElementById("reset");
  if (resetButton) {
    resetButton.addEventListener("click", limparFormulario);
  }

  // Função para limpar o formulário
  function limparFormulario() {
    formulario.reset();
    // Limpar a seleção de rádio
    const radioButtons = document.querySelectorAll("input[type='radio']");
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
    // Resetar o texto de "Selecione sua identificação"
    document.getElementById("select-value").textContent = "Selecione sua identificação";
  }

  // Função para salvar os dados do formulário
  async function salvar() {
      console.log("Função salvar foi chamada");
      const nomeCompleto = document.getElementById('nome').value;
      const identUser = document.getElementById('select-value').textContent; // Pega o texto selecionado

      try {
          const response = await fetch('/registrar-frequencia', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nomeCompleto, identUser })
          });

          const result = await response.json();

          // Exibe um alerta com a mensagem de sucesso ou erro
          if (response.ok) {
              alert('Frequência registrada com sucesso!');
          } else {
              alert(`Erro ao registrar frequência: ${result.message || 'Tente novamente mais tarde.'}`);
          }
      } catch (error) {
          console.error('Erro na requisição:', error);
          alert('Erro ao registrar frequência: Verifique sua conexão e tente novamente.');
      }
  }

});


// Mudando a cor do input do nome para preto e removendo o italico
const nomeInput = document.getElementById("nome");

// Adiciona o evento de input
nomeInput.addEventListener("input", () => {
  if (nomeInput.value.trim() !== "") {
    // Altera o estilo do texto quando o usuário começa a digitar
    nomeInput.style.color = "var(--letter-color)"; // Cor principal
    nomeInput.style.fontStyle = "normal"; // Remove o itálico
    nomeInput.style.opacity = "1"; // Torna o texto completamente visível
  } else {
    // Reverte para o estilo inicial quando o campo está vazio
    nomeInput.style.color = "var(--letter-color)";
    nomeInput.style.fontStyle = "italic";
    nomeInput.style.opacity = "0.8";
  }
});


// Mudando a cor do input de identificação para preto e removendo o italico
const selectButton = document.getElementById("select-button");
const selectValue = document.getElementById("select-value");
const options = document.querySelectorAll("#options .option input");

// Adiciona um evento para cada opção
options.forEach(option => {
  option.addEventListener("change", () => {
    const selectedLabel = option.getAttribute("data-label");
    
    // Atualiza o texto do select-value com o texto da opção selecionada
    selectValue.textContent = selectedLabel;
    
    // Altera o estilo do select-value para texto escuro
    selectValue.style.color = "var(--letter-color)";
    selectValue.style.fontStyle = "normal"; // Remove o estilo itálico
    selectValue.style.opacity = "1"; // Garante que não fique transparente
  });
});
