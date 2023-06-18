import { loadData } from "../../utils.js";
import { configInputGroup } from "./assets.js";

export default class canvasChart1{
    constructor(){
        this.generalChart = document.createElement("div");
        this.generalCanvasHolder = document.createElement("div");
        this.generalCanvas = document.createElement("canvas");
        this.chart = undefined;
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
                        <div class="options">
                            <div class="choosed-option" id="choosed-option-filter1">
                                <div class="the-option" data-value="classes">Classes</div>
                                <i class="fas fa-caret-down"></i>
                            </div>
                            <div class="options-list" id="options-list-filter1">
                                <div class="option filter1-option" data-value="classes">Classes</div>
                                <div class="option filter1-option" data-value="etudiants">Etudiants</div>
                            </div>
                        </div>
                        <h2 class="chart-title general-chart-title"> dans </h2>
                        <div class="options">
                            <div class="choosed-option" id="choosed-option-filter2">
                                <div class="the-option" data-value="month">Mois</div>
                                <i class="fas fa-caret-down"></i>
                            </div>
                            <div class="options-list" id="options-list-filter2">
                                <div class="option filter2-option" data-value="month">Mois</div>
                                <div class="option filter2-option" data-value="week">Semaine</div>
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
            if(innerWidth > 1100){
                filter_div.classList.remove('head_closed');
                filter_div.classList.add('head_opened');
                opened += 1;
            }
            addEventListener('resize', () => {
                if(innerWidth > 1100){
                    filter_div.classList.remove('head_closed');
                    filter_div.classList.add('head_opened');
                    opened += 1;
                }else{
                    filter_div.classList.remove('head_opened');
                    filter_div.classList.add('head_closed');
                }
            })
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
                const currentMonth = new Date().getMonth();
                let monthsOptions = '';
                monthsList.forEach((month, index) => {
                    monthsOptions += `<div class="option filter3-option" data-value="${index+1}">${month}</div>`
                })
                otherInputs.innerHTML = `
                    <div class="options">
                        <label class="chart-title">Choisir le mois</label>
                        <div class="choosed-option" id="choosed-option-filter3">
                            <div class="the-option" data-value="${currentMonth + 1}">${monthsList[currentMonth]}</div>
                            <i class="fas fa-caret-down"></i>
                        </div>
                        <div class="options-list" id="options-list-filter3">
                            ${monthsOptions}
                        </div>
                    </div>
                `
            }
            
            option_filter2.forEach(option =>{
                option.addEventListener('click', () => {
                    console.log(option.dataset.value)
                    switch(option.dataset.value){
                        case 'week':
                            otherInputs.innerHTML = `
                                <div class="filter">
                                    <label class="chart-title" for="week">Choisir la semaine</label>
                                    <input type="week" id="week" />
                                </div>
                            `
                            return;
                        case 'month':
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
        this.generalCanvasHolder.innerHTML = `
                <div style="margin-bottom: auto;">
                    <h3>Statistiques générales</h3>
                    <div class="small-text">Changer les paramètres</div>
                </div>
        `
        this.generalCanvas.setAttribute("class", "general-canvas");
        this.generalCanvasHolder.appendChild(this.generalCanvas);
        this.generalChart.appendChild(this.generalCanvasHolder);
        
        
        this.chart = new Chart(
            this.generalCanvas,
            {
                type: 'bar',
                data: {
                  labels: [],
                  datasets: [{
                    label: '# Total des absences',
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
    async initializeChart(){
        let flt1 = this.generalChart.querySelectorAll('#choosed-option-filter1')[0]
                    .children[0].dataset.value;
        let flt2 = this.generalChart.querySelectorAll('#choosed-option-filter2')[0]
                    .children[0].dataset.value;
        let flt3 = this.generalChart.querySelectorAll('#choosed-option-filter3')[0]
                    .children[0].dataset.value;

        let [res] = await loadData(`/Admin/Inc/Api/Stats.inc.php?chart1&whom=${flt1}&time=${flt2}&date=${flt3}`)
        console.log(res)
        let labels = [];
        let data = [];
        await Promise.all(res.map(async element => {
            labels.push(element.classe.nomClasse);
            data.push(element.absence);
        }))
        this.updateChart(labels, data);
        
    }
    updateChart(labels, data){
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
    sortEtudiantsByAbsence(etudiants){
        let etudiantsSorted = [...etudiants];
        etudiantsSorted.sort((a,b) => {
            return b.absence - a.absence;
        })
        return etudiantsSorted;
    }
    handleSubmit(){
        let submitButton = this.generalChart.querySelectorAll('.submit')[0]
        submitButton.addEventListener('click', async event => {
            let flt1 = this.generalChart.querySelectorAll('#choosed-option-filter1')[0]
                        .children[0].dataset.value;
            let flt2 = this.generalChart.querySelectorAll('#choosed-option-filter2')[0]
                        .children[0].dataset.value;

            let flt3 = undefined;
            if(flt2 == 'week'){
                flt3 = this.generalChart.querySelectorAll('#week')[0].value;
            }
            else{
                flt3 = this.generalChart.querySelectorAll('#choosed-option-filter3')[0]
                        .children[0].dataset.value;
            }
            
            //  here we submit the data required to get the statistiques
            let [res] = await loadData(`/Admin/Inc/Api/Stats.inc.php?chart1&whom=${flt1}&time=${flt2}&date=${flt3}`)

            if(flt1 == 'classes'){
                let labels = [];
                let data = [];
                res.forEach(element => {
                    labels.push(element.classe.nomClasse);
                    data.push(element.absence);
                });
                this.updateChart(labels, data);
            }
            else if(flt1 == 'etudiants'){
                const etudiantsSorted = this.sortEtudiantsByAbsence(res);
                console.log(etudiantsSorted)
                let labels = [];
                let data = [];
                etudiantsSorted.forEach((element,index) => {
                    if (index > 5) return;
                    labels.push(`${element.etudiant.nom} ${element.etudiant.prenom}`);
                    data.push(element.absence);
                });
                this.updateChart(labels, data);
            }
        })
    }

    render(){
        this.configGeneralChart();
        this.initializeChart();
        this.handleSubmit();
        return this.generalChart
    }
}