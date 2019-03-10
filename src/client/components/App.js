import React, { Component } from 'react'
import { Switch, Route} from "react-router-dom";
import StyledAppContainer from '../styles/appStyles'
import StyledMainNav from '../styles/mainNavStyles'
import Game from './Game'
import AdminDash from './admin/AdminDash'
import SignUp from './SignUp.jsx'
import Login from './Login'
import StyledFooter from '../styles/footerStyles'
import AdminWords from './admin/AdminWords'
import AdminUsers from './admin/AdminUsers'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordData: {},
      currentUser: {}
    }
  }

  setCurrentUser = userObj => {
    let obj = userObj.data;
    const achievements = [];
    const trophyIds = [];
    obj.forEach(element => {
      achievements.push({ id: element.id, name: element.name, description: element.description })
    })

    this.setState({
      currentUser: {
        achievements: achievements,
        id: userObj.data[0].id,
        first_name: userObj.data[0].first_name,
        last_name: userObj.data[0].last_name,
        username: userObj.data[0].username,
        is_admin: userObj.data[0].is_admin,
      }
    })

  }
  
  getWordData = () => {
    axios.get("http://localhost:8080/api/words/all")
    .then((response) => {
      console.log(response)
      this.setState({wordData: [...response.data]});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidMount() {
   this.getWordData()  
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));
  }

  render() {
    return (
      <div>
        <StyledAppContainer>
          {/* Pass userObj to StyledMainNav somehow*/}
          <StyledMainNav data={ this.state.wordData } currentUser={this.state.currentUser}/>
            <div>
              <Switch>
                <Route exact path="/" render={(props) => <Game {...this.state.currentUser}/>} />
                <Route exact path="/login" component={ props => <Login setCurrentUser={ this.setCurrentUser } { ...props } /> } />
                <Route exact path="/signup" component={ SignUp } />
                <Route exact path="/admin/dashboard" component={ AdminDash } />
                <Route exact path="/admin/words" component={ AdminWords } />
                <Route exact path="/admin/users" component={ AdminUsers } />
                {/* <Route path="/admin/words/:id" component={ AdminWordEdit } /> */}
              </Switch>
            </div>
        </StyledAppContainer>
        <StyledFooter />
      </div>
    );
  }
}

export default App