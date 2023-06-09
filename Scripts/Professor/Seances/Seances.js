import { loadData } from "../../utils";
import { root, goTo, loadSettings } from "../Professor.js";
import SeanceList from "./SeancesList.js";
import AddSeance from "./AddSeance.js";

export default class Seances{
    constructor(teacher){
        this.teacher = teacher;
        this.setting =  document.createElement("div");
        this.settingHead = document.createElement("div");
        this.teacherImage = document.createElement("img");
        this.teacherName = document.createElement("h2");
        this.settingList = document.createElement("ul");
        this.settingBody = document.createElement("div");

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
                <button id="show-seances">
                    <svg class="icon" viewBox="0 0 35 31" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 4.42857C0 1.98594 1.96191 0 4.375 0H30.625C33.0381 0 35 1.98594 35 4.42857V26.5714C35 29.0141 33.0381 31 30.625 31H4.375C1.96191 31 0 29.0141 0 26.5714V4.42857ZM4.375 8.85714V26.5714H15.3125V8.85714H4.375ZM30.625 8.85714H19.6875V26.5714H30.625V8.85714Z" />
                    </svg>
                    <div class="text">Liste des seance</div>
                </button>
            </li>
            <li class="setting-list">
                <button id="add-seance">
                    <i class="fas fa-plus awesome-icon"></i>                      
                    <div class="text">Ajouter une seance</div>
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

        let sc = this.settingList.querySelector('#show-seances'); // change infos button
        let as = this.settingList.querySelector('#add-seance'); // change password button
        
        sc.addEventListener('click', () => {
            this.settingBody.children[0].classList.add('remove-content')
            setTimeout(()=>{
                this.settingBody.innerHTML = '';
                this.settingBody.appendChild(new SeanceList().render());
            }, 250)
        })
        as.addEventListener('click', () => {
            this.settingBody.children[0].classList.add('remove-content')
            setTimeout(()=>{
                this.settingBody.innerHTML = '';
                this.settingBody.appendChild(new AddSeance(this.settingBody).render());
            }, 250)
        })
        
        this.settingHead.append(this.teacherImage, this.teacherName, this.settingList)
    }
    
    render(){
        this.createSettingHead();

        this.setting.setAttribute("class", "setting");
        this.settingBody.setAttribute("class", "setting-body");
        this.settingBody.appendChild(new SeanceList().render());
        this.setting.append(this.settingHead, this.settingBody);
        return this.setting;
    }
}