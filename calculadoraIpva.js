function mascaraDh(input) {
    // Remove todos os caracteres que não sejam números ou vírgula
    let value = input.value.replace(/\D/g, "");

    // Adiciona vírgula antes dos dois últimos dígitos
    value = value.replace(/(\d{2})$/, ",$1");

    // Adiciona pontos a cada grupo de 3 dígitos a partir do final (para milhares, milhões, etc.)
    value = value.replace(/(\d)(\d{3})(,|$)/g, "$1.$2$3");

    // Adiciona o prefixo de moeda (R$)
    value = `R$ ${value}`;

    // Atualiza o valor do campo de entrada com a máscara aplicada
    input.value = value;
}

document.getElementById('botaoCalcular').addEventListener('click', calcularIPVA);

function calcularIPVA() {
    // Obter o valor do veículo e substituir a vírgula por um ponto antes da conversão
    const valorVeiculoStr = document.getElementById('valor').value;
    const valorVeiculo = parseFloat(valorVeiculoStr
        .replace(/\./g, "")  // Remove todos os pontos de milhar
        .replace(",", ".")   // Substitui a vírgula por ponto
        .replace("R$", "")   // Remove o prefixo "R$"
        .trim()              // Remove espaços em branco
    );
    

    // Verificar se o valor é um número e se é maior que zero
    if (isNaN(valorVeiculo) || valorVeiculo <= 0) {
        alert("Por favor, insira um valor válido para o veículo.");
        return;
    }

    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const estado = document.getElementById('estado').value;

    // Alíquotas de IPVA por estado (exemplo fictício)
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

    // Modificadores de alíquota por tipo de veículo
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

    // Cálculo final do IPVA
    const ipva = valorVeiculo * aliquotaEstado * modificadorTipo;

    // Exibindo o resultado em forma de lista
    const resultadoContainer = document.getElementById('resultadoContainer');
    
    // Limpar o conteúdo anterior, caso já tenha algum resultado
    resultadoContainer.innerHTML = '';

    // Criar a lista
    const ul = document.createElement('ul');

    // Adicionar itens à lista com os detalhes
    const liValorVeiculo = document.createElement('li');
    liValorVeiculo.textContent = `Valor do veículo: R$ ${valorVeiculo.toFixed(2).replace(".", ",")}`;
    
    const liAliquotaEstado = document.createElement('li');
    liAliquotaEstado.textContent = `Alíquota do estado (${estado}): ${(aliquotaEstado * 100).toFixed(2)}%`;

    const liModificadorTipo = document.createElement('li');
    liModificadorTipo.textContent = `Modificador para o tipo de veículo (${tipoVeiculo}): ${modificadorTipo}`;

    const liResultado = document.createElement('li');
    liResultado.textContent = `Valor final do IPVA: R$ ${ipva.toFixed(2).replace(".", ",")}`;

    // Adicionar os itens à lista
    ul.appendChild(liValorVeiculo);
    ul.appendChild(liAliquotaEstado);
    ul.appendChild(liModificadorTipo);
    ul.appendChild(liResultado);

    // Adicionar a lista ao contêiner de resultado
    resultadoContainer.appendChild(ul);

    resultadoContainer.classList.remove('invisivel');

}