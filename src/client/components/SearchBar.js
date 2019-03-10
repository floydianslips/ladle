import React, { Component } from 'react';
import { Form, InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';
import axios from 'axios';
import FuzzySearch from './helpers/FuzzySearch'

class SearchBar extends Component {
   constructor(props) {
     super(props)
     this.handleClick = this.handleClick.bind(this);
     this.state = {
       words: this.props.data
     }
   }
  handleClick(word) {
    axios.get("http://localhost:8080/api/words/search", {
      params: {
        id: word
      }
    })
    .then((response) => {
      alert("The translation for " + " " + `"${word}"` + " is " + `"${response.data[0].word}"`)
    })
    .catch(function (error) {
      console.log("this is error is in getCard in Login.js", error);
    });
  }
  
  render () {
    return (
      <div>
       {this.props.data[0] && <FuzzySearch name='query' placeholder="Translate" handleClick={ this.handleClick } data={ this.props.data } /> }
     </div>
    )
  }
};

export default SearchBar;