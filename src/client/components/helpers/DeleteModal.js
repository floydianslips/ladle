import React, { Component } from 'react'
import { 
  Card,
  CardText, 
  Button } from 'reactstrap'
import { 
  ModalContainer, 
  ModalWrapper } from '../../styles/adminStyles';

  // figure out wtf is up with deleteUser being undefined, then make deleteUser routes
class DeleteModal extends Component {
  constructor({deleteUser, data}) {
    // this.deleteUser = deleteUser
    super();
    this.state = {
      id        : data.id,
      username  : data.username,
      modal_open: false
    }
  }

  buttonToggle = () => {
    this.setState({ modal_open: !this.state.modal_open})
  }

  render() {
    return(<>
      <span onClick={this.buttonToggle} className="ml-2">
        ❌
      </span>
      
      { this.state.modal_open && (
        <ModalContainer>
          <ModalWrapper>
            <Card outline className="custom-ui" body>
              <Button close onClick={this.buttonToggle}/>
              <h3>Are You Sure?</h3>
              <CardText>This action cannot be undone!</CardText>
              <Button onClick={this.buttonToggle}>Cancel</Button>
              <Button 
                  onClick={() => {
                  // this.deleteUser(this.state),
                  this.buttonToggle() }}> 
                Delete User 
              </Button>
            </Card>
          </ModalWrapper>
        </ModalContainer>
      )}
    </>
    )
  }
}

export default DeleteModal