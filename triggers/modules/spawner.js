/* userdata:
    object_url,
    position_uuid,
    lifetime
*/

module.exports.performAction = function(userdata) {
  var json = Script.require(userdata.object_url);
  
  json.position = Entities.getEntityProperties(userdata.position_uuid, ["position"]).position;
  json.lifetime = userdata.lifetime;
  
  var ent = Entities.addEntity(json);
}