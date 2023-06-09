
let profile_menu = document.querySelectorAll('.profile--image')[0];
let profile = document.querySelectorAll('.profile--btn')[0];

profile_menu.addEventListener('click', ()=>{
    profile.classList[1] ==  "show-profile-menu" ? profile.classList.remove('show-profile-menu') : profile.classList.add('show-profile-menu');
})
document.getElementById("profile-btn").addEventListener('click', ()=>{  
    profile.classList[1] ==  "show-profile-menu" ? profile.classList.remove('show-profile-menu') : profile.classList.add('show-profile-menu');
})

let list = document.querySelectorAll('.list');
function activeLink(){
    list.forEach(item => {
        item.classList.remove('active');
        this.classList.add('active');
    })
}
list.forEach(item => {
    item.addEventListener("click", activeLink)
})