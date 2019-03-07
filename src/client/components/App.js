import React, { Component } from 'react'
import { Switch, Route} from "react-router-dom";
import { GlobalStyles } from '../styles/globalStyles'
import StyledAppContainer from '../styles/appStyles'
import StyledMainNav from '../styles/mainNavStyles'
import Game from './Game'
import AdminDash from './AdminDash'
import SignUp from './SignUp.jsx'
import Login from './Login'
import StyledFooter from '../styles/footerStyles'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {}
    }
  }

  setCurrentUser = userObj => {
    this.setState({
      currentUser: {
        id: userObj.data[0].id,
        first_name: userObj.data[0].first_name,
        last_name: userObj.data[0].last_name,
        username: userObj.data[0].username,
        is_admin: userObj.data[0].is_admin,
      }
    })
  }

  componentDidMount() {
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));
  }

  render() {
    return (
      <div>
        <GlobalStyles />
        <StyledAppContainer>
          <StyledMainNav currentUser={this.state.currentUser}/>
            <div>
              <Switch>
                <Route exact path="/" component={Game} />
                <Route exact path="/login" component={
                  props => <Login setCurrentUser={ this.setCurrentUser } { ...props } />
                  } />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/admin/dashboard" component={AdminDash} />
              </Switch>
            </div>
        </StyledAppContainer>
        <StyledFooter />
      </div>
    );
  }
}

export default App