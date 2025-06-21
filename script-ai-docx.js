
function aplicarSubstituicoes(texto) {
    const nome = "Ricardo Munhoz Montanha";
    const endereco = "Urbanização Quinta Dr. Beirão nº 9 Lote 15 - 3º Esquerdo";
    const cidade = "Castelo Branco";
    const codigopostal = "6000-140";
    const cidade_cp = cidade + ", " + codigopostal;
    const email = "ricardomontanh@gmail.com";
    const telefone = "+351 925 368 511";
    const dataHoje = new Date().toLocaleDateString('pt-PT');

    const empresa_nome = document.getElementById("empresa").value.trim() || "EMPRESA";
    const empresa_endereco = document.getElementById("empresa_endereco")?.value.trim() || "[Endereço da Empresa]";
    const empresa_email = document.getElementById("empresa_email")?.value.trim() || "[Email da Empresa]";

    let textoFinal = texto
        .replaceAll("[Seu Nome]", nome)
        .replaceAll("[Seu nome]", nome)
        .replaceAll("[Seu Endereço]", endereco)
        .replaceAll("[Seu endereço]", endereco)
        .replaceAll("[Cidade, Código Postal]", cidade_cp)
        .replaceAll("[Seu Email]", email)
        .replaceAll("[Seu e-mail]", email)
        .replaceAll("[Seu Número de Telefone]", telefone)
        .replaceAll("[Telefone]", telefone)
        .replaceAll("[Data]", dataHoje)
        .replaceAll("[hôma]", empresa_nome)
        .replaceAll("[Empresa]", empresa_nome)
        .replaceAll("[Endereço da Empresa]", empresa_endereco)
        .replaceAll("[Email da Empresa]", empresa_email);

    if (!textoFinal.includes(nome)) {
        textoFinal += "\n\n" + nome;
    }

    return textoFinal;
}

function mostrarCartaGerada(texto) {
    const textoFinal = aplicarSubstituicoes(texto);
    window.generatedCarta = textoFinal;

    const output = document.createElement("pre");
    output.textContent = textoFinal;
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = '';
    resultado.appendChild(output);
}

async function gerarCartaComIA() {
    const vaga = document.getElementById("vaga").value.trim();
    const empresa = document.getElementById("empresa").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const idioma = document.getElementById("idioma").value.trim();
    const apikeyInput = document.getElementById("apikey");
    let apikey = apikeyInput.value.trim();

    if (!vaga || !empresa || !descricao || !apikey) {
        alert("Por favor, preencha todos os campos e insira a API Key.");
        return;
    }

    if (!apikey) {
        apikey = localStorage.getItem("openai_apikey") || '';
        apikeyInput.value = apikey;
    } else {
        localStorage.setItem("openai_apikey", apikey);
    }

    const prompt = `Gere uma carta de apresentação formal no idioma ${idioma} para a vaga de '${vaga}' na empresa '${empresa}'. A carta deve refletir motivação e destacar competências para o cargo. Use o seguinte resumo da vaga como base:\n\n${descricao}`;

    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apikey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        })
    });

    const dados = await resposta.json();
    if (dados.error) {
        alert("Erro: " + dados.error.message);
        return;
    }

    const textoGerado = dados.choices[0].message.content;
    mostrarCartaGerada(textoGerado);
}

function baixarDocx() {
    const { Document, Packer, Paragraph, TextRun } = window.docx;
    const doc = new Document({
        sections: [{
            properties: {},
            children: [new Paragraph({ children: [new TextRun(window.generatedCarta)] })],
        }],
    });

    Packer.toBlob(doc).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "carta_apresentacao.docx";
        a.click();
    });
}

function baixarPdf() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const texto = window.generatedCarta || "";
    const linhas = pdf.splitTextToSize(texto, 180);
    pdf.text(linhas, 10, 20);
    pdf.save("carta_apresentacao.pdf");
}

function copiarTexto() {
    navigator.clipboard.writeText(window.generatedCarta || "").then(() => {
        alert("Carta copiada para a área de transferência!");
    });
}

function limparAPIKey() {
    localStorage.removeItem("openai_apikey");
    document.getElementById("apikey").value = "";
}
