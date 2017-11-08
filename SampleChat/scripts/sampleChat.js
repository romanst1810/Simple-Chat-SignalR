(function () {
    var app = angular.module('chat-app', []);

    app.controller('ChatController', function ($scope) {

        // scope variables
        $scope.user={name:'Guest',message:''}
        $scope.messagesWH = [];
        $scope.messages = [];
        $scope.chatMessageObj = {};
        $scope.chatHub = null;

        $scope.tab = 'Lobby';
        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
            $scope.user.name = 'Guest';
            $scope.user.message = '';
            $scope.fillChatMessages(newTab);
        };
        $scope.isSet = function (tabName) {
            return $scope.tab === tabName;
        };
        $scope.addMessageToWH = function (groupId, newMessage) {
            $scope.messagesWH.push({ group: groupId, message: newMessage });
            $scope.messages = [];
            angular.forEach($scope.messagesWH, function (value, key) {
                if (value.group == groupId)
                    $scope.messages.push(value.message);
            });
        };

        $scope.fillChatMessages = function (groupId) {
            $scope.messages = [];
            angular.forEach($scope.messagesWH, function (value, key) {
                if (value.group == groupId)
                    $scope.messages.push(value.message);
            });
        };

        $scope.chatHub = $.connection.chatHub; // initializes hub
        $.connection.hub.start(); // starts hub

        // register a client method on hub to be invoked by the server
        $scope.chatHub.client.broadcastMessage = function (groupId, name, message) {
            var newMessage = name + ' says: ' + message;
            $scope.addMessageToWH(groupId, newMessage);
            $scope.$apply();
        };

        $scope.newMessage = function (group) {
            // sends a new message to the server
            $scope.chatMessageObj = { group: group, name: $scope.user.name, message: $scope.user.message }
            $scope.chatHub.server.sendMessage($scope.chatMessageObj);
            $scope.user.message = '';
        };
    });

    app.directive('fooBar', function () {
        var bookmarks = [
            {
                id: 1,
                name: 'Lobby'
            },
            {
                id: 2,
                name: 'Friends'
            },
            {
                id: 3,
                name: 'Family'
            }
        ];
        return {
            restrict: 'E',
            templateUrl: "bookmarks.html",
            link: function (scope, element, attrs) {
                console.log('directive');
                scope.bookmarks = bookmarks;
            }
        };
    });
}());