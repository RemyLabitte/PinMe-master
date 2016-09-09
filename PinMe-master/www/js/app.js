// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-ratings', 'tabSlideBox', 'ngCordova']);

app.run(function($q, $http, $rootScope, $location, $window, $timeout, $ionicPlatform, $cordovaGeolocation, defaultLocalisation, geoLocation) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
                $rootScope.error = null;
                console.log("Route change!!!", $location.path());
                var path = $location.path();


                console.log("App Loaded!!!");
            });

            $cordovaGeolocation
                .getCurrentPosition()
                .then(function(position) {
                    console.log(position);
                    geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
                }, function(err) {
                    // you need to enhance that point
                    $ionicPopup.alert({
                        title: 'Ooops...',
                        template: err.message
                    });

                    geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude)
                });

            // begin a watch
            var watch = $cordovaGeolocation.watchPosition({
                frequency: 1000,
                timeout: 3000,
                enableHighAccuracy: true
            }).then(function() {}, function(err) {
                // you need to enhance that point
                geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude);
            }, function(position) {
                geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
                // broadcast this event on the rootScope
                $rootScope.$broadcast('location:change', geoLocation.getGeolocation());
            });
  });
});

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'index.html',
      controller: 'IndexCtrl',
    })
    .state('map', {
      url: '/map',
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl'
  });

  $urlRouterProvider.otherwise("/");

});

app.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
  });
});

// app.run(function($q, $http, $rootScope, $location, $window, $timeout, $ionicPlatform, $cordovaGeolocation, defaultLocalisation, geoLocation) {
//     $ionicPlatform.ready(function() {
//         if (window.cordova && window.cordova.plugins.Keyboard) {
//             // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//             // for form inputs)
//             cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//
//             // Don't remove this line unless you know what you are doing. It stops the viewport
//             // from snapping when text inputs are focused. Ionic handles this internally for
//             // a much nicer keyboard experience.
//             cordova.plugins.Keyboard.disableScroll(true);
//         }
//         if (window.StatusBar) {
//             StatusBar.hide();
//         }
//
//         $rootScope.$on("$locationChangeStart", function(event, next, current) {
//             $rootScope.error = null;
//             console.log("Route change!!!", $location.path());
//             var path = $location.path();
//
//
//             console.log("App Loaded!!!");
//         });
//
//         $cordovaGeolocation
//             .getCurrentPosition()
//             .then(function(position) {
//                 console.log(position);
//                 geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
//             }, function(err) {
//                 // you need to enhance that point
//                 $ionicPopup.alert({
//                     title: 'Ooops...',
//                     template: err.message
//                 });
//
//                 geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude)
//             });
//
//         // begin a watch
//         var watch = $cordovaGeolocation.watchPosition({
//             frequency: 1000,
//             timeout: 3000,
//             enableHighAccuracy: true
//         }).then(function() {}, function(err) {
//             // you need to enhance that point
//             geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude);
//         }, function(position) {
//             geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
//             // broadcast this event on the rootScope
//             $rootScope.$broadcast('location:change', geoLocation.getGeolocation());
//         });
//
//     });
// });
//
//
// app.config(function($stateProvider, $urlRouterProvider) {
//     $stateProvider.state('index', {
//         url: '/',
//         templateUrl: 'index.html',
//         controller: 'IndexCtrl'
//     });
//
//     $urlRouterProvider.otherwise("/");
// });

app.controller("ListPosCtrl", ['$scope',
  function($scope, $state){

    $scope.ratingsObject = {
      iconOn : 'ion-ios-star',
      iconOff : 'ion-ios-star-outline',
      iconOnColor: 'rgb(200, 100, 100)',
      iconOffColor:  '#ecf0f1',
      rating:  0,
      minRating:1,
      readOnly: false,
      callback: function(rating) {
        $scope.ratingsCallback(rating);
      }
    };

    $scope.ratingsCallback = function(rating) {
      $scope.rate = rating;
      console.log('Selected rating is : ', rating);
      console.log($scope.rate);
    };

    $scope.addPosition = function(place, rating) {
      $scope.places.push({
        title: place.title,
        latitude: place.latitude,
        longitude: place.longitude,
        rate: $scope.rate
      });
      place.title = '';
      place.latitude = '';
      place.longitude = '';
      console.log($scope.places);

      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    };

  }
]);
//
app.controller("IndexCtrl", function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, geoLocation, $cordovaCamera, $ionicPopup, $ionicModal, $ionicSlideBoxDelegate) {

        $scope.places = [
          {
            title: 'Test',
            latitude: '55.3333',
            longitude: '152.22222',
            rate: '5'
          }
        ];

        $scope.tabs = [{
            "text": ""
        }, {
            "text": ""
        }, {
            "text": ""
        }];

        $scope.position = {};

        $scope.onSlideMove = function(data) {};

        $scope.position = geoLocation.getGeolocation();

        $scope.saveWithPicture = function() {
            console.log("picture");
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                // var image = document.getElementById('myImage');
                // image.src = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                alert(err);
            });
        };

        $scope.gotomap = function() {
          console.log('ça marche');
          $state.go('map');
        };

        // A confirm dialog
        $scope.pinPosition = function() {
          var confirmPopup = $ionicPopup.confirm({
            title: '<i class="ion-location"></i> Pin new spot',
            template: 'Do want to add details on this spot?',
            cancelText: 'No, I\'ll do it later', // String (default: 'Cancel'). The text of the Cancel button.
            okText: 'Yes, I want to add details', // String (default: 'OK'). The text of the OK button.
          });

          confirmPopup.then(function(res) {
            if(res) {
              $scope.openModal();
            } else {
              console.log('You are not sure');
            }
          });
        };

        //PopUp with more information on position and localize place
        $scope.MoreInfo = function(place) {
          var localizePopup = $ionicPopup.confirm({
            title: 'More Informations and Localise',
            template: 'Do you want to go to ' + place.title + ' ?',
            cancelText: 'Close',
            okText: 'Localize',
          });

          localizePopup.then(function(res) {
            if(res) {
              console.log('Go!');
            } else {
              console.log('Back');
            }
          });
        }

        $ionicModal.fromTemplateUrl('new-spot.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        // listen location changes
        $rootScope.$on('location:change', function(position) {
            $scope.position = geoLocation.getGeolocation();
            console.log($scope.position);
        });

    }

);
