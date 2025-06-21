document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const nomeVaga = document.getElementById('nome').value;
    const empresa = document.getElementById('empresa').value;

    const carta = `Prezados responsáveis pela ${empresa},

Estou me candidatando à vaga de ${nomeVaga}, conforme anunciado. Tenho experiência sólida na área e acredito que posso contribuir de forma significativa para os vossos objetivos.

Fico à disposição para uma entrevista e envio o currículo em anexo.

Atenciosamente,

Ricardo Montanha`;

    document.getElementById('cartaGerada').value = carta;
    document.getElementById('resultado').classList.remove('oculto');
});

function copiarTexto() {
    const carta = document.getElementById('cartaGerada');
    carta.select();
    document.execCommand('copy');
    alert('Carta copiada para a área de transferência!');
}
