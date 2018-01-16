import React, { Component } from 'react';
import './App.css';
import Users from './users.json';
import { getUserAvailability } from './helper-functions';
import UsersList from './users-list'
import UserDetail from './user-detail';


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      usersInfo: {},
      selectedUser: {}
    }
  }

  componentDidMount() {
    // On mount generate a new object of users info and availabilties to store on
    // components state.
    getUserAvailability(Users)
      .then(response => {
        const { usersInfo } = response
        this.setState({ usersInfo })
    })
  }

  setSelectedUser(userId) {
    // Take the userId passed from the UsersList component and store on component's
    // state the selected user. This will be used to render on UserDetail.
    this.setState({ selectedUser: this.state.usersInfo[userId] })
  }

  render() {
    // Fallback case if no usersInfo has been retrieved yet from getUserAvailability
    if(this.state.usersInfo === {}) {
      return <div> Loading users </div>
    }

    const { usersInfo, selectedUser } = this.state

    return (
      <div className="app">
        <UsersList
          usersInfo={usersInfo}
          setSelectedUser={this.setSelectedUser.bind(this)} />
        <UserDetail selectedUser={selectedUser} />
      </div>
    )
  }
}

export default App;
