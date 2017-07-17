Zone Triggers
===================
A zone trigger allows you to define behavior for when an area defined by an object is entered by an avatar entity.  For example, through the use of the zone triggers tool, you could define behaviour for when you enter a house, such as the lights turning on.

Using Zone Triggers
-------
To create a zone trigger, first you must run the `hud.js` script on your interface, this will cause a button to be added to your tablet labeled `ZONE EDITOR`.  Once you are ready to create a zone trigger, click the button, there you will be provided with a UI that will assist you in preparing your zone trigger.

Zone triggers may be edited after being created via editing their `userdata` through the `CREATE` tool.  Additionally, you may make your zone invisible, as well as resizing it for the appropriate zone that you desire.  

Notes:

 1. Due to a limitation of High Fidelity's scripting API, a zone is only triggered by an avatar entity entering the cube that defines the zone trigger.  Additionally, for an avatar to be counted as being inside the cube, the center of the avatar must be within the cube.
 
 2. Some modules require existing objects, for example, the `spawner` and `sound` modules will grab the position of an object specified by their UUID to use for where to spawn an object or play a sound.  In order to satisfy this, simply create a new object with the `CREATE` tool and copy its UUID (either during the trigger creation process or via editing the zone trigger's `userdata` through the `CREATE` tool.)

Creating a Module
-------
To add a module to the zone trigger tool, find `actions.json` inside the triggers folder.  Like the other entries, you will need to specify a name, a description, and a set of attributes or fields that the trigger requires or may use.  The trigger action and attributes will be automatically displayed the next time you reload your interface scripts.

Once you have added the necessary information to `actions.json`, you must create your module script, which will need to be placed inside `triggers/modules/`.  You may look at the already existing modules for an example on how to implement your module.

