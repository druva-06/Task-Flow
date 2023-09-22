
const addACardBtns = document.getElementsByClassName('add-card-container');
const cardTitleContainers = document.getElementsByClassName('card-title-container');
const addTitleBtns = document.getElementsByClassName('add-card-btn');
const cardTitles = document.getElementsByClassName('card-title');
const cancelBtn = document.getElementsByClassName('cancel-btn');
const cardContainers = document.getElementsByClassName('card-container');
const taskContainers = document.getElementsByClassName('assignment')
const statusMoreBtn = document.getElementsByClassName('status-more-btn')
const taskPanelBackground = document.getElementsByClassName('task-panel-background')[0]
const taskPanel = document.getElementsByClassName('task-panel')[0]
const taskPanelcancelBtn = document.getElementsByClassName('task-panel-cancel-btn')[0]
const taskPanelTitle = document.getElementsByClassName('task-panel-title')[0]
const taskPanelDescription = document.getElementsByClassName('task-panel-description')[0]
const taskPanelSaveBtn = document.getElementsByClassName('task-panel-save-btn')[0]
const taskPanelDeleteBtn = document.getElementsByClassName('task-panel-delete-btn')[0]
const logoutBtn = document.getElementsByClassName('logout-btn')[0]

const baseUrl = 'https://troubled-spade-production.up.railway.app/'
//const baseUrl = 'http://localhost:8080/'

const frontendUrl = 'https://druva-06.github.io/Task-Flow-Frontend'
//const frontendUrl = 'http://127.0.0.1:5500'


/* Store the unique tokens */
const tokenList = new Set(); /* DB Related */

/* Type of Tasks */
const taskTypes = ['TODO','DOING','DONE']
const taskTypesMap = {
    'TODO':0,
    'DOING':1,
    'DONE':2
}

/* current task id */
let currTaskId; 

/* Generate the token */
async function generateToken(){
    const response = await fetch(`${baseUrl}task/token`)
    const {message} = await response.json()
    return message;
}

/* Create the task object */
async function createTaskObj(token,title,type){ /* DB Related */
    let url = `${baseUrl}task/add`
    let taskObj = {
        description: '',
        'status': type,
        title: title,
        token: token,
        'emailId':localStorage.getItem('emailId')
    }
    let response = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskObj),
    })
    let msg = await response.json()
    return taskObj
}

/* Create card with the title */
async function createCard(title, type, token){

    if(token===undefined){
        token = await generateToken()
        let taskObj = await createTaskObj(token,title,type); /* DB Related */
    }

    let cardDetails = document.createElement('div');
    cardDetails.className = 'card-details';
    cardDetails.draggable = 'true';
    cardDetails.id = `${token}`;

    let card = 
    `
    <p class="task-name">${title}</p>
    <span class="material-symbols-outlined">
        edit
    </span>
    `

    cardDetails.innerHTML = card;

    return cardDetails;
}

/* Dragable for the tasks */
function dragableForTask(taskEle){
    taskEle.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('token',taskEle.id)
    })
}

/* Remove the task Panel */
function hideTaskPanel(){
    taskPanelBackground.style.display = 'none';
    currTaskId = undefined;
}

/* Get Title By using Id */
async function getTitleById(token){ /* DB Related */
    let url = `${baseUrl}task/getTitle?token=${token}`
    let response = await fetch(url)
    let title = await response.json()
    return title['message'];
}

/* Get Descrpition By using Id */
async function getDescriptionById(token){ /* DB Related */
    let url = `${baseUrl}task/getDescription?token=${token}`
    let response = await fetch(url)
    let description = await response.json()
    return description['message'];
}

/* Delete Task By using Id */
async function deleteTaskById(token){
    let url = `${baseUrl}task/deleteTask?token=${token}`
    let response = await fetch(url,{
        method:'DELETE'
    })
    let msg = await response.json();
    return msg['message'];
}

/* Update Title By using Id */
async function updateTitleById(token,title){ /* DB Related */
    let url = `${baseUrl}task/updateTitle`
    let taskObj = {
        token: token,
        title: title
    }
    let response = await fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskObj),
    })
    let msg = await response.json()
}

/* Update Description By using Id */
async function updateDescriptionById(token,description){ /* DB Related */
    let url = `${baseUrl}task/updateDescription`
    let taskObj = {
        token: token,
        description: description
    }
    let response = await fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskObj),
    })
    let msg = await response.json()
}

/* Changing the task type */
async function changeTaskType(token,type){ /* DB Related */
    let url = `${baseUrl}task/updateStatus`
    let taskObj = {
        token: token,
        'status': taskTypes[type]
    }
    let response = await fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskObj),
    })
    let msg = await response.json()
}

async function loadData(emailId){
    let url = `${baseUrl}task/allTasks?emailId=${emailId}`
    let response = await fetch(url)
    let taskList = await response.json();
    return taskList
}

/* Card Click Event */
function onCardClickEvent(taskEle){
    taskEle.addEventListener('click',async (event) => {
        taskPanelBackground.style.display = 'flex';
        currTaskId = taskEle.id;
        let title = await getTitleById(currTaskId);
        let description = await getDescriptionById(currTaskId);
        taskPanelTitle.value = title;
        taskPanelDescription.value = description;
    })
}

/* Event listeners for the todo, doing and done */
for(let i = 0; i < 3; i++){
    /* Hide the Add a Card btn and show the textarea */
    addACardBtns[i].addEventListener('click',(event) => {
        cardTitleContainers[i].style.display = 'block';
        addACardBtns[i].style.display = 'none';
    })
    /* Add the task to the type of work */
    addTitleBtns[i].addEventListener('click',async(event) => {
        const title = cardTitles[i].value.trim();
        if(title!=='' && title!=undefined){
            taskEle = await createCard(title,taskTypes[i]);
            dragableForTask(taskEle)
            onCardClickEvent(taskEle)
            cardContainers[i].appendChild(taskEle);
        }
        cardTitles[i].value = '';
    })
    /* More Btn for status click listener */
    statusMoreBtn[i].addEventListener('click', () => {
        console.log(taskTypes[i])
    })
    /* On Clicking the cancel btn */
    cancelBtn[i].addEventListener('click', (event) => {
        cardTitleContainers[i].style.display = 'none';
        addACardBtns[i].style.display = 'block';
    })
    /* Task Container dragover */
    taskContainers[i].addEventListener('dragover', (event) => {
        event.preventDefault();
    })
    /* Task Container droping task */
    taskContainers[i].addEventListener('drop', () => {
        const token = event.dataTransfer.getData('token')
        const taskEle = document.getElementById(token)
        cardContainers[i].appendChild(taskEle)

        /* Change the task type */
        changeTaskType(token,i) /* DB Related */
    })
}

/* Task panel click Event */
taskPanel.addEventListener('click',(event) => {
    event.stopPropagation();
})

/* Task panel Background click Event */
taskPanelBackground.addEventListener('click',(event) => {
    hideTaskPanel();
})

/* Task panel save Btn */
taskPanelSaveBtn.addEventListener('click',(event) => {
    let title = taskPanelTitle.value;
    let description = taskPanelDescription.value;
    const currEle = document.querySelector(`#${currTaskId} > p`);
    currEle.innerHTML = title;
    updateTitleById(currTaskId,title);
    updateDescriptionById(currTaskId,description);
    hideTaskPanel();
})

/* Task panel cancel btn click Event */
taskPanelcancelBtn.addEventListener('click',(event) => {
    hideTaskPanel();
})

/* Task panel delete btn click Event */
taskPanelDeleteBtn.addEventListener('click',(event)=>{
    const currEle = document.querySelector(`#${currTaskId}`);
    currEle.remove();
    deleteTaskById(currTaskId);
    hideTaskPanel();
})

/* Logout Button click event */
logoutBtn.addEventListener('click',() => {
    localStorage.removeItem('emailId');
    window.open(`${frontendUrl}/index.html`,'_self')
})

/* On Load Function */
window.onload = async(event) => {
    let taskList = await loadData(localStorage.getItem('emailId'))
    taskList.forEach(async(element) => {
        taskEle = await createCard(element.title,element.status,element.token);
        dragableForTask(taskEle)
        onCardClickEvent(taskEle)
        cardContainers[taskTypesMap[element.status]].appendChild(taskEle);
    });
}