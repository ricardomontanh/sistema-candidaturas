document.getElementById('formulario').addEventListener('submit', async function(e) {
    e.preventDefault();

    const apikey = document.getElementById('apikey').value.trim();
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
        const carta = data.choices[0].message.content.trim();
        document.getElementById('cartaGerada').value = carta;
        document.getElementById('resultado').classList.remove('oculto');
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
