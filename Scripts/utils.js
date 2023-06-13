async function loadData(url){
    let req = await fetch(url)
    let res = await req.json()
    return [res,req];
}
function wichHourNow(){
    switch(new Date().getHours().toString()){
        case '08' : return 1;
        case '09' : return 2;
        case '10' : return 3;
        case '11' : return 4;
        case '14' : return 5;
        case '15' : return 6;
        case '16' : return 7;
        case '17' : return 8;
    }
}
function getDayName(day){
    switch(day){
        case '1' : return 'Lundi';
        case '2' : return 'Mardi';
        case '3' : return 'Mercredi';
        case '4' : return 'Jeudi';
        case '5' : return 'Vendredi';
        case '6' : return 'Samedi';
    }
}
function parseHour(hour){
    switch (hour){
        case 1: return '08:30';
        case 2: return '09:30';
        case 3: return '10:30';
        case 4: return '11:30';
        case 5: return '14:30';
        case 6: return '15:30';
        case 7: return '16:30';
        case 8: return '17:30';
    }
}

// Function to download a file
function downloadFile(url, fileName) {
  var link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // Trigger the click event
  link.click();

  // Cleanup the dynamically created element
  link.remove();
}

function sortEtudiantList(data){
    let arr = data
    let isTrue = true;
    while(isTrue){
        isTrue = false;
        for(let i=0; i<data.length - 1; i++){
            if(
                Number(arr[i].orderNb) > Number(data[i+1].orderNb)
            ){
                let temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
                isTrue = true;
            }
        }
    }
    return arr;
}
export { loadData, wichHourNow, getDayName, parseHour, downloadFile, sortEtudiantList }