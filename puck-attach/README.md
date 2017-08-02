Puck Attach
===================
Puck attach allows you to use the Vive Tracker pucks to track objects in real time in VR.

Using Puck Attach
-------
To track an object in VR using a puck, first you much run `puck-attach.js` as an interface script which will add a new application to your tablet called `PUCKTACH`.  

After opening the tablet app, you will be presented with a drop down of your currently active and valid pucks.  Select one of the pucks available and then click `Create Puck`, this will create a virtual puck in the world in front of your avatar.  Position the puck on the entity that you would like to track (ideally, if you are tracking a real world objects such as a guitar, place the puck in the same location that it is in the physical world relative to the entity you would like to track).

Once you are satisfied with the placement of the puck, click the `Finalize Puck` button.  Your entity will now be tracked by the selected puck and have its position and orientation updated in real time.

To remove pucks from an entity, simply unload the `puck-attach.js` script, this will remove all pucks and leave the entities where the pucks put them.


Requirements
-------

 - HTC Vive
 - At least one HTC Vive Tracker puck