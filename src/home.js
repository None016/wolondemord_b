import React from "react";
import "./css/home.css"
import File from "./file";
import { get_Cookie } from "./cookie";
import { Navigate } from "react-router-dom";


class Home extends React.Component{

    constructor(props){
        super(props)

        var url = ""

        if(this.props.isFrendFile){
            url = "get_files_frends"
        }else{
            url = "get_files"
        }

        this.state = {
            file: [],
            redirectAccess: false,
            redirectEditing: false,
            id_file_del: null,
            url: url
        }

    }

    componentDidMount(){
        this.getFiles();
    }
    
    getFiles = async () => {
        if (document.cookie) {
              const token = get_Cookie('token');
        
                if (token) {
                    try {
                        const request = await fetch('http://127.0.0.1:5000/' + this.state.url, {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token,
                            }),
                        });
            
                        if (request.status === 200) {
                            this.setState({file: await request.json()});
                        }

                    } catch (error) {
                        console.error('Ошибка верификации:', error);
                    }
                }
        }
    }

    del_file = async (id_file_del) =>{
        if (document.cookie) {
            const token = get_Cookie("token");

            if (token){
                try {
                    const request = await fetch("http://127.0.0.1:5000/del_file", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: token,
                            id_file: id_file_del,                                                    
                        }),
                    })
                    if(request.ok){
                        console.log("файл успешно удален")
                        this.setState({file: this.state.file.filter(item => item[0] !== id_file_del)})
                    }
                }catch (error) {
                    console.error("Ошибка", error)
                }
            }
        }
    }


    renderFiles(){
        var final = [];
        var token = get_Cookie('token');

        for (let i of this.state.file){
            console.log(i[1]);
            final.push(<File name={i[1]} idFile={i[0]} linkToFile={"http://127.0.0.1:5000/download/" + token + "/" + i[0]} isFrendFile={this.props.isFrendFile} setActiveFile={this.props.setActiveFile} del_file={() => {this.del_file(i[0])}}/>);
        }

        return(final);
    }

    render(){
        if(this.state.redirectAccess){
           return(<Navigate to={"/access"}/>);
        }

        if(this.state.redirectEditing){
            return(<Navigate to={"/editing"}/>);
        }

        return(
            <main>
                {this.renderFiles()}
            </main>
        );
    }
}

export default Home;
