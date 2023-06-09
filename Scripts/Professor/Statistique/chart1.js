import { loadData } from "../../utils.js";
import { configInputGroup } from "./assets.js";

export default class Statistique{
    constructor(data){
        this.data = data;
        this.generalChart = document.createElement("div");
        this.generalCanvasHolder = document.createElement("div");
        this.generalCanvas = document.createElement("canvas");
    }
    configGeneralChart(){
        this.generalChart.innerHTML = `
                <div class="genreral-chart-head">
                    <div class="filter-title">
                        <i class="fas fa-filter"></i>
                        <span>Filter</span>
                        <i class="fas fa-caret-down" id="filter-icon"></i>
                    </div>
                    <div class="genreral-chart-form">
                        <h2 class="chart-title general-chart-title">Absence par </h2>
                        <div class="filter">
                            <div class="choosed-option" id="choosed-option-filter1">
                                <div class="the-date" data-value="classes">Classes</div>
                                <i class="fas fa-caret-down"></i>
                            </div>
                            <div class="options-list" id="options-list-filter1">
                                <div class="option filter1-option" data-value="classes">Classes</div>
                                <div class="option filter1-option" data-value="etudiants">Etudiants</div>
                            </div>
                        </div>
                        <h2 class="chart-title general-chart-title"> dans </h2>
                        <div class="filter">
                            <div class="choosed-option" id="choosed-option-filter2">
                                <div class="the-date" data-value="mois">Mois</div>
                                <i class="fas fa-caret-down"></i>
                            </div>
                            <div class="options-list" id="options-list-filter2">
                                <div class="option filter2-option" data-value="mois">Mois</div>
                                <div class="option filter2-option" data-value="semaine">Semaine</div>
                            </div>
                        </div>
                        <div class="other-inputs"></div>
                    </div>
                    <button type="button" class="submit">Get statistiques</button>
                </div>
            `;
            let filterIcon = this.generalChart.querySelectorAll('#filter-icon')[0];
            let filter_div = this.generalChart.querySelectorAll('.genreral-chart-head')[0];
            let opened=0
            filterIcon.addEventListener('click', () =>{
                filter_div.classList.toggle('head_opened');
                if(opened!=0){
                    filter_div.classList.toggle('head_closed')
                }
                opened += 1;
            })

            
            let option_filter2 =  this.generalChart.querySelectorAll('.filter2-option');
            let otherInputs = this.generalChart.querySelectorAll('.other-inputs')[0];
            function addMonthListInput(){
                const monthsList = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
                let monthsOptions = '';
                monthsList.forEach((month, index) => {
                    monthsOptions += `<div class="option filter3-option" data-value="${index+1}">${month}</div>`
                })
                otherInputs.innerHTML = `
                    <div class="filter">
                        <label class="chart-title">Choisir le mois</label>
                        <div class="choosed-option" id="choosed-option-filter3">
                            <div class="the-date" data-value="1">Janvier</div>
                            <i class="fas fa-caret-down"></i>
                        </div>
                        <div class="options-list" id="options-list-filter3">
                            ${monthsOptions}
                        </div>
                    </div>
                `
            }
            console.log(option_filter2);
            option_filter2.forEach(option =>{
                option.addEventListener('click', () => {
                    console.log(option.dataset.value)
                    switch(option.dataset.value){
                        case 'semaine':
                            otherInputs.innerHTML = `
                                <div class="filter">
                                    <label class="chart-title" for="week">Choisir la semaine</label>
                                    <input type="week" id="week" />
                                </div>
                            `
                            return;
                        case 'mois':
                            addMonthListInput();
                            configInputGroup(
                                this.generalChart.querySelectorAll(".other-inputs")[0],
                                '#choosed-option-filter3',
                                '#options-list-filter3',
                                '.filter3-option'
                                )
                            return;
                    }
                })
            })
            addMonthListInput();
            configInputGroup(
                this.generalChart.querySelectorAll(".other-inputs")[0],
                '#choosed-option-filter3',
                '#options-list-filter3',
                '.filter3-option'
            )
            
            configInputGroup(
                this.generalChart,
                '#choosed-option-filter1',
                '#options-list-filter1',
                '.filter1-option'
                )
            configInputGroup(
                this.generalChart,
                '#choosed-option-filter2',
                '#options-list-filter2',
                '.filter2-option'
                )

        this.generalChart.setAttribute("class", "general-chart");
        this.generalCanvasHolder.setAttribute("class", "general-canvas-holder");
        this.generalCanvas.setAttribute("class", "general-canvas");
        this.generalCanvasHolder.appendChild(this.generalCanvas);
        this.generalChart.appendChild(this.generalCanvasHolder);

        new Chart(
            this.generalCanvas,
            {
                type: 'bar',
                data: {
                  labels: ['MCW', 'SE', 'PROD', 'CG'],
                  datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5],
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
    handleSubmit(){
        let submitButton = this.generalChart.querySelectorAll('.submit')[0]
        submitButton.addEventListener('click',event => {
            let flt1 = this.generalChart.querySelectorAll('#choosed-option-filter1')[0]
                        .children[0].dataset.value;
            let flt2 = this.generalChart.querySelectorAll('#choosed-option-filter2')[0]
                        .children[0].dataset.value;

            let flt3 = undefined;
            if(flt2 == 'semaine'){
                flt3 = this.generalChart.querySelectorAll('#week')[0].value;
            }
            else{
                flt3 = this.generalChart.querySelectorAll('#choosed-option-filter3')[0]
                        .children[0].dataset.value;
            }
            //  here we submit the data required to get the statistiques
            console.log(flt1,flt2,flt3);
        })
    }

    render(){
        this.configGeneralChart();
        this.handleSubmit();
        return this.generalChart
    }
}