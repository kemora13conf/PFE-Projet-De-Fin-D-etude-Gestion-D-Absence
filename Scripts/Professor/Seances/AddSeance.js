import { loadData, parseHour } from "../../utils";
import Alert from "../../Alert/Alert.js";
import { alertContainer } from "../Professor.js";
import SeanceList from "./SeancesList.js"; 

export default class AddSeance{
    constructor(parent){
        this.parent = parent;
        this.addSeance = document.createElement('div');
        this.header = document.createElement('div');
        this.form = document.createElement('form');
        this.right = document.createElement('div');
        this.left = document.createElement('div');

        this.Classes = document.createElement('div');
        this.Subjects = document.createElement('div');
        this.Days = document.createElement('div');
        this.Hours = document.createElement('div');
        this.Period = document.createElement('div');
        this.submit = document.createElement('button');
    }
    createHeader(){
        this.header.setAttribute('class', 'se-header');
        this.header.innerHTML = `
            <h2 class="se-header-title">Ajouter une séance</h2>
        `
    }
    chooseDate(list,target,choosed, options){
        list.classList.toggle('show-options-list')
        options.forEach(element => {
            element.classList.remove('choosed');
            target.classList.add('choosed');
            choosed.children[0].dataset.value = target.dataset.value;
            choosed.children[0].innerHTML = target.innerHTML;
        });
    }
    isEmpty(data){
        if(data == "") return true;
        return false;
    }
    async createClassesInpt(){
        this.Classes.setAttribute('class', 'form-group form-classes');
        let [res] = await loadData('/Professor/Inc/Api/Class.inc.php');
        let classes = ''
        res.forEach(item => {
            classes += `<div class="option" data-value="${item.codeClasse}">${item.niveauClasse} ${item.nomClasse}</div>`
        });
        this.Classes.innerHTML = `
            <label>Choisir la classe</label>
            <div class="filter">
                <div class="choosed-option" id="choosed-option">
                    <div class="the-date" data-value="">Choisir une classe</div>
                    <i class="fas fa-caret-down"></i>
                </div>
                <div class="options-list" id="options-list">
                    ${classes}
                </div>
            </div>
            `
        let choosedDate = this.Classes.querySelector('#choosed-option');
        let optionsList = this.Classes.querySelector('#options-list');
        let options = this.Classes.querySelectorAll('.option');

        options.forEach(element => element.addEventListener('click', async (e)=>{
            this.chooseDate(optionsList,e.target, choosedDate, options)
        }))
        choosedDate.addEventListener('click', () => {
            optionsList.classList.toggle('show-options-list')
        })
    }
    async createSubjectsInpt(){
        this.Subjects.setAttribute('class', 'form-group form-subjects');
        let [res] = await loadData('/Professor/Inc/Api/Subjects.inc.php');
        let subjects = ''
        res.forEach(item => {
            subjects += `<div class="option" data-value="${item.codeMatiere}">${item.nomMatiere}</div>`
        });
        this.Subjects.innerHTML += `
            <label>Choisir la matiere</label>
            <div class="filter">
                <div class="choosed-option" id="choosed-option">
                    <div class="the-date" data-value="">Choisir une Matiere</div>
                    <i class="fas fa-caret-down"></i>
                </div>
                <div class="options-list" id="options-list">
                    ${subjects}
                </div>
            </div>
        `
        let choosedOption = this.Subjects.querySelector('#choosed-option');
        let optionsList = this.Subjects.querySelector('#options-list');
        let options = this.Subjects.querySelectorAll('.option');

        options.forEach(element => element.addEventListener('click', async (e)=>{
            this.chooseDate(optionsList,e.target, choosedOption, options)
        }))
        choosedOption.addEventListener('click', () => {
            optionsList.classList.toggle('show-options-list')
        })
    }
    createDaysInpt(){
        this.Days.setAttribute('class', 'form-group form-days');
        let DAYS = {1:'Lundi', 2:'Mardi', 3:'Mercredi', 4:'Jeudi', 5:'Vendredi', 6:'Samedi'}
        let days = ''
        Object.keys(DAYS)
            .forEach(key => {
                days += `<div class="option" data-value="${key}">${Object.values(DAYS)[key-1]}</div>`
            })
        this.Days.innerHTML += `
            <label>Choisir le jour</label>
            <div class="filter">
                <div class="choosed-option" id="choosed-option">
                    <div class="the-date" data-value="">Choisir un Jour</div>
                    <i class="fas fa-caret-down"></i>
                </div>
                <div class="options-list" id="options-list">
                    ${days}
                </div>
            </div>
        `
        let choosedDate = this.Days.querySelector('#choosed-option');
        let optionsList = this.Days.querySelector('#options-list');
        let options = this.Days.querySelectorAll('.option');

        options.forEach(element => element.addEventListener('click', (e)=>{
            this.chooseDate(optionsList,e.target, choosedDate, options)
        }))
        choosedDate.addEventListener('click', () => {
            optionsList.classList.toggle('show-options-list')
        })
    }
    createHoursInpt(){
        this.Hours.setAttribute('class', 'form-group form-hours');
        let hours = ''
        for(let i=1; i<=8; i++){
            hours += `<div class="option" data-value="${i}">${parseHour(i)}</div>`
        }
        this.Hours.innerHTML += `
            <label>Choisir l'heure de debut</label>
            <div class="filter">
                <div class="choosed-option" id="choosed-option">
                    <div class="the-date" data-value="">Choisir une heure</div>
                    <i class="fas fa-caret-down"></i>
                </div>
                <div class="options-list" id="options-list">
                    ${hours}
                </div>
            </div>
        `
        let choosedOption = this.Hours.querySelector('#choosed-option');
        let optionsList = this.Hours.querySelector('#options-list');
        let options = this.Hours.querySelectorAll('.option');

        options.forEach(element => element.addEventListener('click', (e)=>{
            this.chooseDate(optionsList,e.target, choosedOption, options)
        }))
        choosedOption.addEventListener('click', () => {
            optionsList.classList.toggle('show-options-list')
        })
    }
    createPeriodInpt(){
        this.Period.setAttribute('class', 'form-group form-period');
        let counter = 1;
        this.Period.innerHTML += `
            <label>Choisir la duree</label>
            <div class="periodInpt">
                <span id="minus">-</span>
                <div class="period">
                    <div id="periodValue">${counter}</div> heure
                </div>
                <span id="plus">+</span>
            </div>
            <span class="error"></span>
        `
        const period = this.Period.querySelector('#periodValue');
        const minus = this.Period.querySelector('#minus');
        const plus = this.Period.querySelector('#plus');
        minus.addEventListener(
            'click',
            ()=>{
                counter--;
                if(counter < 1) counter = 1;
                if(counter > 4) counter = 4;
                period.innerHTML = counter;
                
            })
        plus.addEventListener(
            'click',
            ()=>{
                counter++;
                if(counter < 1) counter = 1;
                if(counter > 4) counter = 4;
                period.innerHTML = counter;
            })
    }
    createForm(){
        this.createClassesInpt();
        this.createSubjectsInpt();
        this.createDaysInpt();
        this.createHoursInpt();
        this.createPeriodInpt();
        this.form.setAttribute('class', 'se-form');
        this.right.setAttribute('class', 'rightInpts');
        this.left.setAttribute('class', 'leftInpts');
        
        this.submit.setAttribute('class','submit');
        this.submit.innerHTML = 'Ajouter une séance';
        this.right
                .append(
                    this.Classes,
                    this.Subjects,
                    this.Days
                )
        this.left
                .append(
                    this.Hours,
                    this.Period,
                    this.submit
                )
        this.form.append(this.right, this.left)
        
        this.form
            .addEventListener(
                'submit',
                    event => {
                        event.preventDefault();
                        let formData = new FormData();
                        const classe = this.Classes.querySelector('.the-date').dataset.value
                        const subject = this.Subjects.querySelector('.the-date').dataset.value
                        const day = this.Days.querySelector('.the-date').dataset.value
                        const hour = this.Hours.querySelector('.the-date').dataset.value
                        const period = this.Period.querySelector('#periodValue').innerHTML
                        if(
                            this.isEmpty(classe) ||
                            this.isEmpty(subject) ||
                            this.isEmpty(day) ||
                            this.isEmpty(hour) ||
                            this.isEmpty(period)
                        ){
                            alertContainer.appendChild(new Alert({
                                type: 'warning',
                                msg_title: 'Anonce',
                                msg_text: 'Tous les input doivent etre remplir'
                            }, alertContainer).render())
                            return;
                        }
                        const data = 
                        {
                            'codeClasse' : classe,
                            'codeMatiere' : subject,
                            'jour' : day,
                            'heure' : hour,
                            'periode' : period
                        }
                        formData.append('data', JSON.stringify(data))
                        formData.append('submit', 'submit');
                        console.log(JSON.stringify(data))
                        fetch(
                            '/Professor/Inc/Api/AddSeance.inc.php',
                            {
                                method: 'POST',
                                body: formData
                            }
                        )
                        .then(res => res.json())
                        .then(res =>{
                            alertContainer.appendChild(new Alert({
                                type: 'success',
                                msg_title: 'Success',
                                msg_text: res.message
                            }, alertContainer).render())
                            this.parent.innerHTML = '';
                            this.parent.appendChild(new SeanceList().render())
                        })
                        .catch(err => {
                            alertContainer.appendChild(new Alert({
                                type: 'warning',
                                msg_title: 'Failed',
                                msg_text: "Une erreur s'est produite. Veuillez réessayer"
                            }, alertContainer).render())
                        })
                    })
    } // End of the createForm function

    render(){
        this.createHeader();
        this.createForm()
        this.addSeance.setAttribute('class', 'seances-list-container')
        this.addSeance.append(this.header, this.form)
        return this.addSeance
    }
}