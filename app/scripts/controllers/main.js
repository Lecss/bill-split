'use strict';

/**
 * @ngdoc function
 * @name billSplitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the billSplitApp
 */
angular.module('billSplitApp')
  .controller('MainCtrl', function ($scope) {
        $scope.dial_btns = [1,2,3,4,5,6,7,8,9,"",0, "<-"];

        $scope.total = "0.00";

        $scope.friends = [];

        $scope.init = function(){
            $scope.friends.push({
                name: "Andreo", surname: "C.", active: false, avatar: "", amount: 0.00, fix: false
            })

            $scope.friends.push({
                name: "Dragos", surname: "C.", active: false, avatar: "", amount: 0.00, fix: false
            })

            $scope.friends.push({
                name: "Marius", surname: "P.", active: false, avatar: "", amount: 0.00, fix: false
            })

            $scope.friends.push({
                name: "Geo", surname: "P.", active: false, avatar: "", amount: 0.00, fix: false
            })
        }()


        $scope.update_split_amount = function(){
            var friendsEqual = $scope.friends.filter(x => x.active && !x.fix);

            var friendsFix = $scope.friends.filter(x => x.active && x.fix);
            var totalFix = friendsFix.
            reduce((a,b)=> { 
                return Number(a) + parseFloat(Number(b.amount).toFixed(2)); 
            }, 0);

            var totalNoFix = $scope.total - totalFix;

            for(let friend of friendsEqual){
                friend.amount = (Number(totalNoFix) / parseFloat(friendsEqual.length)).toFixed(2);

                console.log(friend.amount);
            }
        }

        $scope.$watch('friends',function(o,n){
            $scope.update_split_amount();
        }, true)


        $scope.append_number = function(val){
            if(isNaN(Number(val))){
                $scope.total = (Number($scope.total.slice(0,-1))/10).toFixed(2).toString();
                $scope.update_split_amount();
                return;
            }

            var x = Number($scope.total + val);
            $scope.total = (x * 10).toFixed(2).toString();

            $scope.update_split_amount();
        }
  });
