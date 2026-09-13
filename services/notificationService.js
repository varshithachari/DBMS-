const store = require('../data/store');

class NotificationService {
  getNotifications(role) {
    return store.getAllNotifications(role);
  }

  broadcast(data) {
    return store.addNotification(data);
  }
}

module.exports = new NotificationService();