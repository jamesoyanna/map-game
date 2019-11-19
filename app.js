/** available states */
const states = ["edo", "oyo", ];


// defining the posible drop point on the screen will help to define
// accuracy of the dropped object...

// The location of each state on the screen covers a certain point,
// defining the point of each state on the screen will help to tell the
// accuracy of the dropped object

const posibleDropZone = {

  /** edo state */
  edo: {
    xCoord : [ 143, 181, 214 ],
    yCoord : [ 375, 427]
  },

  oyo: {
    xCoord : [ 81, 36, 95 ],
    yCoord : [ 288, 359, 370 ],
  }, 

}


// create an interactable target :: which is basically an object that
// can respond to drag, resize etc.
const slider = interact(".slider");

// the default position of the interactable target on the device
// view port
const sliderPos = { x: 0, y: 0 };

// include a draggable event to the interactable target.
slider.draggable({
  listeners: {
    // when dragging starts, do nothing
    start(event) {},

    // when the interactable target is moved, update it's
    // horizontal and vertical position using the co-ordinate of the
    // dragger -- which in this case would be the mouse.
    move(event) {
      sliderPos.x += event.dx;
      sliderPos.y += event.dy;

      // use css transform property to actually change the location
      event.target.style.transform = `translate(${sliderPos.x}px, ${sliderPos.y}px)`;
    }
  }
});




const check_state_drop_zone = (event) => {
  let draggedState;     // object to represent state dragged
  let draggedStateYpos; // represent current y position of dragged state
  let draggedSteteXpos; // represent current x position of dragged state

  // transverse through the list of states and get the state that
  // matches the dropped object
  states.map((state) => {
    if (state === event.dragEvent.currentTarget.innerText){
      draggedState = event.dragEvent.currentTarget;
      draggedStateXpos = event.dragEvent.client.x;
      draggedStateYpos = event.dragEvent.client.y;
    }
  });

  console.log(
    draggedState.innerText, 
    "\nX --> ", draggedStateXpos,
    "\nY --> ", draggedStateYpos
  );

  // retrieve the possible values of the xCoordinate of the dragged state
  let possibleXcoord = Object.values(
    posibleDropZone[draggedState.innerText].xCoord);

  // retrieve the possible values of the yCoordinate of the dragged state
  let possibleYcoord = Object.values(
    posibleDropZone[draggedState.innerText].yCoord);

  // get the min and max x position
  stateMinXcoord = Math.min(...possibleXcoord)
  stateMaxXcoord = Math.max(...possibleXcoord)

  // get the min and max y position 
  stateMaxYcoord = Math.max(...possibleYcoord)
  stateMinYcoord = Math.min(...possibleYcoord)

  // check if the dragged object x and y position is greater than
  // the min but lesser the max of both the x and y coordinate of the 
  // state representation on the map
  if (draggedStateXpos >= stateMinXcoord 
      && draggedStateXpos <= stateMaxXcoord) {

    if(draggedStateYpos >= stateMinYcoord 
      && draggedStateYpos <= stateMaxYcoord) {

      console.log("true");
      // increase point scored for the player for getting the 
      // location of state on the map

    }

  }
}



interact('.drop-location').dropzone({
  ondrop: check_state_drop_zone
})