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
      if(!this.props.isFrendFile){
        return (
          <div className="show_more">
            <ul>
              <li onClick={this.props.del_file}>Удалить</li>
              <li onClick={this.clickRedirectEditing}>Редактировать</li>
              <li onClick={this.clickRedirectAccess}>Изменить права</li>           
  
              <a href={this.props.linkToFile} onClick={(event) => {
                event.preventDefault(); // Предотвращаем стандартное поведение ссылки (переход)
  
                fetch(this.props.linkToFile)
                  .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.blob(); // Получаем данные как Blob (бинарный объект)
                  })
                  .then(blob => {
                    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = this.props.linkToFile.split('/').pop();  // Имя файла (из URL)
                    // a.download = "your_desired_filename.ext"; //  ИЛИ: Жестко заданное имя файла
  
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url); // Очищаем память, освобождаем URL
                    document.body.removeChild(a);
                  })
                  .catch(error => {
                    alert("Недостаточно прав")
                    // Обработка ошибки (например, показать сообщение пользователю)
                  });
  
              }}
              >
                <li>Скачать</li>
  
              </a>
            </ul>
          </div>
        );
      }else{
        return (
          <div className="show_more">
            <ul>         
  
              <a href={this.props.linkToFile} onClick={(event) => {
                event.preventDefault(); // Предотвращаем стандартное поведение ссылки (переход)
  
                fetch(this.props.linkToFile)
                  .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.blob(); // Получаем данные как Blob (бинарный объект)
                  })
                  .then(blob => {
                    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = this.props.linkToFile.split('/').pop();  // Имя файла (из URL)
                    // a.download = "your_desired_filename.ext"; //  ИЛИ: Жестко заданное имя файла
  
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url); // Очищаем память, освобождаем URL
                    document.body.removeChild(a);
                  })
                  .catch(error => {
                    alert("Недостаточно прав")
                    // Обработка ошибки (например, показать сообщение пользователю)
                  });
  
              }}
              >
                <li>Скачать</li>
  
              </a>
            </ul>
          </div>
        );
      }
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
        <h4>id:{String(this.props.idFile).padStart(8, '0')}</h4>
      </section>
    );
  }
}

export default File;