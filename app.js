/** all states in Nigeria */
const states = [
    "oyo",          "osun",     "ekiti",      "ondo",       "crossriver",
    "lagos",        "kwara",    "delta",      "enugu",      "anambra",
    "rivers",       "kogi",     "akwaibom",   "benue",      "plateau",
    "gombe",        "bauchi",   "kaduna",     "kebbi",      "niger",
    "sokoto",       "zamfara",  "kano",       "jigawa",     "yobe",
    "borno",        "taraba",   "adamawa",    "abuja",      "ogun",
    "imo",          "abia",     "ebonyi",     "nassarawa",  "katsina",
    "bayelsa"
];

// retrieve all states available on map DOM object
let countryStates = document.querySelectorAll('.state');


/**
 * generates a random rgb color in returns it
 * : return-type :: String
 */
const generate_rand_color = () => {
  return `rgb(${
            Math.floor(Math.random() * 225)}, ${
                  Math.floor(Math.random() *225)}, ${
                        Math.floor(Math.random() * 255)})`
}

/**
 * get the next state from the list of state and returns it...
 * this methods reduces the states array when a new state is returned
 * 
 * : return-type :: String
 */
const next_state = () => {
  let num_of_state_remaining = Math.floor(Math.random() * states.length)
  return states.splice(num_of_state_remaining, 1);
}


/**
 * this changes the id and innerText property of a draggable
 * @param {DomElement} draggable a dom element that can be dragged
 */
const change_draggable_prop = (draggable) => {
  let state = next_state()
  draggable.id = `drag-${state}`
  draggable.innerText = state
}



/********************************************************************************** */
//  QUICK BRIEF
//        this game comprises of DOM (Document Object Model) element that can be 
//        dragged and other DOM (Document Object Model) elements that can be dropped.
//        let's actually make DOM elements that can be dragged draggable
/********************************************************************************** */


// DOM elements that can be dragged have class name `draggable`, let's actually include
// the event to make them draggable






/**
 * This handler will basically be used for changing styling DOM draggable 
 * dragging them around...
 * @param {DragEvent} event a drag event element
 */
const ondrag_handler = (event) => {
  // change th color
  event
  .currentTarget
  .style
    .background = "#07fff4";
    
    event 
    .currentTarget
    .style 
    .transform = `translate(${event.screenX}, ${event.screenY})`
  }
  
  
  
  const ondragstart_handler = (event) => {
    // enable us to retrieve the element that is being dragged
    // when ever we drop it
    event
    .dataTransfer
    .setData('text/plain', event.target.id);
    
    console.log("drag start");
  }
  
  
  let draggable = document.querySelector('.draggable');
  draggable.addEventListener('dragstart', ondragstart_handler);
  draggable.addEventListener('drag', ondrag_handler);
  change_draggable_prop(draggable);
  
  
  
  
  /**
   * Allows dropzones to accept draggable as it browsers disables
   * it by default
   * @param {DragOver} event a dragover event
   */
const ondragover_handler = (event) => {
  event.preventDefault();
  console.log("accept drop")
}




/**
 * This retrieves the draggable object that was dropped on 
 * a dropzone and computes game logic
 * @param {DropEvent} event a drop event
 */
const ondrop_handler = (event) => {
  const id = event
                .dataTransfer
                .getData('text');

  const draggableelement = document.getElementById(id);
  const dropzone = event.target;

  /**
   * 
   *    GAME LOGIC
   * 
   */
  let dropzoneId = dropzone.id;
  let draggableId = draggableelement.id.split("-")[1];

  let value = dropzoneId.includes(draggableId)
  
  if(value === true){
    // generate a random color to fill the state path
    let color = generate_rand_color();
    
    console.log(draggableId)
    let state = document.querySelector(`path#${draggableId}`);
    state.setAttribute("style", `fill: ${color} !important`);

    // remove dragover and drop event listener from the dropzone
    dropzone.removeEventListener('dragover', ondragover_handler);
    dropzone.removeEventListener('drop', ondrop_handler);

    // change draggable property
    change_draggable_prop(draggableelement);
  }

  // change the color of draggable element
  draggable.style.background = "#fbff05"
  

  event
      .dataTransfer
      .clearData();
}



// the elements that will be used as dropzones are svg path
// there's need to iterate through and then set the ondragover_handler
countryStates.forEach((state) => {
  state.addEventListener('dragover', ondragover_handler);
  state.addEventListener('drop', ondrop_handler);
});





/***
 * IMPLEMENT TIMER FUNCTIONALITY
 * Check out this count down timer I have just inplemented
 */
const countdown = (elementName, minutes, seconds) => {
  let element, endTime, hours, mins, 
      msLeft, time, chosenTimeInMinutes, 
      gamePlayMinutesInSeconds;

  // DOM element to display timer
  element = document.getElementById(elementName);

  /**
   * 60 seconds == 1 minutes :::::  60 * minutes + seconds  
   * 
   * given 5 minutes 8 seconds
   * 60 * 5 + 8 == 308            ----- RESULT 1
   */
  chosenTimeInMinutes = 60 * minutes + seconds

  /**
   * 1000 miliseconds makes a seconds ::::: 1000 * choosenTimeInMinutes 
   * 
   * using RESULT 1
   * 1000 * 308 === 308000
   */
  gamePlayMinutesInSeconds = 1000 * chosenTimeInMinutes

  // compute real time from the values passed in :: minutes & seconds
  endTime = gamePlayMinutesInSeconds + 500 + new Date().getTime();



  /**
   * returns a two numerical value for a single numerical 
   * value. if value passed is already more than one 
   * numerical value, then the value is returned as is.
   * 
   * e.g 
   *    if 4 which is a single numerical value is passed
   *    function will return `04`
   *   
   *    if 10 which is two numerical value is passed
   *    function will return `10`
   * 
   * @param {Integer} n : Numerical value to be doubled
   */
  const twoDigits = n => n <= 9 ? "0" + n : n;


  /**
   * counts down the passed time
   */
  const updateTimer= () => {
    msLeft = endTime - new Date().getTime();

    if (msLeft < 1000) {
      element.innerHTML = "Game Over!";

      draggable.style.display = 'none';

      // the elements that will be used as dropzones are svg path
      // there's need to iterate through and then set the ondragover_handler
      countryStates.forEach((state) => {
        state.removeEventListener('dragover', ondragover_handler);
        state.removeEventListener('drop', ondrop_handler);
      });

    } 

    else {
      time = new Date(msLeft);
      hours = time.getUTCHours();
      mins = time.getUTCMinutes();

      // compute the time value to be displayed
      // (step 1) if we have hours greater than 0, then display
      // format would be `hours:minutes:seconds` 

      // (step 2) if we have hours less than or equal to 0, then 
      // display format would be `minute:seconds`
      currentCountDownTime = (
        hours > 0 ? 
            `${hours}:${twoDigits(mins)}:${twoDigits(time.getUTCSeconds())}`        
          :            
            `${twoDigits(mins)}:${twoDigits(time.getUTCSeconds())}`
      );

      element.innerHTML = currentCountDownTime;
      setTimeout(updateTimer, 1000);
    }
  }

  
  updateTimer();
}
countdown("countdown", 0, 20);


// let timerEle = document.getElementById('timer');
// let timeCount = 0;
// setInterval(() => {
//   timeCount = timeCount + 1;
//   timerEle.innerText = timeCount;
// }, 1000);