import React from "react";
import "./css/editing.css";
import { get_Cookie } from "./cookie";
import {validateFileName} from "./validateFileName";
import { Navigate } from "react-router-dom";

class Editing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: "",
            back: false
        };
    }

    componentDidMount() {
        this.getNameFile();
    }

    getNameFile = async () => {
        if (document.cookie) {
            const token = get_Cookie('token');
            if (token) {
                try {
                    const request = await fetch('http://127.0.0.1:5000/get_name_file', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token,
                            idFile: this.props.idFile
                        }),
                    });

                    if (request.ok) {
                        const data = await request.json();
                        console.log(data);
                        this.setState({ fileName: data.fileName });
                    } else {
                         console.error('Ошибка запроса:', request.status);
                    }

                } catch (error) {
                    console.error('Ошибка:', error);
                }
            }
        }
    }

    setNameFile = async () => {
        var valid = validateFileName(this.state.fileName)
        if (valid["isValid"]){
            if (document.cookie) {
                const token = get_Cookie('token');
                if (token) {
                    try {
                        const request = await fetch('http://127.0.0.1:5000/set_name_file', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token,
                                idFile: this.props.idFile,
                                nameFile: this.state.fileName
                            }),
                        });

                        if (request.ok) {
                            const data = await request.json();
                            console.log(data);
                            this.setState({ fileName: data.fileName });
                            alert("Имя вайла успешно измененно")
                        } else {
                            console.error('Ошибка запроса:', request.status);
                            alert("Неудалось изменить имя файла")
                        }

                    } catch (error) {
                        console.error('Ошибка:', error);
                    }
                }
            }
        }else{
            alert(valid["errorMessage"])
        }
    }

    handleFileNameChange = (event) => {
        this.setState({ fileName: event.target.value });
    }

    backward = () =>{
        this.setState({back: true})
    }

    render() {
        if (this.state.back){
            return(
                <Navigate to="/index" replace/>
            )
        }
        return (
            <main>
                <h1>Редактирование файла: id:{String(this.props.idFile).padStart(8, '0')}</h1>
                <form id="editForm">
                    <div className="editing">
                        <label htmlFor="fileName">Новое имя файла:</label>
                        <input
                            type="text"
                            id="fileName"
                            name="fileName"
                            value={this.state.fileName}
                            onChange={this.handleFileNameChange}
                            required
                        />
                        <div id="fileNameError" className="error-message"></div>
                    </div>

                    <button type="button" onClick={this.setNameFile}>Сохранить</button>
                    <button type="button" onClick={this.backward}>Назад</button>
                </form>
            </main>
        );
    }
}

export default Editing;
