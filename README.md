stickynotes
===========

A javascript library to cover your page in editable sticky notes.

![stickynotes](http://i.imgur.com/hfQdfIC.gif)

Setup
===========
Just include both `stickynotes.js` and `stickynotes.css` in your page.

Also requires jQuery.  Sorry.

Usage
===========
Clearly the only place to put stickynotes is on a whiteboard, so:

    var whiteboard = new Whiteboard();

The Whiteboard constructor takes an optional jQuery selector to confine the whiteboard to a particular section of page, defaulting to 'body'.

    var whiteboard = new Whiteboard('#whiteboard');

Interactions
===========
Interactions with the stickynotes have been optimized for creation speed and cheapness.

Click anywhere on the whiteboard at any time to create a new sticky note and start editing.

While editing, `enter` submits changes and `esc` cancels changes.

While not editing, hover over the stickynote with the mouse and press one of `y`, `b`, `r`, `g`, `p`, `m`, `c`, `t`, or `w` to change the color of the stickynote.

![stickynote colors](http://i.imgur.com/zCIjKnJ.gif)

Drag a sticky note to move it.  Double click on a sticky note to delete it.

It takes a little getting used to, since usually you click outside the note to submit/cancel changes.  Once you get used to it, though, this way is much faster.
