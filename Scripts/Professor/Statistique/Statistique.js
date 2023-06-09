import { loadData } from "../../utils.js";
import Chart1 from './chart1.js';

export default class Statistique{
    constructor(data){
        this.data = data;
        this.statistique = document.createElement("div");
        this.generalChart = document.createElement("div");
        this.secondaryChart = document.createElement("div");
        this.generalCanvasHolder = document.createElement("div");
        this.generalCanvas = document.createElement("canvas");
        this.secCvx1Holder = document.createElement("div");
        this.secCvx2Holder = document.createElement("div");
        this.secCanvas1 = document.createElement("canvas");
        this.secCanvas2 = document.createElement("canvas");
    }

    configChoosedOption(list,target,choosed, options){
        list.classList.toggle('show-options-list')
        options.forEach(element => {
            element.classList.remove('choosed');
            target.classList.add('choosed');
            choosed.children[0].dataset.value = target.dataset.value;
            choosed.children[0].innerHTML = target.innerHTML;
        });
    }

    cconfigInputGroup(parent,choosedElementId, optionsListId, optionsClassName){
        let choosedOption = parent.querySelector(choosedElementId);
        let optionsList = parent.querySelector(optionsListId);
        let options = parent.querySelectorAll(optionsClassName);

        options.forEach(element => element.addEventListener('click', async (e)=>{
            this.configChoosedOption(optionsList,e.target, choosedOption, options)
        }))
        choosedOption.addEventListener('click', () => {
            optionsList.classList.toggle('show-options-list')
        })
    }
    async configSecondaryChart(){
        this.secCvx1Holder.innerHTML = `
            <div class="secondary-chart-head">
                <h2 class="chart-title">Nombre d'absence par classe</h2>
            </div>
        `
        this.secCvx2Holder.innerHTML = `
            <div class="secondary-chart-head">
                <h2 class="chart-title">Percentage d’absence</h2>
            </div>
        `
        this.secondaryChart.setAttribute("class", "secondary-chart");
        this.secCvx1Holder.setAttribute("class", "canvas-holder");
        this.secCvx2Holder.setAttribute("class", "canvas-holder");

        this.secCvx1Holder.append(
            this.secCanvas1
        )
        this.secCvx2Holder.append(
            this.secCanvas2
        )
        this.secondaryChart.append(
            this.secCvx1Holder,
            this.secCvx2Holder
        )

        let [res] = await loadData('/Professor/Inc/Api/Statistiques.inc.php?chart3=true')
        new Chart(
            this.secCanvas1,
            {
                type: 'line',
                data: {
                    labels: [
                        'junuary',
                        'february',
                        'april',
                        'may',
                        'june',
                    ],
                    datasets: [{
                      label: 'My First Dataset',
                      data: [65, 59, 80, 81, 56, 55, 40],
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }]
                  }
                })
        new Chart(
            this.secCanvas2,
            {
                type: 'doughnut',
                data: {
                    labels: [
                      '1 er annees',
                      '2 eme annees'
                    ],
                    datasets: [{
                      label: 'The persent of absence is',
                      data: [res.first, res.second],
                      backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 205, 86)'
                      ],
                      hoverOffset: 10
                    }]
                  }
                })
    }

    configStatistique(){
        this.statistique.setAttribute("class", "statistique");
        this.statistique.append(
            new Chart1().render(),
            this.secondaryChart
        );
    }

    render(){
        this.configSecondaryChart();
        this.configStatistique();
        return this.statistique
    }
}