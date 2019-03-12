import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  CardImg,
  CardTitle } from 'reactstrap';
import FlashCardImg from '../flash-card.png';
import axios from 'axios';
import { StyledBtnDiv, StyledCard, StyledCardBody, StyledCardButtons } from '../styles/gameStyles'
import Trophy from './AchievementTrophy';
// import { promises } from 'fs';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
      x_words: [],

      user_word: "",
      en_word: "",
      es_word: "",
      userAchievements: [],
      user_word_id: null,
      user_id: null
      },
      userWords: [],

      currentWord: null,
      populateWords: [],
      firstFlip: false,
      flipped  : false,
      url: 'http://localhost:8080/api'
    }
  }

  // Load first card from currentUser information and set user_id in state
  componentDidMount() {
    console.log(this.props.data.id, 'props')
    // if (this.props.data.id) {
      this.userWord(this.props.data.id)
      this.setState({ currentUser: this.props.data })

  // componentDidUpdate() {
  //   this.userWord(this.props.data.id)
  // }
    // }
    // if (this.props.data) {
    //   this.userWord(this.props.data.id)
    //   this.setState({ currentUser: this.props.data[0] })

    //  else { console.log("help") }
    //.then(this.drawNewCard(this.state.currentUser.currentWord[0]))
    // if user is new run initial setup if not get word
    // this.props.is_new === true ?
    //   this.initialSetup(this.props.id) : this.userWord(this.props.id).then(() => this.drawNewCard(this.state.currentUser.currentWord))
  }

  //  Populate user words array in state
  userWord = (user_id, url) => {
    return axios.get('http://localhost:8080/api/userWord', {
      params: {
        id: user_id
      }
    })
    .then((response) => {
      console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;", response.data)
      let words = response.data;
      const userWords = [];

      words.forEach(element => {
        userWords.push(element.en_words_id)
        this.setState({ userWords: userWords, currentWord: userWords[0] } )
      })
      this.drawNewCard(this.state.userWords[0])
    })
  }

  // Get the proper card from the deck for current user that is rendered on the page
  drawNewCard = (user_word_id) => {
    return axios.get("http://localhost:8080/game", {
      params: {
        id: user_word_id,
      }
    })
    .then((response) => {
      this.setState({ en_word: response.data[0].rows[0].word })
      this.setState({ es_word: response.data[1].rows[0].word })
    })
    .catch(function (error) {
      console.log("this is error is in getCard in Game.js", error);
    });
  }

  // Post to user_words DB when a word is learned
  learnedCard = (en_word_id) => {
    axios.put("http://localhost:8080/learned", {
        user_id: this.state.currentUser.id,
        en_word_id: en_word_id,
        is_known: true
    })
    .catch(function (error) {
      console.log("this error is from learnedCard in Game.js", error);
    });
  }

  // Increment the difficulty counter for the en_word
  updateWord = (wordID, counter) => {
    axios.put("http://localhost:8080/updateWord", {
      id: wordID,
      diff: counter
    })
  }

  // Take word and place it further into the words array
  arrayMove = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };

  // Grab new word and reset state of card
  markedCard = (increment, state) => {
    let num = state;
    this.setState({ userWords: state, currentWord: state[0] })
    this.updateWord(num[0], increment)
    this.drawNewCard(state[0])
    this.setState({firstFlip: false, isFlipped: false})
  }

  // User doesn't know the card and clicks the x mark, increase difficulty of card in en_cards table
  xMark = () => {
    let num = this.state.userWords.slice();
    const newArray = this.arrayMove(num, 0, 2)
    this.markedCard(-1, newArray);
  }

  // Update card and cue next card when word is learned
  checkMark = () => {
    this.userWord(this.props.data.id)
    console.log('this state', this.props.data.id)
    let newWords = this.state.userWords.slice();
    newWords.splice(0, 1)
    this.markedCard(1, newWords)
    this.learnedCard(this.state.currentWord, 1)

  }

  firstFlip = () => {
    this.setState({
      firstFlip: true,
      isFlipped  : true
    })
  }

  flip = () => {
    this.setState({
      isFlipped: !this.state.isFlipped
    });
  }

  render() {
    if (!this.state.currentUser.id) {
      return <h1>You need to log in</h1>
    } else {
    return (
      <Container>
        <div>
        <Row>
          <Col>
          { !this.state.isFlipped
            ?
            <StyledCard>
              <CardImg top width="100%" src={ FlashCardImg } alt="Card image cap" />
              <StyledCardBody>
                <CardTitle className="flash-card-word">{ this.state.en_word }</CardTitle>
              </StyledCardBody>
            </StyledCard>
            :
            <StyledCard>
              <CardImg top width="100%" src={ FlashCardImg } alt="Card image cap" />
              <StyledCardBody>
                <CardTitle className="flash-card-word">{ this.state.es_word }</CardTitle>
              </StyledCardBody>
            </StyledCard>
          }
          </Col>
        </Row>
        <StyledBtnDiv>
          <StyledCardButtons>
          { !this.state.firstFlip
            ?
            <Button onClick={this.firstFlip}>Flip</Button>
            :
            <ButtonGroup>
              <Button onClick={ this.xMark }>✘</Button>
              <Button onClick={ this.flip }>Flip</Button>
              <Button onClick={ this.checkMark }>✔</Button>
            </ButtonGroup> }
          </StyledCardButtons>
        </StyledBtnDiv>
        </div>
        <div>
          <Trophy data={this.state.currentUser.achievements} />
        </div>
      </Container>);
    }
  }
};

export default Game;