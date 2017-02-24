// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var apple=angular.module('farmbuddy', ['ionic','farmbuddy.controllers','firebase','ion-google-autocomplete','ngCordova'])

apple.run(function($ionicPlatform) {
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
  });
})




  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyASh7lYMJ5dmRbK7DrdpDA263Y7QD3gRek",
    authDomain: "farmbuddy-aa5e7.firebaseapp.com",
    databaseURL: "https://farmbuddy-aa5e7.firebaseio.com",
    storageBucket: "farmbuddy-aa5e7.appspot.com",
    messagingSenderId: "684698248058"
  };
  firebase.initializeApp(config);

//Routes
apple.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  
  $stateProvider
    .state('intro', {
         cache: false,
      url: '/intro',
      templateUrl: 'templates/intro.html',
      controller:'introCtrl'

      

    })

    .state('setUp',{
      cache: false,
         url: '/First-Time-Setup',
      templateUrl: 'templates/setUp.html',
      controller:'setUpCtrl',
    
    })

    .state('cropMap',{
      cache: false,
         url: '/cropMap',
      templateUrl: 'templates/map.html',
      controller:'mapCtrl',
    
    })


    .state('create', {
   cache: false,
      url: '/create',
      templateUrl: 'templates/create.html',
      controller:'registerCtrl'

    })

    .state('searchBuddy', {
   cache: false,
      url: '/searchBuddy',
      templateUrl: 'templates/searchFolder/searchBuddy.html',
      controller:'searchBuddyCtrl'

    })

   .state('myfarmcrop', {
    cache:false,
      url: '/myFarmCrop',
       views: {
        '': {
       
          templateUrl: 'templates/farmcropFolder/myfarmcrop.html',
          controller:'myfarmcropCtrl'
          },
  }
      
     
    })

      .state('cropadd', {
        cache: false,
      url: '/CropAdd',
      templateUrl: 'templates/farmcropFolder/cropadd.html',
      controller:'cropaddCtrl'
 

    })

.state('selectedBuddy', {
  url: '/selectedBuddy/:buddyID',
  views: {
    '': {
      templateUrl: 'templates/searchFolder/selectedBuddy.html',
      controller: 'selectedBuddyCtrl'

    },
  },
  params: {
    buddyID: null,
  }
})
    .state('searchFarm', {
   cache: false,
      url: '/searchFarm',
      templateUrl: 'templates/searchFolder/searchFarm.html',
      controller: 'searchFarmCtrl'
    })

  .state('searchCrop', {
   cache: false,
      url: '/searchCrop',
      templateUrl: 'templates/searchFolder/searchCrop.html',
      controller: 'searchCropCtrl'

    })

     .state('search', {
   cache: false,
      url: '/search',
      templateUrl: 'templates/searchFolder/search.html',
      controller: 'searchCtrl'

    })
  
    .state('signin', {
    cache: false,
      url: '/signin',
      templateUrl: 'templates/signin.html',
      controller: 'SigninCtrl'

    })

    .state('home', {
        cache: false,
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })

    .state('home.menu', {
      cache: false,
      url: "/menu",
      views: {
        'menu-tab': {
          templateUrl: "templates/menu.html",
         
        }
      }
    })

    .state('home.reservations', {
      cache: false,
      url: "/reservationmenu",
      views: {
        'reservations-tab': {
          templateUrl: "templates/reservationFolder/reservationmenu.html",
          controller:'resmenuCtrl'

        }
      }
    })

  
    .state('home.profile', {
         cache: false,
      url: "/profile",
      views: {
        'profile-tab': {
          templateUrl: "templates/profile.html",
          controller:'profileCtrl'

        }
      }
    })

.state('reservationform', {
        cache: false,
      url: '/ReservationForm/:buddyID/:cropID',
      templateUrl: 'templates/reservationFolder/reservationform.html',
      controller:'reservationformCtrl',
        params: {
     cropname:null,     
    buddyID: null,
    cropID:null,
  }
    })

.state('reservationrequest', {
        cache: false,
      url: '/ReservationRequests',
      templateUrl: 'templates/reservationFolder/reservationrequest.html',
      controller:'reservationrequestCtrl'
    })

.state('myreservationrequest', {
        cache: false,
      url: '/MyReservationRequests',
      templateUrl: 'templates/reservationFolder/myreservationrequest.html',
       controller:'myreservationrequestCtrl'
    })

.state('acceptedreservation', {
        cache: false,
      url: '/AcceptedReservations',
      templateUrl: 'templates/reservationFolder/acceptedreservation.html',
      controller:'acceptedreservationsCtrl'
    })

.state('croprates', {
        cache: false,
      url: '/croprates',
      templateUrl: 'templates/croprates.html',
      controller:'cropratesCtrl'
    })

//**************************               ADMIN Mapping

    .state('admin', {
   cache: false,
      url: '/admin',
      templateUrl: 'templates/adminFolder/admin.html',
      controller: 'adminCtrl'
    })

   .state('admin_sellerRequest', {
   cache: false,
      url: '/admin_sellerRequest',
      templateUrl: 'templates/adminFolder/admin_sellerRequest.html',
      controller: 'adminCtrl'
    })

   .state('admin_ban', {
   cache: false,
      url: '/admin_ban',
      templateUrl: 'templates/adminFolder/admin_ban.html',
      controller: 'adminCtrl'
    })

   .state('admin_banList', {
   cache: false,
      url: '/admin_banList',
      templateUrl: 'templates/adminFolder/admin_banList.html',
      controller: 'adminCtrl'
    })
  $urlRouterProvider.otherwise("/intro");
  
});
