'use strict';

/**
 * @ngdoc function
 * @name billSplitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the billSplitApp
 */
angular.module('billSplitApp')
  .controller('MainCtrl', function ($scope, $localStorage) {

        $scope.dial_btns = [1,2,3,4,5,6,7,8,9,"",0, "<-"];

        $scope.$localStorage = $localStorage;
        $scope.total = "0.00";
        $scope.payer = "";
        $scope.showChoosePayer = false;
        $scope.message = "";
        $scope.editMode = false;
        $scope.lastFriendSelected; 


        $scope.states = { 
            enterAmount : "enterAmount",
            selectFriends: "selectFriends",
            selectFriendsAmount : "selectFriendsAmount",
            addFriend : "addFriend",
            removeFriend : "removeFriend"

        }

        var friendsRef = firebase.database().ref('friends/alecsD');

        $scope.newFriend = { name: "", surname : ""};

        $scope.friends = [];

        $scope.init = function(){
            
            friendsRef.on("child_added", function(resp){
                var user = resp.val();

                if (!user.avatar) user.avatar = "images/user.png"

                user.id = resp.key;
                $scope.friends.push(user);
            })

            friendsRef.on('child_removed', function(data) {
                var user = $scope.friends.filter(function(x) { return x.key === data.key});
                var index = $scope.friends.indexOf(user);
                $scope.friends.splice(index, 1);

                $scope.currentState = $scope.states.selectFriends;
            });

            $scope.currentState = $scope.states.enterAmount;

            console.log($scope.currentState)
            // $scope.friends.push({
            //     name: "Andreo", surname: "C.", active: false, avatar: "images/andrei.png", amount: 0.00, fix: false
            // }); 

            // $scope.friends.push({
            //     name: "Alecs", surname: "D.", active: false, avatar: "images/lecs.png", amount: 0.00, fix: false
            // });

            // $scope.friends.push({
            //     name: "Dragos", surname: "C.", active: false, avatar: "images/dragos.png", amount: 0.00, fix: false
            // });

            // $scope.friends.push({
            //     name: "Marius", surname: "P.", active: false, avatar: "images/marius.png", amount: 0.00, fix: false
            // });

            // $scope.friends.push({
            //     name: "Geo", surname: "P.", active: false, avatar: "images/geo.png", amount: 0.00, fix: false
            // });

           
        }();


        $scope.update_split_amount = function(){
            var friendsEqual = $scope.friends.filter(function(x){ return x.active && !x.fix});

            var friendsFix = $scope.friends.filter(function(x){return x.active && x.fix});
            var totalFix = friendsFix.
            reduce(function(a,b){ 
                return Number(a) + parseFloat(Number(b.amount).toFixed(2)); 
            }, 0);

            var totalNoFix = $scope.total - totalFix;

            for(var friend in friendsEqual){
                friendsEqual[friend].amount = (Number(totalNoFix) / parseFloat(friendsEqual.length)).toFixed(2);

                console.log(friendsEqual[friend].amount);
            }
        };

        $scope.$watch('friends',function(o,n){
            $scope.update_split_amount();
        }, true);

        $scope.$watch('currentState',function(o,n){
            console.log(o,n);
        }, true);


        $scope.append_number = function(val){
            if(isNaN(Number(val))){
                $scope.total = (Number($scope.total.slice(0,-1))/10).toFixed(2).toString();
                $scope.update_split_amount();
                return;
            }

            var x = Number($scope.total + val);
            $scope.total = (x * 10).toFixed(2).toString();

            $scope.update_split_amount();
        };

        $scope.submitSplit = function(){
            var transaction = getNewTransaction();
            var transactionsRef = database.ref('transactions');
            transactionsRef.push().set(angular.copy(transaction));

            transactionsRef.on('child_added', function(data) {
              $scope.message = data;
              setTimeout(function(){

                 $scope.$apply(function(){ $scope.showChoosePayer = false; });

                 setTimeout(function(){
                    location.reload();
                 },300)
              }, 1000);
            });
        };

        $scope.addRemoveFriend = function( friend ){
            $scope.lastFriendSelected = friend;

            if( !$scope.editMode ) {
                friend.active = !friend.active
            } else { 
                $scope.currentState = $scope.states.removeFriend;
            }
        }

        $scope.removeFriend = function(){
            friendsRef.child($scope.lastFriendSelected.id).remove();
        }

        $scope.doNext = function(){
            if( $scope.currentState == $scope.states.enterAmount ){
                $scope.currentState = $scope.states.selectFriends;
            }else if($scope.currentState == $scope.states.addFriend){
                friendsRef.push($scope.newFriend);
                $scope.newFriend = {};
                $scope.currentState = $scope.states.selectFriends;
            }else{
                $scope.currentState = $scope.states.selectFriendsAmount;
            }
        }

        $scope.doBack = function(){
            if( $scope.currentState == $scope.states.selectFriendsAmount ){
                $scope.currentState = $scope.states.selectFriends;
            }else if($scope.currentState == $scope.states.addFriend){
                $scope.currentState = $scope.states.selectFriends;
            }else{
                $scope.currentState = $scope.states.enterAmount;
            }
        }

        $scope.showBack = function(){
            return $scope.currentState != $scope.states.enterAmount && $scope.currentState != $scope.states.selecFriendsAmount;
        }

        $scope.showNext = function(){
            return $scope.currentState != $scope.states.selectFriendsAmount;
        }

        $scope.reload = function(){
            $scope.currentState = $scope.states.enterAmount;
        }

        var getNewTransaction = function() {
            var transaction = {
                date : new Date().toString(),
                details : "",
                payment : $scope.friends.filter(function(x){ return x.active}),
                payedBy: "",
                status : "pending",
                total: $scope.total
            };

            return transaction;
        };
  });
