const gel = element => document.querySelector(element);

gel('#login-form').addEventListener('submit', async (e) => {
    //Previne o browser de recarregar no submit
    e.preventDefault();
    try {
        const response = await axios.post('/api/user/login', {
            username: gel('input[name="username"]').value,
            password: gel('input[name="password"]').value,
        });
        //Aqui só será executado após o retorno do post, 
        //por estar dentro do async
        console.log(response.data);
    } catch (error) {
        console.log(error.response.data);
    }
})

//Aqui continua executando normal