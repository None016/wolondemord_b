import React from "react";
import ico from "./img/txt.ico";
import more from "./img/more.svg";
import { Navigate } from "react-router-dom";

class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      redirectAccess: false,
      redirectEditing: false,
    };
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  click_more = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  menu = () => {
    if (this.state.showMenu) {
      return (
        <div className="show_more">
          <ul>
            <li>Удалить</li>
            <li onClick={this.clickRedirectEditing}>Редактировать</li>
            <li onClick={this.clickRedirectAccess}>Изменить права</li>
            {/* Оберните li в тег a, а не наоборот */}
            <li><a href={this.props.linkToFile} target="_blank" rel="noopener noreferrer">Скачать</a></li>
          </ul>
        </div>
      );
    }
    return null;
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ showMenu: false });
    }
  }

  clickRedirectAccess = () => {
    this.setState({ redirectAccess: true });
    this.props.setActiveFile(this.props.idFile);  // Корректно вызывает функцию из props
  };

  clickRedirectEditing = () => {
    this.setState({ redirectEditing: true });
    this.props.setActiveFile(this.props.idFile); // Корректно вызывает функцию из props
  };

  render() {
    if (this.state.redirectAccess) {
      return <Navigate to={"/Access"} />;
    }

    if (this.state.redirectEditing) {
      return <Navigate to={"/Editing"} />;
    }

    return (
      <section id={this.props.idFile} ref={this.wrapperRef}>
        <div className="more" onClick={this.click_more}>
          <img src={more} alt="Больше опций" />
        </div>
        {this.menu()}
        <img src={ico} alt="Иконка файла" />
        <h3>{this.props.name}</h3>
        <h4>id:{this.props.idFile}</h4>
      </section>
    );
  }
}

export default File;