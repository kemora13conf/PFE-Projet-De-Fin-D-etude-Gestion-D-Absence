import { getDayName, loadData } from "../../utils.js";
import { root, goTo, alertContainer } from "../Admin.js";
import Alert from "../../Alert/Alert.js";
import SeancePage from "./SeancePage.js";

export default class Seances{
    constructor(){
        this.listContainer = document.createElement('div');
        this.header = document.createElement('div');
        this.listHolder = document.createElement('div');
        this.list = document.createElement('table');
    }
    async configOptionsInput(list, choosedOption, options){
        function chooseOption(list,target,choosed){
            list.classList.toggle('show-options-list')
            options.forEach(element => {
                element.classList.remove('choosed');
                target.classList.add('choosed');
                choosed.children[0].dataset.value = target.dataset.value;
                choosed.children[0].innerHTML = target.innerHTML;
            });
        }
        options.forEach(
            element => {
                element.addEventListener(
                    'click', 
                    async (e)=>{
                        this.listContainer.classList.toggle('remove-overflow')
                        chooseOption(list,e.target, choosedOption)

                        this.createList(`/Admin/Inc/Api/Seances.inc.php?classe=${element.dataset.value}`);
                    }
                )
            }
        )
        choosedOption.addEventListener('click', () => {
            list.classList.toggle('show-options-list')
            this.listContainer.classList.toggle('remove-overflow')
        })
    }
    async createHeader(){
        let [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php`);
        let htmlOptions = '';
        res.map(classe => htmlOptions += `<div class="option" data-value="${classe.codeClasse}">Les seance de ${classe.niveauClasse} ${classe.nomClasse} </div>`)

        this.header.setAttribute('class', 'list-head');
        this.header.innerHTML = `
            <h2 class="se-header-title">liste des séances</h2>

            <div class="options">
                <div class="choosed-option" id="choosed-option">
                    <div class='the-option' data-value='-1'>Tous les seances</div>
                    <i class="fas fa-caret-down"></i>
                </div>
                <div class="options-list" id="options-list">
                    <div class="option" data-value="-1">Tous les seance</div>
                    ${htmlOptions}
                </div>
            </div>
        `
        let choosedOption = this.header.querySelector('#choosed-option');
        let optionsList = this.header.querySelector('#options-list');
        let options = this.header.querySelectorAll('.option');
        this.configOptionsInput(optionsList, choosedOption, options);
        
    }
    deleteSeance(id){
        fetch(
            `/Admin/Inc/Api/Seances.inc.php?delete=${id}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    id: id
                })
            }
        )
        .then(res => res.json())
        .then(res => {
            alertContainer.appendChild(new Alert({
                type: 'success',
                msg_title: 'Success',
                msg_text: res.message
            }, alertContainer).render())

            let id = this.header.querySelector('.the-option').dataset.value;
            this.createList(`/Admin/Inc/Api/Seances.inc.php?classe=${id}`);
            
        })
        .catch(err => {
            alertContainer.appendChild(new Alert({
                type: 'warning',
                msg_title: 'échoué',
                msg_text: "Une erreur s'est produite. Veuillez réessayer"
            }, alertContainer).render())
        })
    }
    renderRow(data){
        if(data != null){
            return `
                <tr data-id="${data.codeSeance}" class="seance">
                    <td class="classes-col">${data.niveauClass+' '+data.nomClass}</td>
                    <td class="classes-col">${data.nomMatiere}</td>
                    <td class="classes-col">${getDayName(data.jour)} - ${data.period}</td>
                    <td class="classes-col">${data.prenomProf} ${data.nomProf}</td>
                    <td class="classes-col">
                        <i class="fas fa-trash" data-id="${data.codeSeance}"></i>
                    </td>
                </tr>
            `
        }
        return `
                <tr>
                    <td class="classes-col" colspan='4' style="text-align: center;">
                        Aucune seance
                    </td>
                </tr>
            `
    }
    createListHead(){
        this.list.innerHTML = `
            <thead>
                <tr>
                    <th class="classes-col">Classes</th>
                    <th class="classes-col">Matiere</th>
                    <th class="classes-col">Temps</th>
                    <th class="classes-col">Professeur</th>
                    <th class="classes-col">Action</th>
                </tr>
            </thead>
        `
    }
    async createList(url){
        this.listHolder.setAttribute('class', 'main-list-holder');
        this.list.setAttribute('class', 'main-list');

        this.createListHead();
        let [res] = await loadData(url!=null ? url : `/Admin/Inc/Api/Seances.inc.php`)
        if (res.length == 0) {
            this.list.innerHTML += this.renderRow(null)
            return;
        }
        res.forEach(seance => {
            this.list.innerHTML += this.renderRow(seance)
        });

        let deleteBtns = this.list.querySelectorAll('.fa-trash');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteSeance(btn.dataset.id);
            });
        })
        let seances = this.list.querySelectorAll('.seance');
        seances.forEach((seance) => {
            seance.addEventListener('dblclick', () =>{
                goTo(async ()=>{
                    root.appendChild(await new SeancePage(seance.dataset.id).render());
                })
            })
        });
    }
    render(){
        this.createHeader();
        this.createList();
        this.listContainer.setAttribute('class', 'seances-list-container')
        this.listHolder.appendChild(this.list)
        this.listContainer.append(this.header, this.listHolder)
        return this.listContainer;
    }
}