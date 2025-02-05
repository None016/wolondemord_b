import React from "react";
import "./css/home.css"
import File from "./file";

class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            file: [
                {
                    name: "name1",  
                    id: "0000001"
                },
                {
                    name: "name2",  
                    id: "0000002"
                },
                {
                    name: "name3",  
                    id: "0000003"
                },
                {
                    name: "name4",  
                    id: "0000004"
                },
            ]
        }
    }

    renderFiles(){
        var final = [];

        for (let i of this.state.file){
            console.log(i.name);
            final.push(<File name={i.name} idFile={i.id}/>)
        }

        return(final);
    }

    render(){
        return(
            <main>
                {this.renderFiles()}
            </main>
        );
    }
}

export default Home;
