function onFocusInput(e){
    let label = e.previousElementSibling;
    let icon = e.nextElementSibling;

    label.classList.remove('label')
    label.classList.add('moveLabel')
    icon.classList.add('colorIcon')
}
function onBlurInput(e){
    let label = e.previousElementSibling;
    let icon = e.nextElementSibling;
    
    if (e.value.length == 0){
        label.classList.add('label')
        label.classList.remove('moveLabel')
    }
    icon.classList.remove('colorIcon')
}