Zone Triggers
===================
A zone trigger allows you to define behavior for when an area defined by an object is entered by an avatar entity.  For example, through the use of the zone triggers tool, you could define behaviour for when you enter a house, such as the lights turning on.

Creating a Module
-------
To add a module to the zone trigger tool, find `actions.json` inside the triggers folder.  Like the other entries, you will need to specify a name, a description, and a set of attributes or fields that the trigger requires or may use.  The trigger action and attributes will be automatically displayed the next time you reload your interface scripts.

Once you have added the necessary information to `actions.json`, you must create your module script, which will need to be placed inside `triggers/modules/`.  You may look at the already existing modules for an example on how to implement your module.

