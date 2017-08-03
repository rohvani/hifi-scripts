Puck Attach
===================
Puck attach allows you to use the Vive Tracker pucks to track objects in real time in VR.

Using Puck Attach
-------
To track an object in VR using a puck, first you much run `puck-attach.js` as an interface script which will add a new application to your tablet called `PUCKTACH`.  

After opening the tablet app, you will be presented with a drop down of your currently active and valid pucks.  Select one of the pucks available and then click `Create Puck`, this will create a virtual puck in the world in front of your avatar.  Position the puck on the entity that you would like to track (ideally, if you are tracking a real world objects such as a guitar, place the puck in the same location that it is in the physical world relative to the entity you would like to track).

Once you are satisfied with the placement of the puck, click the `Finalize Puck` button.  Your entity will now be tracked by the selected puck and have its position and orientation updated in real time.

To remove a puck from an entity, simply select the puck from the dropdown where you originally selected it and then press the `Destroy Puck` button.  After pressing the `Destroy Puck` button, the entity will no longer be tracked and will remain in the last position it was tracked to.


Requirements
-------
 - HTC Vive
 - At least one HTC Vive Tracker puck