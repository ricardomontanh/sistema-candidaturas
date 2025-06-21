
document.getElementById('formulario').addEventListener('submit', async function(e) {
    e.preventDefault();

    
    const apikeyInput = document.getElementById('apikey');
    let apikey = apikeyInput.value.trim();
    if (!apikey) {
        apikey = localStorage.getItem('openai_apikey') || '';
        apikeyInput.value = apikey;
    } else {
        localStorage.setItem('openai_apikey', apikey);
    }

    const vaga = document.getElementById('vaga').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    const prompt = `Escreva uma carta de apresentação formal para o cargo de ${vaga} na empresa ${empresa}, com base na seguinte descrição de vaga:\n\n${descricao}`;

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

    const data = await resposta.json();

    if (data.choices && data.choices.length > 0) {
        let carta = data.choices[0].message.content.trim();
        document.getElementById('cartaGerada').value = carta;
        document.getElementById('resultado').classList.remove('oculto');
        window.generatedCarta = carta;
    } else {
        alert("Erro ao gerar a carta. Verifique sua API Key ou tente novamente.");
        console.error(data);
    }
});

function copiarTexto() {
    const carta = document.getElementById('cartaGerada');
    carta.select();
    document.execCommand('copy');
    alert('Carta copiada para a área de transferência!');
}

function baixarDocx() {
    if (!window.generatedCarta) {
        alert("Gere uma carta antes de baixar.");
        return;
    }

    const nome = "Ricardo Munhoz Montanha";
    const endereco = "Urbanização Quinta Dr. Beirão nº 9 Lote 15 - 3º Esquerdo";
    const cidade = "Castelo Branco";
    const codigopostal = "6000-140";
    const cidade_cp = cidade + ", " + codigopostal;
    const email = "ricardomontanh@gmail.com";
    const telefone = "+351 925 368 511";
    const dataHoje = new Date().toLocaleDateString('pt-PT');

    // Substituir todos os marcadores conhecidos
    let textoFinal = window.generatedCarta
        .replaceAll("[Seu nome]", nome)
        .replaceAll("[Seu endereço]", endereco)
        .replaceAll("[Seu email]", email)
        .replaceAll("[Seu e-mail]", email)
        .replaceAll("[Seu número de telefone]", telefone)
        .replaceAll("[Cidade, Código Postal]", cidade_cp)
        .replaceAll("[Data]", dataHoje)
        .replaceAll("[Local e data]", `Castelo Branco, ${dataHoje}`)
        .replaceAll("[Cidade]", cidade)
        .replaceAll("[Código Postal]", codigopostal);

    const header = [
        nome,
        endereco,
        cidade_cp,
        `E-mail: ${email}`,
        `Telefone: ${telefone}`,
        "",
        `Castelo Branco, ${dataHoje}`,
        ""
    ];

    const fullText = header.concat(textoFinal.split('\n')).join('\n');

    const doc = new window.docx.Document({
        sections: [{
            properties: {},
            children: fullText.split('\n').map(p =>
                new window.docx.Paragraph({ children: [new window.docx.TextRun(p)] })
            )
        }]
    });

    window.docx.Packer.toBlob(doc).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Carta_Apresentacao.docx";
        a.click();
        window.URL.revokeObjectURL(url);
    });
}


// Botão para limpar API Key do localStorage
function limparApiKey() {
    localStorage.removeItem('openai_apikey');
    document.getElementById('apikey').value = '';
    alert('API Key removida com sucesso. Você precisará inseri-la novamente.');
}
