import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Registration from './registration';
import Authorization from './authorization';
import Home from './home';
import { get_Cookie } from './cookie';
import Editing from './editing';
import Access from './access';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAut: false,
      isLoading: true,
      activeFile: null
    };
  }

  setActiveFile = (idFile) => {
    this.setState({activeFile: idFile})
  }

  componentDidMount() {
    this.verification();
  }

  verification = async () => {
    if (document.cookie) {
      const token = get_Cookie('token');

      if (token) {
        try {
          const request = await fetch('http://127.0.0.1:5000/verification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
            }),
          });

          if (request.status === 200) {
            this.setState({ isAut: true });
          }
        } catch (error) {
          console.error('Ошибка верификации:', error);
        }
      }
    }
    this.setState({ isLoading: false }); // Загрузка завершена
  };

  setReg = (data) => {
    // ... этот метод, вероятно, вам нужен для обработки регистрации, но он не меняет поведение при начальной загрузке
    this.setState({ isReg: data });
  };

  setAut = (data) => {
    this.setState({ isAut: data, isReg: true });
  };

  render() {
    // Если данные еще загружаются, показываем индикатор загрузки
    if (this.state.isLoading) {
      return <div>Загрузка...</div>;
    }

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration sendData={this.setReg} />} />
          <Route path="/login" element={<Authorization sendData={this.setAut} />} />
          <Route path="/index" element={<Home setActiveFile={this.setActiveFile}/>} />
          <Route path='/editing' element={<Editing idFile={this.state.activeFile}/>}/>
          <Route path='/access' element={<Access idFile={this.state.activeFile}/>}/>
          <Route
            path="/"
            element={
              this.state.isAut ? (
                <Navigate to="/index" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
