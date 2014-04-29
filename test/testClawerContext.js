var ClawRequest = require('../clawer/ClawRequest.js');
var Context = require('../clawer/ClawerContext.js');

var clawerContext = new Context();
clawerContext.fire();

var clawRequest = new ClawRequest(1, 'hello', 8119);
clawRequest.generateTasks();

