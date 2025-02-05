import React from "react";
import "./css/form.css"
import { Navigate, redirect } from "react-router-dom";

import { get_Cookie, set_Cookie } from "./cookie";

class Authorization extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            error: "",
            redirect: false,
        }

    };


    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };

    hendlePassChange = (event) => {
        this.setState({ password: event.target.value });
    };


    // setCookieFunction = (name, value, days) => {
    //     let expires = "";
    //     if (days) {
    //         const date = new Date();
    //         date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    //         expires = "; expires=" + date.toUTCString();
    //     }
    //     document.cookie = name + "=" + value + expires + "; path=/";
    // };

    // getCookie = (name) => {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop().split(";").shift();
    //     return null;
    // };



    handleSubmit = async (event) => {
        event.preventDefault();
        console.log(this.state.email);
        console.log(this.state.password);


        if(this.state.name !== "" || this.state.password !== ""){
            try {
                const response = await fetch('http://127.0.0.1:5000/aut', {                     
                    method: 'POST', 
                    headers: { 
                        'Content-Type': 'application/json' 
                    }, 
                    body: JSON.stringify({ 
                        email: this.state.email,
                        password: this.state.password
                    }) 
                }); 
                if (response.ok){
                    var data = await response.json();
                    console.log(data);
                    console.log(data.token);                
                    set_Cookie("token", data["token"], 1);
                    console.log(get_Cookie("token"));
                    console.log("_____________________________________")

                    this.setState({redirect: true});
                    this.props.sendData(true);
                }else{
                    this.setState({error: "Неверный логин или пароль"})
                }
            }catch (error){
                console.error("ОШИБКА")
            }
        }else{
            this.setState({error: "Неверный пароль или имя"})
        }
    };

    render(){
        if(this.state.redirect) {
            return(<Navigate to={"/"}/>);
        }

        return(
            <form onSubmit={this.handleSubmit} method="post">
            <h1>Авторизация</h1>
            <p>{this.state.error}</p>
            <div>
                <input type="text" id="name" name="name" onChange={this.handleEmailChange} placeholder="Email:" required/>
            </div>
            <div>
                <input type="password" id="password" name="password" onChange={this.hendlePassChange} placeholder="Пароль:" required/>
            </div>
            <div>
                <button type="submit">Отправить</button>
            </div>
        </form>
        )
    }
}

export default Authorization;