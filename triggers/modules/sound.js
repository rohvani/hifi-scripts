/* userdata:
    audio_url,
    position_uuid
*/

module.exports.performAction = function(userdata) {
  Audio.playSound(userdata.audio_url, {
    position: Entities.getEntityProperties(userdata.position_uuid, ["position"]).position;,
    localOnly: false
  });
}