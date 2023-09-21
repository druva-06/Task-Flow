let signUpPanel = document.getElementsByClassName('signup-panel')[0]
let signInPanel = document.getElementsByClassName('signin-panel')[0]
let signUpTxt = document.getElementsByClassName('signup-txt')[0]
let signInTxt = document.getElementsByClassName('signin-txt')[0]
let loginBtn = document.getElementsByClassName('login-btn')[0]
let signUpBtn = document.getElementsByClassName('signup-btn')[0]
let loginEmail = document.getElementsByClassName('login-email')[0]
let loginPass = document.getElementsByClassName('login-password')[0]
let signupEmail = document.getElementsByClassName('signup-email')[0]
let signupPass = document.getElementsByClassName('signup-password')[0]
let signupConPass = document.getElementsByClassName('signup-conf-password')[0]
let loginError = document.getElementsByClassName('error-msg')[0]
let signupError = document.getElementsByClassName('error-msg')[1]


const baseUrl = 'https://troubled-spade-production.up.railway.app/'
//const baseUrl = 'http://localhost:8080/'

const frontendUrl = 'https://druva-06.github.io/Task-Flow-Frontend'
//const frontendUrl = 'http://127.0.0.1:5500'


signUpPanel.style.display = 'none'

window.onload = () => {
    if(localStorage.getItem('emailId')){
        window.open(`${frontendUrl}/home.html`,'_self')
    }
}

signUpTxt.addEventListener('click', () => {
    signUpPanel.style.display = 'flex';
    signInPanel.style.display = 'none';
})

signInTxt.addEventListener('click', () => {
    signUpPanel.style.display = 'none';
    signInPanel.style.display = 'flex';
})

const checkCredentials = async(email,password) => {
    let response = await fetch(`${baseUrl}user/validate?emailId=${email}&password=${password}`)
    let {success:msg} = await response.json();
    if(msg){
        localStorage.setItem('emailId',email);
        window.open(`${frontendUrl}/home.html`,'_self')
        return;
    }
    loginError.innerText = 'Invalid Email or Password!';
}

loginBtn.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPass.value
    if(!email || !password){
        loginError.innerText = 'Email or Password is Empty!'
        return
    }
    checkCredentials(email,password)
})

const createCredentials = async(email,password) => {
    const user = {
        "emailId":email,
        "password":password
    }
    let response = await fetch(`${baseUrl}user/add`,{
        method:'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(user)
    })
    let {success:msg} = await response.json();
    console.log(msg)
    if(msg){
        localStorage.setItem('emailId',email);
        window.open(`${frontendUrl}/home.html`,'_self')
        return;
    }
    signupError.innerText = 'Email already exist!';
}

signUpBtn.addEventListener('click', () => {
    const email = signupEmail.value;
    const password = signupPass.value;
    const confPass = signupConPass.value;
    if(!email || !password){
        signupError.innerText = 'Email or Password is Empty!'
        return
    }
    if(password !== confPass){
        signupError.innerText = "Passwords Dosn't Match!"
        return
    }
    createCredentials(email,password)
})

