import moment from 'moment';
import weekdays from './weekdays';


//-------------------------- GET WEEKDAYS ARRAY ------------------------------//

// Generate a new array of names of 7 days of the week, starting from today.
export const getWeekdaysArray = () => {

  // Begin with an empty array
  let weekdaysArray = []

  // Get today's day of the week as integer. This will be the starting point.
  const startOfToday = moment().startOf('day');
  let weekdayToday = moment(startOfToday).format('d')
  weekdayToday = parseInt(weekdayToday, 10)

  // Push days into the array until the length of the array is 7.
  while(weekdaysArray.length < 7) {

    // Fetch the name of the day from the object 'weekdays', using the
    // the counter 'today' as object key.
    weekdaysArray.push(weekdays[weekdayToday])
    weekdayToday++
    if(weekdayToday > 6) {
      // If the current counter is 6 (which corresponds to Sunday on the array)
      // set the counter back to 0 (which corresponds to Monday on the array)
      weekdayToday = 0
    }
  }
  // Return the final array with 7 names of days.
  return weekdaysArray
}


//-------------------------- GET USERS AVAILABILITY --------------------------//

// Generate a new array of user availabilties, starting with availability store in
//the current obj of users from db.
export const getUserAvailability = (usersObj) => {
  return new Promise((resolve, reject) => {
    // Use startOf to take the beginning of the day (00:00:00hr) as reference
    const startOfToday = moment().startOf('day');

    // Create new empty object to store the data
    let newAvailabilityObject = {};

    // Parse the obj of users from db and generate a new obj of users with an
    // array of availabilty for each user.
    Object.keys(usersObj).map(key => {
      const { availabilityArray, lastUpdated, name } = usersObj[key];

      // Pass timestamp of last update to 'moment' to get the date of last update
      const dayOfLastUpdate = moment(lastUpdated);

      // Use startOf to get the beginning of the day.
      const startOfDayOfLastUpdate = dayOfLastUpdate.startOf('day')._d;

      // oneDay = amount of millisecs in 1 day
      const oneDay = 1000 * 60 * 60 * 24;

      // a.diff(b) returns the difference in millisecs between date 'a' and
      // date 'b'. Divide this result by oneDay to obtain the amount in days.
      // This tells us how many days (index positions) we must shift forward on the array of
      // availabilty retrieved from db.
      const daysSinceLastUpdate = (
        startOfToday.diff(startOfDayOfLastUpdate) / oneDay
      );

      // Get an availability array of max. availabilty (1).
      const newAvailabilityArray = [1, 1, 1, 1, 1, 1, 1]

      // **Amount of days passed since last update is higher than 6 (a whole week) **

      // the existing array on the db is irrelevant. A new array with max
      // availabilty can be returned as current availabilty.
      if(daysSinceLastUpdate >= 6) {

        // Create an obj with the user info and the generated array of availability
        // and add if to a global object of users info.
        newAvailabilityObject = { ...newAvailabilityObject,
          usersInfo: { ...newAvailabilityObject.usersInfo,
            [key]: {
              availabilityArray: newAvailabilityArray,
              name
            }
          }
        }
      }
      else {
        // **Amount of days passed since last update is lower than 6.**

        // Must use the old array of availabilty as base for the new array.
        // Generate a new array with the days remaining from the old array of
        // availability. The starting index for the extraction of the remaining
        // is the amount of days passed since last update (-1 for indexing
        // purposes).
        const arrayOfRemainingDays = availabilityArray.splice(daysSinceLastUpdate-1);

        // Remove from the new availability array created before, as many elements
        // as the length of array with the remaining days. Then add/concat the
        // array of remaining days to the new array of availabilty.
        Array.prototype.splice.apply(
          newAvailabilityArray, [0, arrayOfRemainingDays.length]
          .concat(arrayOfRemainingDays)
        )

        // Add the newly created array of availabilty to the new user object.
        // Add the user object to the global object of users info.
        newAvailabilityObject = { ...newAvailabilityObject,
          usersInfo: { ...newAvailabilityObject.usersInfo,
            [key]: {
              availabilityArray: newAvailabilityArray,
              name
            }

          }
        }
      }
    });
    // Return the object of users info generated.
    resolve(newAvailabilityObject)
  })
}
