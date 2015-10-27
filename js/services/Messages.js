var app = angular.module('tinder.services.Messages', ['tinder.services.TinderAPI']);

app.factory('Messages', function($q, TinderAPI){
  console.info('Loaded Messages Service');

  var conversations = [];

  var messages = [];

  return {
    conversations: function () {
      var promise = TinderAPI.getMessages();
      promise.then(function(cvts){
        conversations = cvts || [];
      })
      return promise;
    },
    conversation: function(id) {
      return $q(function(resolve, reject) {
        var filtered = conversations.filter(function(m){
          if (m._id == id)
            return m;
        });
        resolve(filtered[0].messages);
      });
    },
    send: function(msg) {
      return $q(function(resolve, reject) {
        setTimeout(function(){
          console.log('sended')
          messages.push(msg);
          resolve(msg);
        }, 1000)
      });
    },
    createMessage: function(cid, msg) {
      var total = messages.length;
      messages.push({from: '55aafe46019193d83c77cf17', user: 'Bruno Cascio', message: msg});
      return messages[total];
    }
  }
});
