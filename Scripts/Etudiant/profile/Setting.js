import { loadData } from "../../utils.js";
import { root, goTo, loadSettings, alertContainer } from "../Etudiant.js";
import Alert from "../../Alert/Alert.js";

export default class Setting{
    constructor(etudiant){
        this.etudiant = etudiant;
        this.setting =  document.createElement("div");
        this.settingHead = document.createElement("div");
        this.etudiantImage = document.createElement("img");
        this.etudiantName = document.createElement("h2");
        this.settingList = document.createElement("ul");

        this.settingBody = document.createElement("div");
        this.settingInfosForm = document.createElement("form");
        this.settingPasswordForm = document.createElement("form");

    }
    createSettingHead(){
        this.settingHead.setAttribute('class', 'setting-head');
        this.etudiantImage.setAttribute('class', 'etudiant-image');

        this.etudiantImage.setAttribute('src', '/Profile-pictures/etudiants/'+this.etudiant.image)
        this.etudiantImage.setAttribute('alt', this.etudiant.nom+' '+this.etudiant.prenom);
        this.etudiantName.innerHTML = this.etudiant.nom+' '+this.etudiant.prenom;

        this.settingList.setAttribute('class', 'setting-list-container');
        this.settingList.innerHTML = `
            <li class="setting-list active">
                <button id="change-infos-btn">
                    <i class="fas fa-user awesome-icon"></i>
                    <div class="text">Changer les informations</div>
                </button>
            </li>
            <div class="setting-indicator">
                <dic class="circle"></div>
            </div>
        `
        let s_list = this.settingList.querySelectorAll('.setting-list');
        function settingActiveLink(e){
            s_list.forEach(item => {
                item.classList.remove('active');
            })
            e.classList.add('active');
        }
        s_list.forEach(item => {
            item.addEventListener("click", (e)=>{
                settingActiveLink(item)
            });
        })
        
        this.settingHead.append(this.etudiantImage, this.etudiantName, this.settingList)
    }
    createSettingInfosForm(){
        this.settingInfosForm.setAttribute('class', 'infos-form')
        this.settingInfosForm.innerHTML = `
            <h3 class="s-h3">Parametre du profile</h3>
            <div class='inputs-container'>
                <div class='inputs-side'>
                    <div class="form-group email-group">
                        <div class="input-box">
                            <label for="email" class="label">Adresse Email</label>
                            <input type="text" id="email" name="email" value="${this.etudiant.email}">
                        </div> 
                    </div>
                    <div class="form-group password-group">
                        <div class="input-box">
                            <label for="oldPassword" class="label">L'ancien mot de passe</label>
                            <input type="password" id="oldPassword" name="oldPassword">
                        </div>
                    </div>
                    <div class="form-group password-group">
                        <div class="input-box">
                            <label for="newPassword" class="label">Nouveau mot de passe</label>
                            <input type="password" id="newPassword" name="newPassword">
                        </div>
                    </div>
                    <div class="form-group password-group">
                        <div class="input-box">
                            <label for="repeatPassword" class="label">Répéter le mot de passe</label>
                            <input type="password" id="repeatPassword" name="repeatPassword">
                        </div>
                    </div>
                </div>
                <div class="image-side">
                    <div class="form-group file-input">
                        <input type="file" id="img-file" name="img-file">
                        <button class="import-img" id="imp-img-btn" type="button">
                            Choisir une image
                            <i class="fas fa-upload"></i>
                        </button>
                        <img id="p-image" src="/Profile-pictures/etudiants/${this.etudiant.image}"/>
                    </div>
                    <div class="form-group submit-group">
                        <button type="submit">Enregistrer</button>
                    </div>
                </div>
            </div>
        `

        let imgFile = this.settingInfosForm.querySelector('#img-file')
        let impBtn = this.settingInfosForm.querySelector('#imp-img-btn');
        let img = this.settingInfosForm.querySelector('#p-image')
        impBtn.addEventListener('click', () =>{
            imgFile.click();
        })
        imgFile.addEventListener('change', () => {
            let reader =  new FileReader();
            reader.onload = () => {
                img.src = reader.result;
            }
            reader.readAsDataURL(imgFile.files[0]);
        })

        this.settingInfosForm.addEventListener('submit', async (e)=>{
            e.preventDefault();
            let formData = new FormData();
            let email = this.settingInfosForm.querySelector('#email');
            let oldPassword = this.settingInfosForm.querySelector('#oldPassword');
            let newPassword = this.settingInfosForm.querySelector('#newPassword');
            let repeatPassword = this.settingInfosForm.querySelector('#repeatPassword');

            let data = {
                email: email.value,
                old_password: oldPassword.value,
                new_password: newPassword.value,
                repeated_password: repeatPassword.value,
            }
            console.log(data)
            formData.append('data', JSON.stringify(data))
            if(imgFile.files.length > 0) formData.append('image', imgFile.files[0])

            fetch('/Etudiant/Inc/Api/UpdateInfos.inc.php',{
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(res =>{
                if(res.code == 200){
                    goTo(loadSettings)
                    alertContainer.appendChild(new Alert({
                        type: 'success',
                        msg_title: 'Success',
                        msg_text: res.message
                    }, alertContainer).render())
                }else{
                    alertContainer.appendChild(new Alert({
                        type: 'warning',
                        msg_title: 'Failed',
                        msg_text: res.message
                    }, alertContainer).render())
                }
            })
            .catch(err => {
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'Failed',
                    msg_text: "Une erreur s'est produite. Veuillez réessayer"
                }, alertContainer).render())
            })
        })
    }
    render(){
        this.createSettingHead();
        this.createSettingInfosForm();

        this.setting.setAttribute("class", "setting");
        this.settingBody.setAttribute("class", "setting-body");

        this.settingBody.appendChild(this.settingInfosForm)
        this.setting.append(this.settingHead, this.settingBody);
        return this.setting;
    }
}