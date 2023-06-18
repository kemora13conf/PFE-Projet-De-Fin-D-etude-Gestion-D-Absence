import { loadData } from "../../utils.js";
import canvasChart1 from './Chart1.js';
import canvasChart2 from './Chart2.js';

export default class Statistique{
    constructor(data){
        this.data = data;
        this.statistique = document.createElement("div");
        this.generalChart = document.createElement("div");
        this.secondaryChart = document.createElement("div");
        this.generalCanvasHolder = document.createElement("div");
        this.generalCanvas = document.createElement("canvas");
        this.secCvx2Holder = document.createElement("div");
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
        this.secCvx2Holder.innerHTML = `
            <div class="secondary-chart-head">
                <h2 class="chart-title">Percentage d’absence</h2>
            </div>
        `
        this.secondaryChart.setAttribute("class", "secondary-chart");
        this.secCvx2Holder.setAttribute("class", "canvas-holder");

        this.secCvx2Holder.append(
            this.secCanvas2
        )
        this.secondaryChart.append(
            await new canvasChart2().render(),
            this.secCvx2Holder
        )

        let [res] = await loadData('/Admin/Inc/Api/Statistiques.inc.php?chart3=true')
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
            new canvasChart1().render(),
            this.secondaryChart
        );
    }

    render(){
        this.configSecondaryChart();
        this.configStatistique();
        return this.statistique
    }
}