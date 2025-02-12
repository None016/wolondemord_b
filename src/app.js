import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Registration from './registration';
import Authorization from './authorization';
import Home from './home';
import { get_Cookie } from './cookie';
import Editing from './editing';
import Access from './access';

import "./css/header.css"
import Amogus from "./img/Amogus.png" 
import LoadFile from './loadFile'; 



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
      activeFile: null,
      isReg: false,
    };
  }

  setActiveFile = (idFile) => {
    this.setState({ activeFile: idFile });
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
          } else {
              document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              this.setState({isAut: false});
          }
        } catch (error) {
          console.error('Ошибка верификации:', error);
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
           this.setState({isAut: false});
        }
      }
    }
    this.setState({ isLoading: false });
  };

  setReg = (data) => {
    if (data) {
      this.setState({ isReg: true });
    }
  };

  setAut = (data) => {
    if (data) {
        this.setState({ isAut: data, isReg: true });
    }

  };

  render() {
    if (this.state.isLoading) {
      return <div>Загрузка...</div>;
    }

    return (
      <BrowserRouter>
        <main className='main'>
          <header>
            <img src={Amogus} />
            <div>
              <Link to="/index">Главная</Link>
              <Link to="/load_file">Загрузить файлы</Link>
              <Link to="/frend_file">Чужие файлы</Link>
            </div>
          </header>
          <Routes>
            <Route path="/register" element={<Registration sendData={this.setReg} />} />
            <Route path="/login" element={<Authorization sendData={this.setAut} />} />
            <Route path="/index" element={this.state.isAut ? <Home setActiveFile={this.setActiveFile} isFrendFile={false}/> : <Navigate to="/login" />} />
            <Route path='/editing' element={this.state.isAut? <Editing idFile={this.state.activeFile} /> : <Navigate to="/login"/>}/>
            <Route path='/access' element={this.state.isAut?  <Access idFile={this.state.activeFile} /> : <Navigate to="/login"/>}/>
            <Route path='/load_file' element={this.state.isAut? <LoadFile/> : <Navigate to="/login"/>}/>
            <Route path='/frend_file' element={this.state.isAut? <Home setActiveFile={this.setActiveFile} isFrendFile={true}/> : <Navigate to="/login"/>}/>
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
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
