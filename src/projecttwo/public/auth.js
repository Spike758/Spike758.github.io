const users = [
    {
        id: 1,
        login: 'user',
        password: '123',
    }
]

const login = () => {
    let login = document.getElementById('loginInput').value
    let password = document.getElementById('passwordInput').value

    users.forEach(user => {
        if(user.login === login && user.password === password){
            window.location = 'index.html'
        }
    })
}