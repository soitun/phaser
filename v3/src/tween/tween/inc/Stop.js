var TWEEN_CONST = require('../const');

//  Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the TweenManager

var Stop = function ()
{
    this.state = TWEEN_CONST.PENDING_REMOVE;
};

module.exports = Stop;
