import React from "react";
import ico from "./img/txt.ico";
import more from "./img/more.svg";


class File extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showMenu: false,
        };
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }


    click_more = () => {
        console.log("click_more");
        this.setState({showMenu: true});
    }

    menu = () => {
        if (this.state.showMenu){
            return(
                <div className="show_more">
                    
                    <ul>
                        <li>Удалить</li>
                        <li>Редактировать</li>
                        <li>Изменить права</li>
                        <li>Скачать</li>
                    </ul>
                </div>
            );
        }else{
            return(null);
        }
    }

    
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({showMenu: false})
        }
    }



    render(){
        return(
            <section id={this.props.idFile} ref={this.wrapperRef}>
                <div className="more" onClick={this.click_more}>
                    <img src={more}/>
                </div>
                {this.menu()}
                <img src={ico}/>
                <h3>{this.props.name}</h3>
                <h4>id:{this.props.idFile}</h4>
            </section>
        );
    }

}

export default File;
