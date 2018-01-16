import React, { Component } from 'react';
import colourCodes from './colour-codes';
import { getWeekdaysArray } from './helper-functions';


class UserDetail extends Component {

  renderUserDetail() {
    const {
      name,
      availabilityArray
    } = this.props.selectedUser

      // Get a new array with names of days of the week, starting from today.
      const weekdaysArray = getWeekdaysArray()

      // Generate one <li> for each day in the availability array of the selected
      // user.
      return availabilityArray.map((availability, index) => {

        // Use the current runningy index to get the name of the current day from
        // the array of names of days of the week.
        const dayNameOfToday = weekdaysArray[index];

        // In case the day is weekend, return early and do not generate <li>.
        if(dayNameOfToday === 'Saturday' || dayNameOfToday === 'Sunday') {
          return
        }

        // Get the name of the color of the current availability from the object
        // of colors colourCodes. This is passed to the <li> to apply color to
        // the availability.
        const colourName = colourCodes[availability]

        // Return <li> for each day of the week (not including weekends), with
        // colour code for availability and name of the day.
        return (
          <li key={dayNameOfToday} className="list-item">
            <div className="list-item__circle-wrapper">
              <div className={`${colourName} circle`}>
                {availability}
              </div>
            </div>
            <div className="list-item__text-wapper">
              {dayNameOfToday}
            </div>
          </li>
        )
      })
  }

  render() {
    // Fallback in case no user has been selected yet.
    if(!this.props.selectedUser.name) {
      return (<h4 className="user-detail"> Select a user from the list </h4>)
    }

    else {
      const { name } = this.props.selectedUser

      return(
        <div className="user-detail">
          <h3>Selected user:<span> {name} </span></h3>
          <ul> {this.renderUserDetail()} </ul>
        </div>
      )

    }

  }

}

export default UserDetail;
