import React, { Component } from "react";
import fuzzyFilterFactory from "react-fuzzy-filter";
import { 
  InputGroup,
  InputGroupAddon, 
  Button} from 'reactstrap';
import { 
  FuzzyDDF,
  FuzzyInner } from '../styles/appStyles'

// these components share state and can even live in different components
const { InputFilter, FilterResults, changeInputValue } = fuzzyFilterFactory();

class FuzzySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      searchWord: '',
      is_open: false
    }
  }

  componentDidMount() {
    this.createWordsArray()
  }

  createWordsArray = () => {
    let wordArray = [];

    this.props.data.forEach((element) =>
    wordArray.push({name: element.en_word, meta: element.en_word })
    )
    this.setState({ words: wordArray })

  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
    this.props.handleClick(this.state.searchWord)
    changeInputValue()
    }
  }

  onChange = (word) => {
    this.setState({ searchWord: word })
    return word
  }

  onClick = () => {
    this.props.handleClick(this.state.searchWord)
    // this.setState({  })
    changeInputValue()

  }

  render() {
    const items = this.state.words
    const fuseConfig = {
      keys: ["meta", "tag"],
    };

    return (
      <div>
        <InputGroup>
          <InputFilter inputProps={{ placeholder: this.props.placeholder, name: this.props.name, onKeyUp: this.handleEnter }} onChange={this.onChange} debounceTime={200}/>
          <InputGroupAddon addonType="append">
            <Button type="button" onClick={this.onClick} color="primary" >Search</Button>
          </InputGroupAddon>
          </InputGroup>
          <FilterResults defaultAllItems={false} items={items} fuseConfig={fuseConfig}>
          {filteredItems => {
            return (
              <FuzzyDDF>
                {filteredItems.map(item => (
                  <FuzzyInner key={item.name}>
                    {item.name}
                  </FuzzyInner>
                ))}
              </FuzzyDDF>
            );
          }}
        </FilterResults>
      </div>
    );
  }
}

export default FuzzySearch
