const now = new Date();

const hour = now.getHours() + ':' + now.getMinutes();

const loginTime = hour.toString();

module.exports = loginTime