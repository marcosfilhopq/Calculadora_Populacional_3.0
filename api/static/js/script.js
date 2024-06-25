document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calcForm');
    const resultDiv = document.getElementById('result');
    const ctx = document.getElementById('growthChart').getContext('2d');
    const toggleModeButton = document.getElementById('toggleMode');
    let isDarkMode = false;

    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Crescimento Populacional',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Tempo (anos)' } },
                y: { title: { display: true, text: 'População' } }
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const timeUnit = formData.get('time_unit');
        const timeValue = parseFloat(formData.get('time'));
        let timeInYears;

        switch (timeUnit) {
            case 'years':
                timeInYears = timeValue;
                break;
            case 'months':
                timeInYears = timeValue / 12;
                break;
            case 'weeks':
                timeInYears = timeValue / 52;
                break;
            case 'days':
                timeInYears = timeValue / 365;
                break;
        }

        formData.set('time', timeInYears);
        const response = await fetch('/calculate', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (response.ok) {
            const { initial_population, growth_rate, time } = Object.fromEntries(formData.entries());
            const formattedPopulation = formatNumber(data.population); // Formata o número conforme necessário
            const timeUnitText = getTimeUnitText(timeValue, timeUnit);
            resultDiv.innerHTML = `População após ${timeValue} ${timeUnitText}: ${formattedPopulation}`;
            resultDiv.style.display = 'block'; // Mostra o bloco de resultado após o cálculo
            updateChart(initial_population, growth_rate, time, data.population);
        } else {
            resultDiv.textContent = `Erro: ${data.error}`;
            resultDiv.style.display = 'none'; // Esconde o bloco de resultado em caso de erro
        }
    });

    function updateChart(initial, rate, time, finalPopulation) {
        const times = Array.from({ length: Math.ceil(time) + 1 }, (_, i) => i);
        const populations = times.map(t => initial * Math.exp((rate / 100) * t));
        chart.data.labels = times;
        chart.data.datasets[0].data = populations;
        chart.update();
    }

    // Função para formatar o número conforme o valor
    function formatNumber(number) {
        if (number >= 1000) {
            return Math.floor(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        } else {
            return number.toFixed(2).replace('.', ',');
        }
    }

    function getTimeUnitText(value, unit) {
        switch (unit) {
            case 'years':
                return value === 1 ? 'ano' : 'anos';
            case 'months':
                return value === 1 ? 'mês' : 'meses';
            case 'weeks':
                return value === 1 ? 'semana' : 'semanas';
            case 'days':
                return value === 1 ? 'dia' : 'dias';
        }
    }
});




document.addEventListener('DOMContentLoaded', function() {
    const infoButtons = document.querySelectorAll('.info-button');

    infoButtons.forEach(button => {
        button.addEventListener('click', function() {
            let tooltip = this.nextElementSibling;

            // If tooltip doesn't exist, create it
            if (!tooltip || !tooltip.classList.contains('tooltip')) {
                tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.innerText = this.getAttribute('data-tooltip');
                this.parentNode.insertBefore(tooltip, this.nextSibling);
            }

            // Toggle tooltip visibility
            if (tooltip.style.display === 'block') {
                tooltip.style.display = 'none';
            } else {
                tooltip.style.display = 'block';
            }
        });
    });
});

function navigateToJogoMilhaoEdos() {
    window.location.href = '/jogo_milhao_edos';
}
