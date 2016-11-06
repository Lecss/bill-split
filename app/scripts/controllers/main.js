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
        $scope.total = "10.00";
        $scope.payer = "";
        $scope.showChoosePayer = false;
        $scope.message = "";

        $scope.states = { 
            enterAmount : "enterAmount",
            selectFriends: "selectFriends",
            selectFriendsAmount : "selectFriendsAmount"

        }

        $scope.currentState = $scope.states.enterAmount;

        $scope.friends = [];

        $scope.init = function(){
            $scope.friends.push({
                name: "Andreo", surname: "C.", active: true, avatar: "", amount: 0.00, fix: false
            }); 

            $scope.friends.push({
                name: "Alecs", surname: "D.", active: true, avatar: "", amount: 0.00, fix: false
            });

            $scope.friends.push({
                name: "Dragos", surname: "C.", active: false, avatar: "", amount: 0.00, fix: false
            });

            $scope.friends.push({
                name: "Marius", surname: "P.", active: false, avatar: "", amount: 0.00, fix: false
            });

            $scope.friends.push({
                name: "Geo", surname: "P.", active: false, avatar: "", amount: 0.00, fix: false
            });
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

        $scope.doNext = function(){
            if( $scope.currentState == $scope.states.enterAmount ){
                $scope.currentState = $scope.states.selectFriends;
            }else{
                $scope.currentState = $scope.states.selectFriendsAmount;
            }
        }

        $scope.doBack = function(){
            if( $scope.currentState == $scope.states.selectFriendsAmount ){
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
