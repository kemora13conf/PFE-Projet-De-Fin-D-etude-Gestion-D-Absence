import { loadData } from "../../utils.js";
import { alertContainer, popContainer } from "../Admin.js";
import Alert from "../../Alert/Alert.js";
import AddClasse from "./AddClass.js";
import EtudiantForm from "./EtudiantForm.js";

export default class EtudiantsList{
    constructor(filter=-1){
        this.filter = filter;
        this.listContainer = document.createElement("div");
        this.listHead = document.createElement("div");
        this.listHolder = document.createElement("div");
        this.list = document.createElement("table");
    }
    async renderListRow(etudiant){
        return `
            <tr class="etduiant-row" data-id="${etudiant.cne} data-classeId="${etudiant.codeClasse}">
                <td><img src="/Profile-pictures/Etudiants/${etudiant.image}"/></td>
                <td>${etudiant.orderNb}</td>
                <td>${etudiant.cne}</td>
                <td>${etudiant.nom}</td>
                <td>${etudiant.prenom}</td>
                <td>${etudiant.classe}</td>
                <td>${etudiant.birthday}</td>
                <td>
                    <div class=" action-icons">
                        <i class="fas fa-user-edit edit-etudiant" data-id="${etudiant.cne}"></i>
                        <i class="fas fa-trash delete-etudiant" data-id="${etudiant.cne}"></i>
                    </div> 
                </td>
            </tr>
        `
    }
    async configDeleteButtons(list, url){
        const deleteBtns = list.querySelectorAll('.delete-etudiant');
        deleteBtns.forEach(btn => {
            btn.addEventListener(
                'click', 
                async () => {
                    let [res] = await loadData(`/Admin/Inc/Api/Etudiants.inc.php?delete=${btn.dataset.id}`);
                    if(res && res.code==200){
                        
                        alertContainer.appendChild(new Alert({
                            type: 'success',
                            msg_title: 'Success',
                            msg_text: res.message
                        }, alertContainer).render())
                        await this.createListe(url);
                    }
                }
            )
        })
    }
    async configEditButtons(list){
        let editButtons = list.querySelectorAll('.edit-etudiant');
        editButtons = Array.prototype.slice.call(editButtons);
        editButtons.map(async btn => {
            btn.addEventListener('click', async ()=>{
                console.log('clicked');
                let [etd] = await loadData(`/Admin/Inc/Api/Etudiants.inc.php?by_cne=${btn.dataset.id}`);
                popContainer.appendChild(new EtudiantForm(list, etd).render())
                popContainer.classList.add("open-popup");
                console.log(etd)
            })
        })
    }
    async createListe(url){
        let [res] = await loadData(url);
        this.list.innerHTML = '';
        this.list.innerHTML = `
            <thead>
                <tr>
                    <td>Image</td>
                    <td>N</td>
                    <td>CNE</td>
                    <td>Nom</td>
                    <td>Prenom</td>
                    <td>Classe</td>
                    <td>Date de naissance</td>
                    <td>Action</td>
                </tr>
            </thead>
        `
        if(res.length == 0){
            this.list.innerHTML += `
                <tr>
                    <td colspan="8" class="empty-list">Aucun etudiant</td>
                </tr>
            `
            return;
        }
        await Promise.all(
            res.map(async classe => {
                let row = await this.renderListRow(classe)
                this.list.innerHTML += row;
            })
        )
        // This function config the delete button
        await this.configDeleteButtons(this.list, url)
        await this.configEditButtons(this.list)
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
                        this.listContainer.classList.remove('remove-overflow')
                        chooseOption(list,e.target, choosedOption)
                        const filter =  e.target.dataset.value;
                        await this.createListe(`/Admin/Inc/Api/Etudiants.inc.php?class=${filter}`);
                    }
                )
            }
        )
        choosedOption.addEventListener('click', () => {
            list.classList.toggle('show-options-list')
            this.listContainer.classList.toggle('remove-overflow')
        })
    }
    async configElements(){
        let [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php`);
        this.listContainer.setAttribute("class", "list-container");
        this.listHead.setAttribute("class", "list-head");
        this.listHolder.setAttribute("class", "list-holder");
        this.list.setAttribute("class", "main-list");

        let htmlOptions = '';
        let selectedOption = "<div class='option' data-value='-1'>Tous les etudiants</div>"
        if(this.filter != -1){
            console.log('filter:', this.filter)
            selectedOption = `<div class='the-option' data-value='${this.filter.codeClasse}'>${this.filter.niveauClasse}-${this.filter.nomClasse}</div>`
        }
        res.map(classe => htmlOptions += `<div class="option" data-value="${classe.codeClasse}">${classe.niveauClasse} ${classe.nomClasse} </div>`)
        this.listHead.innerHTML = `
            <h3 class="list-title">Listes des etudiants</h3>
            <div class="options">
                <div class="choosed-option" id="choosed-option">
                    ${selectedOption}
                    <i class="fas fa-caret-down"></i>
                </div>
                <div class="options-list" id="options-list">
                    <div class="option" data-value="-1">Tous les etudiants</div>
                    ${htmlOptions}
                </div>
            </div>
            <button class="list-btn list-export-btn" id="list-add-btn">
                <span class="text">Exporter la liste</span>
                <i class="fas fa-file-export"></i>
            </button>
            <button class="list-btn list-import-btn" id="list-import-btn">
                <span class="text">Importer une liste</span>
                <i class="fas fa-file-import"></i>
            </button>
            <button class="list-btn list-add-btn" id="list-add-btn">
                <span class="text">Ajouter un etudiant </span>
                <i class="fas fa-plus"></i>
            </button>
        `;
        

        let choosedOption = this.listHead.querySelector('#choosed-option');
        let optionsList = this.listHead.querySelector('#options-list');
        let options = this.listHead.querySelectorAll('.option');
        this.configOptionsInput(optionsList, choosedOption, options, this.optionClickHandler);

        let filter = choosedOption.children[0].dataset.value
        await this.createListe(`/Admin/Inc/Api/Etudiants.inc.php?class=${filter}`);

        this.listHead.querySelector(".list-add-btn").addEventListener("click",() => {
            popContainer.appendChild(new EtudiantForm(this.list).render())
            popContainer.classList.add("open-popup");
        })

        this.listHolder.appendChild(this.list);
        this.listContainer.append(
            this.listHead,
            this.listHolder
        );
        
    }

    render(){
        this.configElements();
        return this.listContainer;
    }
}