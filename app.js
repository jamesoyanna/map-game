/** all states in Nigeria */
let states = [
    "oyo",          "osun",     "ekiti",      "ondo",       "crossriver",
    "lagos",        "kwara",    "delta",      "enugu",      "anambra",
    "rivers",       "kogi",     "akwaibom",   "benue",      "plateau",
    "gombe",        "bauchi",   "kaduna",     "kebbi",      "niger",
    "sokoto",       "zamfara",  "kano",       "jigawa",     "yobe",
    "borno",        "taraba",   "adamawa",    "abuja",      "ogun",
    "imo",          "abia",     "ebonyi",     "nassarawa",  "katsina",
    "bayelsa",      "edo",
];

let GAME_START_FLAG = false;
let playerName = 'Strange';
let draggable;
let gameCompleted = false;
let tempStates = [...states];

/**
 * helps to track if the draggable name was changed... can accept a true
 * or false value... when true it means the name was changed.. when false
 * it means the name wasn't set 
 */
let draggableNameSet = false;

// score gotten per correct answer
const correctScore = 15;

// bonus score for getting three correct score in a row
const rowScore = 15 * 3;

// this will help to track if three correct score has been
// gotten so a bonus can be assigned
let rowCount = 0;


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
  if(states.length > 0) {
    let num_of_state_remaining = Math.floor(Math.random() * states.length)
    return states.splice(num_of_state_remaining, 1);
  }
}


/**
 * this changes the id and innerText property of a draggable.
 * returns true when changes are made else false is returned
 * @param {DomElement} draggable a dom element that can be dragged
 */
const change_draggable_prop = (draggable) => {
  let state = next_state();
  // if the state returned is not undefined 
  if (state){
    draggable.id = `drag-${state}`
    draggable.innerText = state
    return true;
  } 
  // if the state returned is undefined
  else {
    draggable.style.display = 'none';
    return false
  }
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
 * Colors a dropzone with the specified rgb color value. The dropzone to be
 * colored is retrieved by the id provided on method call.
 * @param {String} color an rgb color value
 * @param {DOM Element Id} id a property to uniquely identify a DOM element
 */
const colorDropzoneBackground = ( color, id ) => {
  let state = document.querySelector(`path#${id}`);
  state.setAttribute("style", `fill: ${color} !important`);
}



/**
 * Removes dragover and drop listener from a dropzone
 * @param {DOM Element} dropzone a svg segment ( path )
 */
const removeDropzoneListener = ( dropzone) => {
  dropzone.removeEventListener('dragover', ondragover_handler);
  dropzone.removeEventListener('drop', ondrop_handler);
}


/**
 * adds dragover and drop listener from a dropzone
 * @param {DOM Element} dropzone a svg segment ( path )
 */
const addDropzoneListener = (dropzone) => {
  dropzone.addEventListener('dragover', ondragover_handler);
  dropzone.addEventListener('drop', ondrop_handler);
}




/**
 * Animates a DOM element by including a prebuilt animate
 * css to the element's css class. The animate css class 
 * will be added if signal is true and removed if signal
 * is false
 * @param {DOM Element} element DOM element to animate
 * @param {Boolean} signal determines the inclusion or 
 * removal of css animate class
 */
const animateElement = (element, signal=true) => {
  if (signal==true){
    element.classList.add('slideup');
  }
  else {
    element.classList.remove('slideup');
  }
}





/**
 * Increments the current game play store by the value 
 * provided as score
 * @param {Integer} score the value to be computed as score
 */
const incrementCurrentScore = ( score ) => {
  let currentScoreDomElement = document.getElementById("current-score");
  animateElement(currentScoreDomElement, false)
  let newScore = parseInt(currentScoreDomElement.innerText) + score;
  currentScoreDomElement.innerText = newScore;
  animateElement(currentScoreDomElement, true);
}



const displayFinishingContent = ( ) => {
  // display the finishing popup as it is hidden by default
  document.querySelector('.game-finish-popup').style.display = 'flex';

  // set the finishing score on popup
  let currentScore = document.getElementById('current-score').innerText;
  document.querySelector('.finishing-score').innerText = currentScore;

  // set game finish time
  let finishTime = document.getElementById('countdown').innerText.split(':');
  document.querySelector('.game-finishing-time').innerText = 
                          `${finishTime[0]} minutes ${finishTime[1]} seconds`;
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
    // increment row count
    rowCount += 1;

    // generate a random color to fill the state path
    let color = generate_rand_color();
    
    // color dropzone on correct drop
    colorDropzoneBackground(color, draggableId);

    // remove dragover and drop event listener from the dropzone
    removeDropzoneListener(dropzone);

    // change draggable property
    draggableNameSet = change_draggable_prop(draggable);

    console.log("Is name set on draggable ? === " + draggableNameSet);



    console.log(rowCount)
    // set score for correct drop 
    if (rowCount >= 3){
      // increment current score with bonus score value
      incrementCurrentScore(rowScore);
      // reset rowCount
      rowCount = 0;
    } 
    else {
      // increment current score with correct score value
      incrementCurrentScore(correctScore)
    }

    
    // if draggable name was not set, it means a value that cannot
    // be set was returned ( e.g undefined is not settable )
    // which denotes that the player has completed the game
    if (draggableNameSet === false ) {
        // reset values
        GAME_START_FLAG = false;
        gameCompleted = true;
        displayFinishingContent();
    }

    if (gameCompleted === true) {
      console.log("Game over")
    }
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
      // only compute timing if game have started and game is not yet 
      // completed
      if(GAME_START_FLAG === true && gameCompleted === false){
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

      else {
        // display game completion box
      }
    }
  }

  
  updateTimer();
}


/**
 * retrieve and returns players name only if the retrieved value is 
 * not an empty string
 * 
 * @returns {String}
 */
const receivePlayerName = () => {
  let retrievedName = document.getElementById('id_player_name').value;
  document.getElementById('id_player_name').value = '';

  if (retrievedName != ''){
    return retrievedName
  }
}




/**
 * Hides the startup screen called popup window
 */
const closePopupWindow = () => {
  document.querySelector('.popup').style.display = 'none';
}





/**
 * This helps to set the name of the playing player on game play
 * @param {String} name representing the playing player
 */
const setPlayerName = ( name ) => {
  document.querySelector('.pp-name').innerText = name
}





const startGamePlay = ( event ) => {
  /**
   * 
   * EVERY CONFIGURATIONS HERE IS A ONE TIME SETTING,
   * THEY ARE ONLY CALLED ONCE WHEN START GAME BUTTON IS CLICKED ON
   */

  // first retrieve the value of player-name input
  let tempName = receivePlayerName()
  if(tempName){
    playerName = tempName
  }

  // next close the popup window
  closePopupWindow();

  // set player's name 
  setPlayerName(playerName);

  // set game start to true and game completed to false
  GAME_START_FLAG = true;
  gameCompleted = false;

  // repopulate states 
  states = [...tempStates];

  /*
    Set a listener on a draggable element and randomly set 
    a state on the draggable that'll be displayed at first.
  */
  draggable = document.querySelector('.draggable');
  draggable.addEventListener('dragstart', ondragstart_handler);
  draggable.addEventListener('drag', ondrag_handler);
  draggableNameSet = change_draggable_prop(draggable);



  // if the retry button is clicked after game is finished then, 
  // the popup window should be removed from view
  if (event.target.id === "retry") {
    // hide game finish popup
    document.querySelector('.game-finish-popup').style.display = 'none';
    

    // display draggable 
    draggable.style.display = 'block';
    
    // remove all colors added to dropzones from prior game play
    let regetDropZones = document.querySelectorAll(".state");
    regetDropZones.forEach((state) => {
      addDropzoneListener(state);
      state.setAttribute("style", "fill: #7c7c7c;");
    });

    // reset score
    document.getElementById('current-score').innerText = '00';
  }

  if (GAME_START_FLAG === true){
    countdown("countdown", 5, 20);
  }
}




// trigger game play using the start game button
let startGameBtn = document.querySelector('.start-game-btn');
let playOnBtn = document.querySelector('.retry-btn')
startGameBtn.addEventListener('click', startGamePlay);
playOnBtn.addEventListener('click', startGamePlay);
