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
