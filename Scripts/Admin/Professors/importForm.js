import Alert from "../../Alert/Alert.js";
import { alertContainer, popContainer } from "../Admin.js";
import { loadData, downloadFile } from "../../utils.js";

export default class ImportForm {
    constructor(list, professor=null){
        this.list = list;
        this.professor = professor;
        this.form = document.createElement('form');
    }
    closePopup(){
        popContainer.classList.add('close-popup');
        setTimeout(() => {
            popContainer.removeChild(popContainer.children[0]);
            popContainer.classList.remove('close-popup');
            popContainer.classList.remove('open-popup');
        }, 500)
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
        this.form.setAttribute('class', 'import-professor-form add-update-form');
        this.form.innerHTML = `
            <i class="fas fa-close"></i>
            <div class="form-head">
                <h1 class="form-title">Importer une listes</h1>
                <button class="import-btn">Télécharger un modèle</button>
            </div>
            <div class="form-body">

                <div class="form-col">
                    <div class="form-group">
                        <input type="file" id="list-file" placeholder="Choisir une image">
                    </div>
                </div>
            </div>
            <div class="form-group form-submit">
                <button class="cancel" type="button">Annuler</button>
                <button class='submit' type='submit'>Importer la liste</button>
            </div>
        `
        let close = this.form.querySelector('.fa-close');
        let cancel = this.form.querySelector('.cancel');
        let importBtn = this.form.querySelector('.import-btn');

        close.addEventListener('click', this.closePopup);
        cancel.addEventListener('click', this.closePopup);
        importBtn.addEventListener('click', async ()=>{
            // send a request to get the professor list as an xlsx file
            await fetch('/Admin/Inc/Api/export.inc.php?professors-template')
            .then(req => {
                return req.json()
            })
            .then(res => {
                // Usage
                var fileUrl = `/Exported-Files/${res}`
                var fileName = res;
                
                downloadFile(fileUrl, fileName);
            })
        })

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let file =  this.form.querySelector('#list-file')

            if (file.files.length != 0) {
                let formData = new FormData();
                formData.append('professors', true);
                formData.append('list', file.files[0])

                await fetch(
                    '/Admin/Inc/Api/import.inc.php',
                    {
                        method: 'POST',
                        body: formData
                    }
                )
                .then(res => res.json())
                .then(async res => {
                    this.closePopup();
                    alertContainer.appendChild(new Alert({
                        type: 'success',
                        msg_title: 'Success',
                        msg_text: res.message
                    }, alertContainer).render())
                    
                    await this.createListe(`/Admin/Inc/Api/Professors.inc.php`);
                })
                .catch(err => {
                    this.closePopup();
                    alertContainer.appendChild(new Alert({
                        type: 'warning',
                        msg_title: 'échoué',
                        msg_text: "Une erreur s'est produite. Veuillez réessayer"
                    }, alertContainer).render())
                });
            }
        });
    }
    render(){
        this.configElements();
        return this.form;
    }
}