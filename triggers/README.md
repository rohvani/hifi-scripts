Zone Triggers
===================
A zone trigger allows you to define behavior for when an area defined by an object is entered by an avatar entity.  For example, through the use of the zone triggers tool, you could define behaviour for when you enter a house, such as the lights turning on.

Using Zone Triggers
-------
To create a zone trigger, first you must run the `hud.js` script on your interface, this will cause a button to be added to your tablet labeled `ZONE EDITOR`.  Once you are ready to create a zone trigger, click the button, there you will be provided with a UI that will assist you in preparing your zone trigger.

Zone triggers may be edited after being created via editing their `userdata` through the `CREATE` tool.  Additionally, you may make your zone invisible, as well as resizing it for the appropriate zone that you desire.  

Notes:

 1. Due to a limitation of High Fidelity's scripting API, a zone is only triggered by an avatar entity entering the cube that defines the zone trigger.  Additionally, for an avatar to be counted as being inside the cube, the center of the avatar must be within the cube.
 
 2. Some modules require existing objects, for example, the `spawner` and `sound` modules will grab the position of an object specified by their UUID to use for where to spawn an object or play a sound. 

 3. For the `spawner` module, you will be asked for a URL to JSON describing what to spawn.  You may obtain this by using the `CREATE` tool and exporting what you would like to spawn, be sure to upload the JSON somewhere so that the trigger can access it.

Using a Module
-------
By default, the zone trigger tool comes with several prebuilt generic modules (such as a spawner and sound player).  You may notice that some of these modules ask for the UUID of an object to use as a position, presently, we use this as an easier method for customizing your zone trigger instead of requiring you to input a set of coordinates.

Through the zone trigger tool, after you have filled out all the attributes, clicking the `CREATE` button will cause a small white cube to appear near your avatar.  This white cube defines not only the trigger, but also the area which the trigger will react to.  You should resize and position the cube as necessary.  You may also want to make the cube invisible once you have finished resizing and positioning it.

If there were any attributes that you forgot to fill or filled in incorrectly, you may change them via opening the `CREATE` tool and viewing the entity properties for the white cube mentioned above.  The attributes will be found in the user data, there the attributes and their values can be changed.

Technical Details
-------
All modules are loaded from `actions.json` by `hud.js`, these are sent to the tablet app webpage (`page.html` and `main.js`) through an event bridge.  Once a trigger has been customized and the `CREATE` button pressed, JSON representing the customized trigger will be sent back over the event bridge to the `hud.js` script.  The `hud.js` script is responsible for creating the zone trigger, giving it the proper userdata, and adding the `trigger.js` script to the zone trigger.

Once the zone trigger has been created in-world, `trigger.js` registers a `enterEntity` callback which is responsible for invoking the assigned module if the zone trigger has been entered by an avatar entity.  `trigger.js` will pass the customized trigger userdata along with some additional inherited (can be found in the Extra Information section) attributes to the module and invoke it's action.

Creating a Module
-------
To add a module to the zone trigger tool, find `actions.json` inside the triggers folder.  Like the other entries, you will need to specify a name, a description, and a set of attributes or fields that the trigger requires or may use.  The trigger action and attributes will be automatically displayed the next time you reload your interface scripts.

Once you have added the necessary information to `actions.json`, you must create your module script, which will need to be placed inside `triggers/modules/`.  You may look at the already existing modules for an example on how to implement your module.

Extra Information
-------

 - All modules have access to the position of the trigger that caused them to be invoked through accessing `userdata.properties.trigger_position`