import React from "react";
import "./css/form.css";
import { Navigate } from "react-router-dom";



class Regictration extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
            errorEmail: "",
            errorPassword: "",
            errorRepeatPassword: "",
            shouldRedirect: false,
        }
    };

    handleNameChange = (event) => {
        this.setState({ name: event.target.value });
    };
    
    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
        if(event.target.value.includes("@")){
            this.state.errorEmail = "";
            document.getElementById("email").style.backgroundColor = "#555";

        }else{
            this.state.errorEmail = "Почта должна содержать символ '@'";
            document.getElementById("email").style.backgroundColor = "#ff050573";
        }

    };

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
        if(event.target.value.length < 8){
            this.setState({errorPassword: "Пароль должен создержать минимум 8 символов"})
            document.getElementById("password").style.backgroundColor = "#ff050573";
        }else{
            this.setState({errorPassword: ""})
            document.getElementById("password").style.backgroundColor = "#555";
        }
    };

    handleRepeatPasswordChange = (event) => {
        this.setState({ repeatPassword: event.target.value })
        if(this.state.password !== event.target.value){
            this.setState({errorRepeatPassword: "Пароль не совпадает"})
            document.getElementById("passwordrepeat").style.backgroundColor = "#ff050573";
        }else{
            this.setState({errorRepeatPassword: ""})
            document.getElementById("passwordrepeat").style.backgroundColor = "#555";
        }
    };

    handleSubmit = async (event) => { 
        event.preventDefault(); 
        console.log(this.state.name); 
        console.log(this.state.email); 
        console.log(this.state.password); 
    
        if (this.state.name !== "" && this.state.errorEmail === "" && this.state.errorPassword === "" && this.state.errorRepeatPassword === "") { 
            try { 
                const response = await fetch('http://127.0.0.1:5000/reg', {                     
                    method: 'POST', 
                    headers: { 
                        'Content-Type': 'application/json' 
                    }, 
                    body: JSON.stringify({ 
                        name: this.state.name, 
                        email: this.state.email, 
                        password: this.state.password 
                    }) 
                }); 
    
                if (!response.ok) {
                    console.log(2);
                    if (response.status == 409){
                        this.setState({errorEmail: "Данный email уже используюца"})
                    }
                    throw new Error('Network response was not ok');
                }else{
                    console.log(1);
                    this.setState({shouldRedirect: true});
                    this.props.sendData(true)
                }
            } catch (error) { 
                console.error("Ошибка:", error); 
            } 
        } 
    };

    

    render(){
        if (this.state.shouldRedirect) {
            return <Navigate to="/"/>;
        }

        return(
            <form onSubmit={this.handleSubmit} method="post">
                <h1>Регистрация</h1>
                <a href="../login">Авторизация</a>
                <div>
                    <input type="text" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} placeholder="Имя:" required/>
                </div>
                <div>
                    <label htmlFor="email">{this.state.errorEmail}</label><br/>
                    <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleEmailChange}  placeholder="Email:" required/>
                </div>
                <div>
                    <label htmlFor="password">{this.state.errorPassword}</label><br/>
                    <input type="password" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Пароль:" required/>
                </div>
                <div>
                    <label htmlFor="password">{this.state.errorRepeatPassword}</label><br/>
                    <input type="password" id="passwordrepeat" name="password" value={this.state.repeatPassword} onChange={this.handleRepeatPasswordChange} placeholder="Повтор пароля:" required/>
                </div>
                <div>
                    <button type="submit">Отправить</button>
                </div>
            </form>
        )
    }
}

export default Regictration