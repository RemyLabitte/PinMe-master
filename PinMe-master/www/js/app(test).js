var app = angular.module('ionicApp', ['ionic', 'ionic-ratings', 'tabSlideBox', 'ngCordova']);

// app.run(function($q, $http, $rootScope, $location, $window, $timeout, $ionicPlatform, $cordovaGeolocation, defaultLocalisation, geoLocation) {
//   $ionicPlatform.ready(function() {
//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//       // for form inputs)
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//
//       // Don't remove this line unless you know what you are doing. It stops the viewport
//       // from snapping when text inputs are focused. Ionic handles this internally for
//       // a much nicer keyboard experience.
//       cordova.plugins.Keyboard.disableScroll(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//
//     $rootScope.$on("$locationChangeStart", function(event, next, current) {
//                 $rootScope.error = null;
//                 console.log("Route change!!!", $location.path());
//                 var path = $location.path();
//
//
//                 console.log("App Loaded!!!");
//             });
//
//             $cordovaGeolocation
//                 .getCurrentPosition()
//                 .then(function(position) {
//                     console.log(position);
//                     geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
//                 }, function(err) {
//                     // you need to enhance that point
//                     $ionicPopup.alert({
//                         title: 'Ooops...',
//                         template: err.message
//                     });
//
//                     geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude)
//                 });
//
//             // begin a watch
//             var watch = $cordovaGeolocation.watchPosition({
//                 frequency: 1000,
//                 timeout: 3000,
//                 enableHighAccuracy: true
//             }).then(function() {}, function(err) {
//                 // you need to enhance that point
//                 geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude);
//             }, function(position) {
//                 geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
//                 // broadcast this event on the rootScope
//                 $rootScope.$broadcast('location:change', geoLocation.getGeolocation());
//             });
//   });
// });

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'index.html',
    controller: 'IntroCtrl'
  })
  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'MainCtrl'
  });

  $urlRouterProvider.otherwise("/");

})

app.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $cordovaGeolocation, geoLocation) {

  // listen location changes
  $rootScope.$on('location:change', function(position) {
      $scope.position = geoLocation.getGeolocation();
      console.log($scope.position);
  });

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

  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('map');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

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

app.controller('MainCtrl', function($scope, $state, $cordovaGeolocation) {
  console.log('MainCtrl');

  $scope.toIntro = function(){
    $state.go('index');
  }

  var options = {timeout: 1000, enableHighAccuracy: true};

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
