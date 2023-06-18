import { loadData } from "../../utils.js";
import { configInputGroup } from "./assets.js";

export default class canvasChart2{
    constructor(){
        this.generalChart = document.createElement("div");
        this.generalCanvas = document.createElement("canvas");
        this.choosedOption = undefined;
        this.chart = undefined;
    }
    
    async configGeneralChart(){
        const [res] = await loadData(`/Admin/Inc/Api/AllSeances.inc.php?all`)
        let htmlOptions = '';
        res.forEach(element => {
            htmlOptions += `
                <div class="option filter-option" data-value="${element.codeMatiere}">${element.nomMatiere}</div>
            `
        });
        this.choosedOption = res[0].codeMatiere;
        this.generalChart.innerHTML = `
                <div class="secondary-chart-head">
                    <h3>Absences dans une séance</h3>
                    <div class="options" style="margin-right:auto;margin-left:0;">
                        <div class="choosed-option" id="choosed-option-filter">
                            <div class="the-option" data-value="${res[0].codeMatiere}">${res[0].nomMatiere}</div>
                            <i class="fas fa-caret-down"></i>
                        </div>
                        <div class="options-list" id="options-list-filter">
                            ${htmlOptions}
                        </div>
                    </div>
                </div>
            `;
        function configChoosedOption(list,target,choosed, options){
            list.classList.toggle('show-options-list')
            options.forEach(element => {
                element.classList.remove('choosed');
                target.classList.add('choosed');
                choosed.children[0].dataset.value = target.dataset.value;
                choosed.children[0].innerHTML = target.innerHTML;
            });
        }
        let choosedOption = this.generalChart.querySelector("#choosed-option-filter");
        let optionsList = this.generalChart.querySelector("#options-list-filter");
        let options = this.generalChart.querySelectorAll('.option');

        options.forEach(element => element.addEventListener('click', async (e)=>{
            configChoosedOption(optionsList,e.target, choosedOption, options)
            this.choosedOption = element.dataset.value;
            await this.initializeChart(element.dataset.value);
        }))
        choosedOption.addEventListener('click', () => {
            optionsList.classList.toggle('show-options-list')
        })

        this.generalChart.setAttribute("class", "canvas-holder");
        this.generalChart.appendChild(this.generalCanvas);
        
        
        this.chart = new Chart(
            this.generalCanvas,
            {
                type: 'bar',
                data: {
                  labels: [],
                  datasets: [{
                    label: '# Total des absences dans les seances d une matiere durant un mois',
                    data: [],
                    borderWidth: 1
                  }]
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              }
        )
    }
    async initializeChart(codeMatiere){
        let [res] = await loadData(`/Admin/Inc/Api/Statistiques.inc.php?chart2&codeMatiere=${codeMatiere}`)
        console.log(res);
        let data = [];
        let labels = [];
        res.forEach(element => {
            data.push(element.absence);
            labels.push(element.month);
        });
        this.updateChart(labels, data);
    }
    updateChart(labels, data){
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
    handleSubmit(){
        let submitButton = this.generalChart.querySelectorAll('.submit')[0]
    }

    async render(){
        await this.configGeneralChart();
        this.initializeChart(this.choosedOption);
        this.handleSubmit();
        return this.generalChart
    }
}