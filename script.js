
const addACardBtns = document.getElementsByClassName('add-card-container');
const cardTitleContainers = document.getElementsByClassName('card-title-container');
const addTitleBtns = document.getElementsByClassName('add-card-btn');
const cardTitles = document.getElementsByClassName('card-title');
const cancelBtn = document.getElementsByClassName('cancel-btn');
const cardContainers = document.getElementsByClassName('card-container');

let count = 0;

function createCard(title){

    let cardDetails = document.createElement('div');
    cardDetails.className = 'card-details';
    cardDetails.draggable = 'true';
    cardDetails.id = `task-${count}`;

    let card = 
    `
    <p class="task-name">${title}</p>
    <span class="material-symbols-outlined">
        edit
    </span>
    `
    count++;

    cardDetails.innerHTML = card;

    return cardDetails;
}

for(let i = 0; i < 3; i++){
    addACardBtns[i].addEventListener('click',(event) => {
        cardTitleContainers[i].style.display = 'block';
        addACardBtns[i].style.display = 'none';
    })
    addTitleBtns[i].addEventListener('click',(event) => {
        const title = cardTitles[i].value.trim();
        if(title!=='' && title!=undefined)
            cardContainers[i].appendChild(createCard(title));
        cardTitles[i].value = '';
    })
    cancelBtn[i].addEventListener('click', (event) => {
        cardTitleContainers[i].style.display = 'none';
        addACardBtns[i].style.display = 'block';
    })
}
