document.addEventListener("DOMContentLoaded", function () {
    const matriz = [
        ["1", "2", "3", "F1"], ["1", "2", "3", "F2"], ["1", "2", "F", "3"], ["1", "F", "2", "3"],
        ["F1", "1", "2", "3"], ["F2", "1", "2", "3"], ["3", "1", "2", "F"], ["3", "1", "F", "2"],
        ["3", "F1", "1", "2"], ["3", "F2", "1", "2"], ["F", "3", "1", "2"], ["2", "3", "1", "F"],
        ["2", "3", "F1", "1"], ["2", "3", "F2", "1"], ["2", "F", "3", "1"], ["F", "2", "3", "1"]
    ];

    const EQUIPES = ["A", "B", "C", "D"];
    const DIAS_SEMANA_ABREV = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const mesSelect = document.getElementById("mes");
    const anoInput = document.getElementById("ano");
    const tabelaDiv = document.getElementById("tabela");

    function gerarTabela() {
        const mes = parseInt(mesSelect.value);
        const ano = parseInt(anoInput.value);
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();
        const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
        
        const hoje = new Date();
        const diaHoje = hoje.getDate();
        const mesHoje = hoje.getMonth();
        const anoHoje = hoje.getFullYear();

        const dataReferencia = new Date(2025, 6, 1);
        const posReferencia = 9;
        const dataInicialMes = new Date(ano, mes, 1);
        const diffTime = dataInicialMes - dataReferencia;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        const posPrimeiroDia = ((posReferencia + diffDays) % 16 + 16) % 16;
        
        let html = "";
        const totalCelulasGrid = diasNoMes + primeiroDiaSemana;
        const numSemanas = Math.ceil(totalCelulasGrid / 7);

        for (let semana = 0; semana < numSemanas; semana++) {
            html += "<table>";
            
            let cabecalho = "<thead><tr><th>Turno</th>";
            for (let i = 0; i < 7; i++) {
                const diaGrid = (semana * 7) + i;
                const diaDoMes = diaGrid - primeiroDiaSemana + 1;
                
                if (diaDoMes >= 1 && diaDoMes <= diasNoMes) {
                    const data = new Date(ano, mes, diaDoMes);
                    const diaDaSemana = data.getDay();
                    
                    const isColunaHoje = (diaDoMes === diaHoje && mes === mesHoje && ano === anoHoje);
                    const isFimDeSemana = (diaDaSemana === 0 || diaDaSemana === 6);
                    
                    let classeCabecalho = '';
                    if (isColunaHoje) {
                        classeCabecalho = 'dia-atual-coluna';
                    } else if (isFimDeSemana) {
                        classeCabecalho = 'fim-de-semana-cabecalho';
                    }

                    cabecalho += `<th class="${classeCabecalho}">${diaDoMes}<br><small>${DIAS_SEMANA_ABREV[diaDaSemana]}</small></th>`;
                } else {
                    cabecalho += "<th class='empty'></th>";
                }
            }
            cabecalho += "</tr></thead>";
            html += cabecalho;

            let corpo = "<tbody>";
            EQUIPES.forEach((equipe, indexEquipe) => {
                corpo += `<tr><td class='turno'>${equipe}</td>`;
                for (let i = 0; i < 7; i++) {
                    const diaGrid = (semana * 7) + i;
                    const diaDoMes = diaGrid - primeiroDiaSemana + 1;

                    if (diaDoMes >= 1 && diaDoMes <= diasNoMes) {
                        const pos = (posPrimeiroDia + diaDoMes - 1) % 16;
                        const valor = matriz[pos][indexEquipe];
                        
                        const isFolga = valor.includes("F");
                        const isColunaHoje = (diaDoMes === diaHoje && mes === mesHoje && ano === anoHoje);
                        
                        let classesParaTd = [];

                        // Define a cor de fundo da célula
                        if (isFolga) {
                            classesParaTd.push('folga');
                        } else if (isColunaHoje) {
                            classesParaTd.push('dia-atual-coluna');
                        } else {
                            classesParaTd.push('matriz');
                        }
                        
                        // Adiciona a borda de destaque se for exatamente a célula do dia de hoje
                        if (isColunaHoje) {
                            classesParaTd.push('hoje-borda');
                        }
                        
                        corpo += `<td class="${classesParaTd.join(' ')}">${valor}</td>`;
                    } else {
                        corpo += "<td class='empty'></td>";
                    }
                }
                corpo += "</tr>";
            });
            corpo += "</tbody>";
            html += corpo;
            html += "</table>";
        }
        tabelaDiv.innerHTML = html;
    }

    function definirDataAtual() {
        const hoje = new Date();
        mesSelect.value = hoje.getMonth();
        anoInput.value = hoje.getFullYear();
    }

    mesSelect.addEventListener("change", gerarTabela);
    anoInput.addEventListener("change", gerarTabela);

    definirDataAtual();
    gerarTabela();
});