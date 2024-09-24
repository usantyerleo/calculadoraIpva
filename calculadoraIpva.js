function mascaraDh(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{2})$/, ",$1");
    value = value.replace(/(\d)(\d{3})(,|$)/g, "$1.$2$3");
    value = `R$ ${value}`;
    input.value = value;
}

document.getElementById('botaoCalcular').addEventListener('click', calcularIPVA);
let consultas;

function calcularIPVA() {
    const valorVeiculoStr = document.getElementById('valor').value;
    const valorVeiculo = parseFloat(valorVeiculoStr
        .replace(/\./g, "")
        .replace(",", ".")
        .replace("R$", "")
        .trim()
    );

    if (isNaN(valorVeiculo) || valorVeiculo <= 0) {
        alert("Por favor, insira um valor válido para o veículo.");
        return;
    }

    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const estado = document.getElementById('estado').value;

    const aliquotas = {
        "Pernambuco": 0.03,
        "Alagoas": 0.025,
        "Bahia": 0.03,
        "Ceará": 0.035,
        "Maranhão": 0.03,
        "Paraíba": 0.025,
        "Piauí": 0.03,
        "Rio Grande do Norte": 0.025,
        "Sergipe": 0.03
    };

    const tipoModificadores = {
        "Particular e passeio": 1.0,
        "Caminhonetes e utilitários": 1.0,
        "Transporte de passageiros": 0.75,
        "Motocicletas e quadriciclos": 0.5,
        "Locadoras de veículos": 0.75,
        "Ônibus e caminhões": 0.75
    };

    const aliquotaEstado = aliquotas[estado];
    const modificadorTipo = tipoModificadores[tipoVeiculo];

    if (!aliquotaEstado || !modificadorTipo) {
        alert("Selecione um estado e tipo de veículo válidos.");
        return;
    }

    const ipva = valorVeiculo * aliquotaEstado * modificadorTipo;

    const resultadoContainer = document.getElementById('resultadoContainer');
    resultadoContainer.innerHTML = '';

    const ul = document.createElement('ul');

    const liValorVeiculo = document.createElement('li');
    liValorVeiculo.textContent = `Valor do veículo: R$ ${valorVeiculo.toFixed(2).replace(".", ",")}`;

    const liAliquotaEstado = document.createElement('li');
    liAliquotaEstado.textContent = `Alíquota do estado (${estado}): ${(aliquotaEstado * 100).toFixed(2)}%`;

    const liModificadorTipo = document.createElement('li');
    liModificadorTipo.textContent = `Modificador para o tipo de veículo (${tipoVeiculo}): ${modificadorTipo}`;

    const liResultado = document.createElement('li');
    liResultado.textContent = `Valor final do IPVA: R$ ${ipva.toFixed(2).replace(".", ",")}`;

    ul.appendChild(liValorVeiculo);
    ul.appendChild(liAliquotaEstado);
    ul.appendChild(liModificadorTipo);
    ul.appendChild(liResultado);

    resultadoContainer.appendChild(ul);
    resultadoContainer.classList.remove('invisivel');

    salvarConsulta(valorVeiculo, ipva);
}

function salvarConsulta(valorVeiculo, ipva) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.unshift({
        valor: valorVeiculo.toFixed(2).replace(".", ","),
        ipva: ipva.toFixed(2).replace(".", ","),
        data: new Date().toLocaleString()
    });

    if (consultas.length > 5) {
        consultas.pop();
    }

    localStorage.setItem('consultas', JSON.stringify(consultas));
    atualizarConsultasLateral();
}

function atualizarConsultasLateral() {
    const consultasContainer = document.getElementById('listaConsultas');
    consultasContainer.innerHTML = '';

    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];

    if (consultas.length === 0) {
        consultasContainer.textContent = 'Nenhuma consulta recente.';
    } else {
        const ul = document.createElement('ul');
        consultas.forEach(consulta => {
            const li = document.createElement('li');
            li.textContent = `Valor: R$ ${consulta.valor}, IPVA: R$ ${consulta.ipva}, Data: ${consulta.data}`;
            ul.appendChild(li);
        });
        consultasContainer.appendChild(ul);
    }
}

atualizarConsultasLateral();
