import React from "react";
import "./css/home.css"
import File from "./file";
import { get_Cookie } from "./cookie";
import { Navigate } from "react-router-dom";


class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            file: [],
            redirectAccess: false,
            redirectEditing: false,
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
                    const request = await fetch('http://127.0.0.1:5000/get_files', {
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

    renderFiles(){
        var final = [];

        for (let i of this.state.file){
            console.log(i[1]);
            final.push(<File name={i[1]} idFile={String(i[0]).padStart(8, '0')} linkToFile={"http://127.0.0.1:5000/download/" + i[2]} setActiveFile={this.props.setActiveFile}/>);
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
