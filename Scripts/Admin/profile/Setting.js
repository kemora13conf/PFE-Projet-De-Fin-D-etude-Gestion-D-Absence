import Alert from "../../Alert/Alert.js";
import { alertContainer, popContainer, loadSettings, goTo } from "../Admin.js";
import { loadData } from "../../utils.js";

export default class Setting{
    constructor(admin){
        this.admin = admin;
        this.admin_forms = document.createElement('div');
        this.form = document.createElement('form');
        this.pwd_form = document.createElement('form');
    }
    isEmpty(data){
        if(data == "") return true;
        return false;
    }
    
    async configElements(){
        this.admin_forms.setAttribute('class', 'admin-forms-container');
        this.form.setAttribute('class', 'admin-form add-update-form');
        this.form.innerHTML = `
            <div class="form-head">
                <h1 class="form-title">Changer les données</h1>
            </div>
            <img 
                id="admin-img"
                src="/Profile-pictures/Admins/${this.admin ? this.admin.image : "default.png"}" 
                class="form-image" />
            <div class="form-body">
                <div class="form-col">
                    <div class="form-group">
                        <label for="nom">Le nom</label>
                        <input 
                            type="text" 
                            required
                            id="nom" 
                            placeholder="Nom d'admin"
                            value="${this.admin != null ? this.admin.nom : ''}" />
                    </div>
                    <div class="form-group">
                        <label for="prenom">Le prenom</label>
                        <input 
                            type="text" 
                            required
                            id="prenom" 
                            placeholder="prenom d'admin"
                            value="${this.admin != null ? this.admin.prenom : ''}" />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            required
                            id="email" 
                            placeholder="Addresse email"
                            value="${this.admin != null ? this.admin.email : ''}" />
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
                            value="${this.admin.telephone}" />
                    </div>
                    <div class="form-group form-gender">
                        <label>Genre</label>
                        <div class="gender-input">
                            <input 
                                type="radio" 
                                id="homme" 
                                name="genre" 
                                ${this.admin.gender == 'Homme' ? "checked" : ''} />
                            <label for="homme" style="margin-right: 10px">Homme</label>
                            <input 
                                type="radio" 
                                id="femme" 
                                name="genre" 
                                ${this.admin.gender == 'Femme' ? "checked" : ''} />
                            <label for="femme">Femme</label>
                        </div>
                    </div>
                    <div class="form-group form-file">
                        <input type="file" id="img-file" placeholder="Choisir une image">
                    </div>
                </div>
            </div>
            <div class="form-group form-submit">
                <button class='submit' type='submit'>Modifier l'admin</button>
            </div>
        `;
        let img = this.form.querySelector('#admin-img');
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
                codeAdmin: this.admin.code,
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
            ){
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'échoué',
                    msg_text: "Tous les input sont requis!"
                }, alertContainer).render())
                return;
            };

            let formData = new FormData();
            console.log(data);
            formData.append('update-admin', JSON.stringify(data)) 

            if(imgFile.value != '') formData.append('image', imgFile.files[0]);

            fetch(
                "/Admin/Inc/Api/Admin.inc.php",
                {
                    method: 'POST',
                    body: formData,
                }
            )
            .then(res => res.json())
            .then(async res => {
                goTo(loadSettings)
                alertContainer.appendChild(new Alert({
                    type: 'success',
                    msg_title: 'Success',
                    msg_text: res.message
                }, alertContainer).render())
            })
            .catch(err => {
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'échoué',
                    msg_text: "Une erreur s'est produite. Veuillez réessayer"
                }, alertContainer).render())
            })
        })


        this.pwd_form.setAttribute('class', 'admin-pwd-form add-update-form');
        this.pwd_form.innerHTML = `
            <div class="form-head">
                <h1 class="form-title">Changer le mot de passe</h1>
            </div>
            <div class="form-body">
                <div class="form-col">
                    <div class="form-group">
                        <label for="oldPassword" class="label">L'ancien mot de passe</label>
                        <input type="password" id="oldPassword" name="oldPassword">
                    </div>
                    <div class="form-group">
                        <label for="newPassword" class="label">Nouveau mot de passe</label>
                        <input type="password" id="newPassword" name="newPassword">
                    </div>
                    <div class="form-group">
                        <label for="repeatPassword" class="label">Répéter le mot de passe</label>
                        <input type="password" id="repeatPassword" name="repeatPassword">
                    </div>
                </div>
            </div>
            <div class="form-group form-submit">
                <button class='submit' type='submit'>Changer le mot de passe</button>
            </div>
        `;
        this.pwd_form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let oldPassword = this.pwd_form.querySelector('#oldPassword');
            let newPassword = this.pwd_form.querySelector('#newPassword');
            let repeatPassword = this.pwd_form.querySelector('#repeatPassword');

            let data = {
                codeAdmin: this.admin.code,
                old_password: oldPassword.value,
                new_password: newPassword.value,
                repeated_password: repeatPassword.value,
            }

            if(
                this.isEmpty(oldPassword.value)
                || this.isEmpty(newPassword.value)
                || this.isEmpty(repeatPassword.value)
            ){
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'échoué',
                    msg_text: "Tous les input sont requis!"
                }, alertContainer).render())
                return;
            };

            let formData = new FormData();
            console.log(data);
            formData.append('update-admin-password', JSON.stringify(data)) 

            fetch(
                "/Admin/Inc/Api/Admin.inc.php",
                {
                    method: 'POST',
                    body: formData,
                }
            )
            .then(res => res.json())
            .then(async res => {
                alertContainer.appendChild(new Alert({
                    type: 'success',
                    msg_title: 'Success',
                    msg_text: res.message
                }, alertContainer).render())
            })
            .catch(err => {
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'échoué',
                    msg_text: "Une erreur s'est produite. Veuillez réessayer"
                }, alertContainer).render())
            })
        })
    }
    render(){
        this.configElements();
        this.admin_forms.append(
            this.form,
            this.pwd_form
        )
        return this.admin_forms;
    }
}