import ClassCard from "./ClassCard.js";
import { loadData } from "../../utils.js";

export default class ListClasses{
    constructor(currentUser){
        this.currentUser = currentUser;
        this.container = document.createElement('div');
        this.teacher_div = document.createElement('div');
        this.filter_section = document.createElement('div');

        this.filter_classes = document.createElement('div');
        this.filter_all = document.createElement('button');
        this.filter_sl_only = document.createElement('button');
        this.filter_fl_only = document.createElement('button');

        // this.search_form = document.createElement('form');
        this.date_form = document.createElement('form');
        this.filter_dates = document.createElement('div');
        this.choosed_date = document.createElement('div');
        this.dates_list = document.createElement('div');
        this.classes_card = document.createElement('div');
    }
    changeStrong(target){
        let list = this.filter_classes.querySelectorAll('.level-filter')
        list.forEach(element=>{
            element.classList.remove('strong');
        })
        target.classList.add('strong');
    }
    loadClasses(filter){
        let day = this.choosed_date.children[0].dataset.value; // get the choosen day
        let date = this.choosed_date.children[0].dataset.date; // get the choosen date
        this.createClassesComponent(date, `/Professor/Inc/Api/Seances.inc.php?jour=${day}&filter=${filter}`);
    }
    createTeacherComponent(){
        let genderWord = this.currentUser.gender == "Homme" ? "M" : "Mme";
        this.teacher_div.setAttribute('class', 'teacher');
        this.teacher_div.innerHTML = `<h1>BIENVENUE ${genderWord+". "+this.currentUser.nomProf}</h1>`;
        this.teacher_div.innerHTML += `<div class="time-now">${new Date().getHours()+" : "+(new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes())}</div>`
    }
    createFilterComponent(){
        this.filter_section.setAttribute('class', 'filter-section');
        // the class filter elements
        this.filter_classes.setAttribute('class', 'filter-classes');

        // config the filter level buttons and their events
        this.filter_all.addEventListener('click', ()=>{
            this.changeStrong(this.filter_all);
            this.classes_card.dataset.filter = 'all';
            this.loadClasses('all');
        })
        this.filter_all.setAttribute('class', 'level-filter strong');
        this.filter_all.innerHTML = 'Tous les classes';

        this.filter_sl_only.addEventListener('click', ()=>{
            this.changeStrong(this.filter_sl_only);
            this.classes_card.dataset.filter = 'second';
            this.loadClasses('second');
        })
        this.filter_sl_only.setAttribute('class', 'level-filter');
        this.filter_sl_only.innerHTML = '2 éme années';

        this.filter_fl_only.addEventListener('click', ()=>{
            this.changeStrong(this.filter_fl_only);
            this.classes_card.dataset.filter = 'first';
            this.loadClasses('first');
        })
        this.filter_fl_only.setAttribute('class', 'level-filter');
        this.filter_fl_only.innerHTML = '1 er années';
        this.filter_classes.append(this.filter_all,this.filter_sl_only,this.filter_fl_only);

        // config the search field
        // this.search_form.setAttribute('class','filter-search')
        // this.search_form.innerHTML =`\n
        //                             <input type="search" id="search-box" name="search-text" placeholder="Recherche classe">
        //                             <button type="submit name="submit"><i class="fas fa-search"></i></button>
        //                             `;
        // this.search_form.addEventListener('submit', e => {
        //     e.preventDefault();
        // })


        // the date filter elements
        function getDayName(stimp){
            var date = new Date(stimp);
            return date.toLocaleDateString('fr-FR', { weekday: 'long' });        
        }
        function getDate(stimp){
            let date = new Date(stimp);
            let month = date.getMonth() + 1; // getMonth() returns a zero-based index, so we need to add 1
            let day = date.getDate();
            let year = date.getFullYear();

            // Add leading zeros to month and day if they are less than 10
            if (month < 10) {
                month = "0" + month;
            } 
            if (day < 10) {
                day = "0" + day;
            }
            return year + "-" + month + "-" + day;
        }
        function weekDays(stimp){
            let date = new Date(stimp)
            let list = '';
            for (let i = 0; i < 7; i++){
                list += `<div   class="option" 
                                data-date="${getDate(stimp)}"
                                data-value="${new Date(stimp).getDay()}">
                                ${getDayName(stimp)+" "+getDate(stimp)}
                        </div>`;
                stimp = date.setDate(date.getDate() - 1);
            }
            return list;
        }
        let today = new Date().getTime();
        this.date_form.setAttribute('class', 'filter-date');
        this.filter_dates.setAttribute('class', 'filter-dates');
        this.choosed_date.setAttribute('class', 'choosed-option');
        this.choosed_date.setAttribute('id', 'choosed-option');
        this.choosed_date.innerHTML = `\
        \   <div class="the-date" data-date="${getDate(today)}" data-value="${new Date(today).getDay()}">${getDayName(today)+" "+getDate(today)}</div>
        \   <i class="fas fa-caret-down"></i>
            `
        this.dates_list.setAttribute('class', 'options-list');
        this.dates_list.setAttribute('id', 'options-list');
        this.dates_list.innerHTML = weekDays(today); // generate all the option
        this.filter_dates.append(this.choosed_date,this.dates_list);

        let options = this.filter_dates.querySelectorAll('.option');
        function chooseDate(list,target,choosedDate){
            list.classList.toggle('show-options-list')
            options.forEach(element => {
                element.classList.remove('choosed');
                target.classList.add('choosed');
                choosedDate.children[0].dataset.value = target.dataset.value;
                choosedDate.children[0].dataset.date = target.dataset.date;
                choosedDate.children[0].innerHTML = target.innerHTML;
            });
        }
        options.forEach(element => element.addEventListener('click', (e)=>{
            chooseDate(this.dates_list,e.target, this.choosed_date)
            this.loadClasses(this.classes_card.dataset.filter)
        }))
        this.choosed_date.addEventListener('click', () => {
            this.dates_list.classList.toggle('show-options-list')
        })

        this.date_form.appendChild(this.filter_dates)
        this.filter_section.append(this.filter_classes, /*this.search_form,*/ this.date_form)
    }
    async createClassesComponent(date, url){
        this.classes_card.setAttribute('class', 'classes-cards')
        let [res] = await loadData(url) // get all the seances from the api
        this.classes_card.innerHTML = '';
        if (res.length != 0 ){
            res.forEach(seance => {
                this.classes_card.appendChild(new ClassCard(seance, date).render())
            })
        }else this.classes_card.innerHTML = 'Aucune seance aujourd\'hui';
    }
    render(){
        this.createTeacherComponent();
        this.createFilterComponent();
        let day = this.choosed_date.children[0].dataset.value; // get the choosen day
        let date = this.choosed_date.children[0].dataset.date; // get the choosen date
        this.classes_card.dataset.filter = 'all'
        this.createClassesComponent(date,`/Professor/Inc/Api/Seances.inc.php?jour=${day}&filter=all`);

        this.container.setAttribute('class','liste-classes-container');
        this.container.append(this.teacher_div, this.filter_section,this.classes_card);

        return this.container;
    }
}