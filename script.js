const sizeInput = document.getElementById("size");
const uppercase = document.getElementById("include_uppercase");
const lowercase = document.getElementById("include_lowercase");
const number = document.getElementById("include_number");
const special = document.getElementById("include_special_character");

const generateBtn = document.getElementById("generate");
const result = document.getElementById("password");
const copyBtn = document.getElementById("copy");

// function para exibir mensagens com Toastify
function message(text, status = "success") {
    Toastify({
        text: text,
        duration: 2200,
        gravity: "top",
        position: "center",
        style: {
            background: status === "success" ? "#84cc16" : "#dc2626",
            boxShadow: "none"
        }
    }).showToast();
}
// evento do clique "Gerar Senha"
generateBtn.addEventListener("click", () => {
    const tamanho = Number(sizeInput.value);  // Converte o valor para número

    // validação do tamanho
    if (isNaN(tamanho) || tamanho < 4 || tamanho > 128) {
        message("Tamanho inválido, digite entre 4 e 128!", "danger");
        return;
    }

    // verifica se pelo menos uma opção de caractere foi marcada
    if (!uppercase.checked && !lowercase.checked && !number.checked && !special.checked) {
        message("Selecione pelo menos uma opção!", "danger");
        return;
    }

    // parâmetros da URL para enviar ao backend 
    const params = new URLSearchParams({
        tamanho: tamanho,
        maiuscula: uppercase.checked,
        minuscula: lowercase.checked,
        numero: number.checked,
        especial: special.checked
    });

    // requisição GET para o backend na Render
    fetch(`https://password-gr49.onrender.com/gerar?${params.toString()}`)
        .then(res => res.json())  // Converte a resposta para JSON
        .then(data => {
            
            if (data.password) {
                result.textContent = data.password;  
                document.getElementById("password_container").classList.add("show");
                copyBtn.style.display = "block";  
                message("Senha gerada com sucesso!", "success");
            }
            
            else if (data.erro) {
                message(data.erro, "danger");
            }
        })
        .catch(err => {
            console.error(err);
            message("Erro ao gerar senha!", "danger");
        });
});

// evento do botão "Copiar senha"
copyBtn.addEventListener("click", () => {
    const password = result.textContent;

    if (!password) return;  

    navigator.clipboard.writeText(password);  
    message("Senha copiada!", "success");     
});