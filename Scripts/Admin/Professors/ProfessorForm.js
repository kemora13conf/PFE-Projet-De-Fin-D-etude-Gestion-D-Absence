import Alert from "../../Alert/Alert.js";
import { alertContainer, popContainer } from "../Admin.js";
import { loadData, sortEtudiantList } from "../../utils.js";

export default class ProfessorForm {
    constructor(list, professor=null){
        this.list = list;
        this.professor = professor;
        this.form = document.createElement('form');
    }
    isEmpty(data){
        if(data == "") return true;
        return false;
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
        this.form.setAttribute('class', 'professor-form add-update-form');
        this.form.innerHTML = `
            <i class="fas fa-close"></i>
            <div class="form-head">
                <h1 class="form-title">Ajouter un professor</h1>
            </div>
            <img 
                id="professor-img"
                src="/Profile-pictures/Teachers/${this.professor ? this.professor.image : "default.png"}" 
                class="form-image" />
            <div class="form-body">
                <div class="form-col">
                    <div class="form-group">
                        <label for="nom">Le nom</label>
                        <input 
                            type="text" 
                            required
                            id="nom" 
                            placeholder="Nom d'professor"
                            value="${this.professor != null ? this.professor.nomProf : ''}" />
                    </div>
                    <div class="form-group">
                        <label for="prenom">Le prenom</label>
                        <input 
                            type="text" 
                            required
                            id="prenom" 
                            placeholder="prenom d'professor"
                            value="${this.professor != null ? this.professor.prenomProf : ''}" />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            required
                            id="email" 
                            placeholder="Addresse email"
                            value="${this.professor != null ? this.professor.email : ''}" />
                    </div>
                </div>
                <div class="form-col">
                    <div class="form-group">
                        <label for="phone">Numéro du téléphone</label>
                        <input 
                            type="tel" 
                            required
                            id="phone" 
                            placeholder="numéro du téléphone"
                            value="${this.professor != null ? this.professor.telephone : ''}" />
                    </div>
                    <div class="form-group form-gender">
                        <label>Genre</label>
                        <div class="gender-input">
                            <input 
                                type="radio" 
                                id="homme" 
                                name="genre" 
                                ${this.professor != null ? this.professor.gender == 'Homme' ? "checked" : '' : ''} />
                            <label for="homme" style="margin-right: 10px">Homme</label>
                            <input 
                                type="radio" 
                                id="femme" 
                                name="genre" 
                                ${this.professor != null ? this.professor.gender == 'Femme' ? "checked" : '' : ''} />
                            <label for="femme">Femme</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="file" id="img-file" placeholder="Choisir une image">
                    </div>
                </div>
            </div>
            <div class="form-group form-submit">
                <button class="cancel" type="button">Annuler</button>
                ${
                    this.professor != null 
                    ? "<button class='submit' type='submit'>Modifier le professeur</button>"
                    : "<button class='submit' type='submit'>Ajouter le professeur</button>"
                }
            </div>
        `
        let close = this.form.querySelector('.fa-close');
        let cancel = this.form.querySelector('.cancel');
        close.addEventListener('click', this.closePopup);
        cancel.addEventListener('click', this.closePopup);

        
        let img = this.form.querySelector('#professor-img');
        let imgFile = this.form.querySelector('#img-file');
        imgFile.addEventListener('change', () => {
            let reader = new FileReader();
            reader.onload = () => {
                img.src = reader.result;
            }
            reader.readAsDataURL(imgFile.files[0]);
        })
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let nom = this.form.querySelector('#nom').value;
            let prenom = this.form.querySelector('#prenom').value;
            let email = this.form.querySelector('#email').value;
            let phone = this.form.querySelector('#phone').value;
            let isMan = this.form.querySelector('#homme').checked;

            let data = {
                nom: nom,
                prenom: prenom,
                email: email,
                phone: phone,
                gender: isMan ? "Homme" : "Femme",
            }

            if(
                this.isEmpty(nom)
                || this.isEmpty(prenom)
                || this.isEmpty(email)
                || this.isEmpty(phone)
            ) return;

            let formData = new FormData();
            if(this.professor != null){
                data.codeProf = this.professor.codeProf
                console.log(data);
                formData.append('update-professor', JSON.stringify(data)) 
            }else{
                formData.append('add-professor', JSON.stringify(data));
            }
            if(imgFile.value != '') formData.append('image', imgFile.files[0]);

            fetch(
                "/Admin/Inc/Api/Professors.inc.php",
                {
                    method: 'POST',
                    body: formData,
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
                console.log("creating list")
                await this.createListe(`/Admin/Inc/Api/Professors.inc.php`);
            })
            .catch(err => {
                console.log(`${err}`);
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'Failed',
                    msg_text: "Une erreur s'est produite. Veuillez réessayer"
                }, alertContainer).render())
            })
        })
    }
    render(){
        this.configElements();
        return this.form;
    }
}