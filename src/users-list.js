import React, { Component } from 'react';
import colourCodes from './colour-codes';

class UsersList extends Component {
  constructor(props) {
    super(props)

    this.state = { selectedId: null}
  }

  clickHandler(userId) {
    // setSelectedUser passes the userId (key) of the user clicked to the App
    // component.
    this.props.setSelectedUser(userId)

    // set the id of the user clicked on to the state, to style the background
    // color of the user's element.
    this.setState({ selectedId: userId })
  }

  elementColor(userId) {
    // if the id of any given user element is the same as the id set to state by the
    // clickHandler, a color name is returned and passed to the style of the element
    if(this.state.selectedId === userId) {
      return 'DeepSkyBlue'
    }
    return ''
  }

  renderUsers(){
    // Get all info from all the users.
    const { usersInfo } = this.props

    return(
      Object.keys(usersInfo).map(key => {
        // The integer on the index 0 of the availability array of each user is
        // used as key to get the color parameter of for today's availability.
        // The colors are retrieved from an object in colorCodes.
        const colourCode = colourCodes[usersInfo[key].availabilityArray[0]]

        // Return one <li> for each user on the object of usersInfo. It includes
        // user's today's availability and user's name.
        return(
          <li
            key={key}
            className="list-item"
            style={{ background: this.elementColor(key) }}
            onClick={() => this.clickHandler(key)}>
            <div className="list-item__circle-wrapper">
              <div className={`${colourCode} circle`}>
                {usersInfo[key].availabilityArray[0]}
              </div>
            </div>
            <div className="list-item__text-wapper">
              {usersInfo[key].name}
            </div>
          </li>
        )
      })
    )
  }


  render() {

    return(
      <div className="userslist">
      <h3>
        User List
      </h3>
        <ul>
          {this.renderUsers()}
        </ul>
      </div>
    )
  }
}

export default UsersList;
