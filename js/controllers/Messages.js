var app = angular.module('tinder.controllers.Messages', ['tinder.services.Messages']);

app.controller('MessagesCtrl', function($scope, $state, Messages){
  console.info('In Messages Ctrl');

  $scope.me = '124';

  Messages
    .conversations()
    .then(function(conversations){
      console.log(conversations)
      $scope.conversations = conversations;
    });

  $scope.loadConversation = function (id) {
    $scope.conversationID = id;
    Messages
      .conversation(id)
      .then(function(messages){
        $scope.messages = messages;
      });
  }

  $scope.sendMessage = function () {
    var message = Messages.createMessage($scope.conversationID, $scope.textMessage);
    $scope.textMessage = '';
    $scope.messages.push(message);
    Messages.send(message);
  }

  $scope.getLastMessage = function(c) {
    var totalMessages = c.messages.length;
    var lastMsg = totalMessages > 0 ? c.messages[totalMessages-1].message : 'Sent a message!';
    return lastMsg;
  }

  $scope.isMe = function(m) {
    return m.from == "55aafe46019193d83c77cf17";
  }
});
