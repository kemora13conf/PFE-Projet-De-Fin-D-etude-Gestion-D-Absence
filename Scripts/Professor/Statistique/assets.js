function configChoosedOption(list,target,choosed, options){
    list.classList.toggle('show-options-list')
    options.forEach(element => {
        element.classList.remove('choosed');
        target.classList.add('choosed');
        choosed.children[0].dataset.value = target.dataset.value;
        choosed.children[0].innerHTML = target.innerHTML;
    });
}

function configInputGroup(parent,choosedElementId, optionsListId, optionsClassName){
    let choosedOption = parent.querySelector(choosedElementId);
    let optionsList = parent.querySelector(optionsListId);
    let options = parent.querySelectorAll(optionsClassName);

    options.forEach(element => element.addEventListener('click', async (e)=>{
        configChoosedOption(optionsList,e.target, choosedOption, options)
    }))
    choosedOption.addEventListener('click', () => {
        optionsList.classList.toggle('show-options-list')
    })
}

export {
    configChoosedOption,
    configInputGroup
}