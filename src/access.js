import React from "react";
import "./css/access.css"
import { get_Cookie } from "./cookie";
import { Navigate } from "react-router-dom";

class Access extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user_list: [],
            back: false, 
            email: "",
            emailError: false, 
        }
    }

    componentDidMount = () =>{
        this.getAccessList()
    }

    getAccessList = async() =>{
        var token = get_Cookie("token")
        try{
        const request = await fetch("http://127.0.0.1:5000/get_access_list",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                file_id: this.props.idFile
            })
        })
        if(request.ok){
            const data = await request.json()
            this.setState({user_list: data["user_list"]})            
        }

        }catch{
            console.log("Ошибка")
        }

    }

    delAccessList = async(user_id) =>{
        var token = get_Cookie("token")
        try{
            const request = await fetch("http://127.0.0.1:5000/del_from_access_list",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    file_id: this.props.idFile,
                    user_id: user_id
                })
            })
            if(request.ok){
                this.setState({user_list: this.state.user_list.filter(item => item[0] !== user_id)})          
            }

        }catch{
            console.log("Ошибка")
        }
    }


    addAccessList = async() =>{
        var token = get_Cookie("token")
        console.log("1111")
        try{
            const request = await fetch("http://127.0.0.1:5000/add_user_access_list",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token, 
                    email: this.state.email,
                    file_id: this.props.idFile
                })
            })
            if (request.ok){
                const data = await request.json()
                var new_list = []
                for(let i of this.state.user_list){
                    new_list.push(i)
                }
                new_list.push(data["new_user"])
                this.setState({user_list: new_list})
            }
        }catch{
            console.error("Ошибка")
        }
    } 


    renderUsers = () =>{
        var final = []
        for(let i of this.state.user_list){
            final.push(
            <li className="user-list-item">
                <div className="user-info">
                    <span>{i[1]}</span><br/>
                    <span>{i[2]}</span>
                </div>
                <button className="delete-button button" onClick={() => this.delAccessList(i[0])}>Удалить доступ</button>
            </li>
            )
        }
        return(final)

    }

    backward = () =>{
        this.setState({back: true})
    }

    handleEmail = (event) => {
        const email = event.target.value;
        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        this.setState({ email, emailError: !isValidEmail });
    }

    render(){
        if (this.state.back){
            return(
                <Navigate to="/index"/>
            )
        }
        return(
            <main className="access">
                <h1>Права доступа для файла {String(this.props.idFile).padStart(8, '0')}</h1>

                <button className="button" onClick={this.backward}>Назад</button>

                <h2>Текущие пользователи с доступом:</h2>
                <ul className="user-list">
                    {this.renderUsers()}
                </ul>

                <h2>Добавить пользователя:</h2>
                <p>{this.state.emailError && "Некоректный email"}</p>
                <div id="add-user-form">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" onChange={this.handleEmail}/>
                    <button className="button" onClick={this.addAccessList}>Добавить</button>
                </div>
            </main>
        );
    }
}

export default Access
