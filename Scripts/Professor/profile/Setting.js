import { loadData } from "../../utils";
import { root, goTo, loadSettings } from "../Professor.js";
import { alertContainer } from "../Professor.js";
import Alert from "../../Alert/Alert.js";

export default class Setting{
    constructor(teacher){
        this.teacher = teacher;
        this.setting =  document.createElement("div");
        this.settingHead = document.createElement("div");
        this.teacherImage = document.createElement("img");
        this.teacherName = document.createElement("h2");
        this.settingList = document.createElement("ul");

        this.settingBody = document.createElement("div");
        this.settingInfosForm = document.createElement("form");
        this.settingPasswordForm = document.createElement("form");

    }
    createSettingHead(){
        this.settingHead.setAttribute('class', 'setting-head');
        this.teacherImage.setAttribute('class', 'teacher-image');

        this.teacherImage.setAttribute('src', '/Profile-pictures/Teachers/'+this.teacher.image)
        this.teacherImage.setAttribute('alt', this.teacher.nomProf+' '+this.teacher.prenomProf);
        this.teacherName.innerHTML = this.teacher.nomProf+' '+this.teacher.prenomProf;

        this.settingList.setAttribute('class', 'setting-list-container');
        this.settingList.innerHTML = `
            <li class="setting-list active">
                <button id="change-infos-btn">
                    <i class="fas fa-user awesome-icon"></i>
                    <div class="text">Changer les informations</div>
                </button>
            </li>
            <li class="setting-list">
                <button id="change-pwd-btn">    
                    <i class="fas fa-lock awesome-icon"></i>                  
                    <div class="text">Changer le mot de passe</div>
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

        let cib = this.settingList.querySelector('#change-infos-btn'); // change infos button
        let cpb = this.settingList.querySelector('#change-pwd-btn'); // change password button
        
        cib.addEventListener('click', () => {
            this.settingBody.children[0].classList.add('remove-content')
            setTimeout(()=>{
                this.settingBody.innerHTML = '';
                this.settingBody.appendChild(this.settingInfosForm);
                this.settingInfosForm.classList.remove('remove-content');
            }, 250)
        })
        cpb.addEventListener('click', () => {
            this.settingBody.children[0].classList.add('remove-content')
            setTimeout(()=>{
                this.settingBody.innerHTML = '';
                this.settingBody.appendChild(this.settingPasswordForm);
                this.settingPasswordForm.classList.remove('remove-content');
            }, 250)
        })
        
        this.settingHead.append(this.teacherImage, this.teacherName, this.settingList)
    }
    createSettingInfosForm(){
        this.settingInfosForm.setAttribute('class', 'infos-form')
        this.settingInfosForm.innerHTML = `
            <h3 class="s-h3">Parametre du profile</h3>
            <div class='inputs-container'>
                <div class='inputs-side'>
                    <div class="form-group prenom-group">
                        <div class="input-box">
                            <label for="prenom" class="label">Votre Prenom</label>
                            <input type="text" id="prenom" name="prenom" value="${this.teacher.prenomProf}">
                        </div> 
                    </div>
                    <div class="form-group nom-group">
                        <div class="input-box">
                            <label for="nom" class="label">Votre Nom</label>
                            <input type="text" id="nom" name="nom" value="${this.teacher.nomProf}">
                        </div> 
                    </div>
                    <div class="form-group phone-group">
                        <div class="input-box">
                            <label for="phone" class="label">Telephone</label>
                            <input type="text" id="telephone" name="phone" value="${this.teacher.telephone}">
                        </div> 
                    </div>
                    <div class="form-group email-group">
                        <div class="input-box">
                            <label for="email" class="label">Adresse Email</label>
                            <input type="text" id="email" name="email" value="${this.teacher.email}">
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
                        <img id="p-image" src="/Profile-pictures/Teachers/${this.teacher.image}"/>
                    </div>
                    <div class="form-group gender-group">
                        <div class="male">
                            <input type="radio" id="male" class="gender" value="Homme" name="gender">
                            <label for="male">Hommme</label>
                        </div>
                        <div class="female">
                            <input type="radio" id="female" class="gender" value="Femme" name="gender">
                            <label for="female">Femme</label>
                        </div>
                    </div>
                    <div class="form-group submit-group">
                        <button type="submit">Enregistrer</button>
                    </div>
                </div>
            </div>
        `
        let male =  this.settingInfosForm.querySelector('#male');
        let female =  this.settingInfosForm.querySelector('#female');
        if(this.teacher.gender == 'Homme'){
            male.setAttribute('checked', 'checked');
        }else{
            female.setAttribute('checked', 'checked');
        }

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
            let nom = this.settingInfosForm.querySelector('#nom');
            let prenom = this.settingInfosForm.querySelector('#prenom');
            let email = this.settingInfosForm.querySelector('#email');
            let telephone = this.settingInfosForm.querySelector('#telephone');
            let gender = this.settingInfosForm.querySelectorAll('.gender');

            let data = {
                nom: nom.value,
                prenom: prenom.value,
                telephone: telephone.value,
                email: email.value,
                gender: gender[0].checked ? 'Homme' : 'Femme'
            }
            console.log(data)
            formData.append('data', JSON.stringify(data))
            if(imgFile.files.length > 0) formData.append('image', imgFile.files[0])

            fetch('/Professor/Inc/Api/UpdateInfos.inc.php',{
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
    createSettingPasswordForm(){
        this.settingPasswordForm.setAttribute('class', 'password-form')
        this.settingPasswordForm.innerHTML = `
            <h3 class="s-h3">Parametre du profile</h3>
            <div class="inputs-side">
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
                <div class="form-group submit-group">
                    <button type="submit">Changer le mot de passe</button>
                </div>
            </div>
        `
        this.settingPasswordForm.addEventListener('submit', async (e)=>{
            e.preventDefault();
            let formData = new FormData();
            let oldPassword = this.settingPasswordForm.querySelector('#oldPassword');
            let newPassword = this.settingPasswordForm.querySelector('#newPassword');
            let repeatPassword = this.settingPasswordForm.querySelector('#repeatPassword');

            let data = {
                old_password: oldPassword.value,
                new_password: newPassword.value,
                repeated_password: repeatPassword.value,
            }
            formData.append('data', JSON.stringify(data))

            fetch('/Professor/Inc/Api/UpdatePassword.inc.php',{
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(res =>{
                if(res.code == 200){
                    goTo(loadSettings)
                    alertContainer.appendChild(new Alert({
                        type: 'success',
                        msg_title: 'Success',
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
        this.createSettingPasswordForm();

        this.setting.setAttribute("class", "setting");
        this.settingBody.setAttribute("class", "setting-body");

        this.settingBody.appendChild(this.settingInfosForm)
        this.setting.append(this.settingHead, this.settingBody);
        return this.setting;
    }
}