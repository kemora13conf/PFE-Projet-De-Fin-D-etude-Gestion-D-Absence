import { loadData, downloadFile } from "../../utils.js";
import { alertContainer, popContainer } from "../Admin.js";
import Alert from "../../Alert/Alert.js";
import ProfessorForm from "./ProfessorForm.js";


export default class Professors{
    constructor(filter=-1){
        this.filter = filter;
        this.listContainer = document.createElement("div");
        this.listHead = document.createElement("div");
        this.listHolder = document.createElement("div");
        this.list = document.createElement("table");
    }
    async renderListRow(professor){
        return `
            <tr class="professor-row" data-id="${professor.codeProf}">
                <td>
                    <img src="/Profile-pictures/Teachers/${professor.image}"/>
                </td>
                <td>${professor.codeProf}</td>
                <td>${professor.nomProf}</td>
                <td>${professor.prenomProf}</td>
                <td>${professor.email}</td>
                <td>${professor.telephone}</td>
                <td>
                    <div class=" action-icons">
                        <i class="fas fa-user-edit edit-professor" data-id="${professor.codeProf}"></i>
                        <i class="fas fa-trash delete-professor" data-id="${professor.codeProf}"></i>
                    </div> 
                </td>
            </tr>
        `
    }
    async configDeleteButtons(list, url){
        const deleteBtns = list.querySelectorAll('.delete-professor');
        deleteBtns.forEach(btn => {
            btn.addEventListener(
                'click', 
                async () => {
                    let [res] = await loadData(`/Admin/Inc/Api/professors.inc.php?delete=${btn.dataset.id}`);
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
        let editButtons = list.querySelectorAll('.edit-professor');
        editButtons = Array.prototype.slice.call(editButtons);
        editButtons.map(async btn => {
            btn.addEventListener('click', async ()=>{
                console.log('clicked');
                let [prf] = await loadData(`/Admin/Inc/Api/Professors.inc.php?by_codeProf=${btn.dataset.id}`);
                popContainer.appendChild(new ProfessorForm(list, prf).render())
                popContainer.classList.add("open-popup");
                console.log(prf)
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
                    <td>code</td>
                    <td>Nom</td>
                    <td>Prenom</td>
                    <td>Email</td>
                    <td>Telephone</td>
                    <td>Action</td>
                </tr>
            </thead>
        `
        if(res.length == 0){
            this.list.innerHTML += `
                <tr>
                    <td colspan="8" class="empty-list">Aucun professor</td>
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
    
    async configElements(){
        this.listContainer.setAttribute("class", "list-container");
        this.listHead.setAttribute("class", "list-head");
        this.listHolder.setAttribute("class", "list-holder");
        this.list.setAttribute("class", "main-list");

        this.listHead.innerHTML = `
            <h3 class="list-title" style="margin-right: auto">Listes des professors</h3>
            <button class="list-btn list-export-btn" id="list-export-btn">
                <span class="text">Exporter la liste</span>
                <i class="fas fa-file-export"></i>
            </button>
            <button class="list-btn list-import-btn" id="list-import-btn">
                <span class="text">Importer une liste</span>
                <i class="fas fa-file-import"></i>
            </button>
            <button class="list-btn list-add-btn" id="list-add-btn">
                <span class="text">Ajouter un professor </span>
                <i class="fas fa-plus"></i>
            </button>
        `;

        await this.createListe(`/Admin/Inc/Api/Professors.inc.php`);

        // The add btn show the form to add a new Professor
        this.listHead
            .querySelector(".list-add-btn")
                .addEventListener("click",() => {
                    popContainer.appendChild(new ProfessorForm(this.list).render())
                    popContainer.classList.add("open-popup");
                }
            )
        
        this.listHead
            .querySelector(".list-export-btn")
                .addEventListener("click", async () => {
                    // send a request to get the professor list as an xlsx file
                    await fetch('/Admin/Inc/Api/export.inc.php?professors')
                        .then(req => {
                            return req.json()
                        })
                        .then(res => {
                            // Usage
                            var fileUrl = `/Exported-Files/${res}`
                            var fileName = res;
                            
                            downloadFile(fileUrl, fileName);
                        })
                }
            )


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