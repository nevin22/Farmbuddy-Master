var apple=angular.module('farmbuddy.controllers', ['ngStorage'])
var rootRef = firebase.database().ref();
var storageRef = firebase.storage().ref();
var auth=firebase.auth();


apple.directive('actualSrc', function () {
    return{
        link: function postLink(scope, element, attrs) {
            attrs.$observe('actualSrc', function(newVal, oldVal){
                 if(newVal != undefined){
                     var img = new Image();
                     img.src = attrs.actualSrc;
                     angular.element(img).bind('load', function () {
                         element.attr("src", attrs.actualSrc);
                     });
                 }
            });

        }
    }
});









   //<--------------------------------------Register Controller Controller------------------------------------->

apple.controller('registerCtrl',function($scope, $ionicPopup, $state ,$ionicLoading,$localStorage){

if($localStorage.buddyid!=null){
  $state.go('home.menu');

}
// Loading functions
$scope.show = function() {
  $ionicLoading.show({
     template: '<p>Loading...</p> <ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
   });
};
$scope.hide = function(){
    $ionicLoading.hide();
};
$scope.myGoBack = function() {
    window.history.back();
};


 

        //Register function
            $scope.Signup=function(email,password,confirmpassword){             
                 if(email ==null || password ==null || confirmpassword==null){
                    $ionicPopup.alert({
                        title: 'Error',         
                    });   
                }else{                         
                      if(password!=confirmpassword){
                          $ionicPopup.alert({
                          title: 'Incorrect Password',
                          template: 'Your Password Does Not Match'
                          });                   
                      }else{
                          $scope.show();
                          const promise=auth.createUserWithEmailAndPassword(email,password).then(function(response){                                                  
                               if (response != null) {     
                                   rootRef.child("Buddy").child(response.uid)
                                   .set({
                                    UID: response.uid,
                                    });     
                                 }
                               $scope.showAlert = function() {
                                 var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Your account has been created'
                                 });
                               };     
                                $localStorage.buddyid = response.uid;
                                $localStorage.email = response.email;
                                                                   
                                $scope.hide();
                                $scope.showAlert();
                                $state.go('setUp');
                             }).catch(function(error){
                                    $scope.hide();
                                    $scope.showAlert = function() {
                                        var alertPopup = $ionicPopup.alert({
                                        title: error.code,
                                        template:error.message
                                        });
                                    };
                                    $scope.showAlert();                 
                             });
                      }
                  }                 
            }               
});






              //<--------------------------------------Sign-in Controller------------------------------------->
apple.controller('SigninCtrl', function($scope,$firebaseArray, $state,$ionicLoading,$ionicPopup,$localStorage) {
  
if($localStorage.buddyid!=null){
  $state.go('home.menu');

}

          // Loading functions
           $scope.show = function() {
               $ionicLoading.show({
                  template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
               });
           };
          $scope.hide = function(){
               $ionicLoading.hide();
           };

            $scope.myGoBack = function() {
                    window.history.back();
                  };
         //Login Fcntion
          $scope.Login=function(email,password){
            if(email ==null || password ==null){
                     $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please Fill-up Everything'
                         });
                    }else{
                           $scope.show();
                         const promise=auth.signInWithEmailAndPassword(email,password).then(function(response){
                                $scope.hide();
                                $state.go('home.menu');

                                     $localStorage.buddyid = response.uid;
                                     $localStorage.email = response.email;
                                                                 
                         }).catch(function(error) {
                                    $scope.hide();
                                     $scope.showAlert = function() {
                                                 var alertPopup = $ionicPopup.alert({
                                                    title: error.code,
                                                    template:error.message
                                                 });
                                      };
                                      $scope.showAlert();
                           });
                    }

            }

     
 
});


   //<--------------------------------------Home Controller------------------------------------->


apple.controller('HomeCtrl', function($ionicPopup,$ionicLoading,$scope,$firebaseObject,$firebaseArray,$state,$window,$firebaseAuth,$localStorage){

// Loading functions
 $scope.show = function() {
     $ionicLoading.show({
        template: '<p>Verifying Admin Account ...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
     });
 };
$scope.hide = function(){
     $ionicLoading.hide();
};

var ref=firebase.database().ref();
var me=$firebaseObject(ref);
      $scope.Signout=function(){
         firebase.auth().signOut().then(function(){
           delete $localStorage.buddyid;
           delete $localStorage.email;
           $state.go('intro');   
      } ,function(error) 
          {
           alert('something went wrong');
          });
      }
      $scope.verifyAdmin=function(){
         $scope.show();
        var admin=rootRef.child('Admin_Credential').child('admin_uid');
        admin.once('value',function(snap){
       
          if(snap.val() == $localStorage.buddyid){   
            $state.go('admin');
            $scope.hide();
          }else{
            $scope.hide();
         $ionicPopup.alert({
        title: "<center>FAILED !</center>",
         template:"You don't have permission to visit admin panel"
       });
          }

        })        
      }
   badgeRef=rootRef.child('Buddy').child($localStorage.buddyid);
     badgeRef.on('value',function(snap){
       $scope.badgecount=snap.val().badgecount;
     })     
})




                  //   <------------------------------ PROFILE CONTROLLER ------------------------------->

apple.controller('profileCtrl',function($cordovaCamera,$scope,$firebaseArray,$ionicLoading,$firebaseObject,$state,$window,$timeout,$localStorage){
         $scope.showie = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner> <br>Please Wait..'
            });
        };

        $scope.hideos = function(){
            $ionicLoading.hide();
        };
 //

 $scope.showie();
$scope.changeImage=function(){

  document.addEventListener("deviceready", function () {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
   $scope.cbuddyURL=imageData;

    }, function(err) {
      alert(err);
    });



  }, false);
}
//
    Buddyref=rootRef.child('Buddy');

    

      Buddyref.child($localStorage.buddyid).on("value", function(snapshot) {
     $timeout(function(){

     $scope.buddyURL=snapshot.val().userImage;
     $scope.buddyId=snapshot.val().UID;
     $scope.buddyFName=snapshot.val().firstname;
     $scope.buddyLName=snapshot.val().lastname; 
     $scope.buddyContact=snapshot.val().contactNumber;
     $scope.buddyAbout=snapshot.val().about;
     $scope.buddyEmail=snapshot.val().email;
 
     $scope.cbuddyURL=angular.copy($scope.buddyURL);
     $scope.cbuddyFName=angular.copy($scope.buddyFName);
     $scope.cbuddyLName=angular.copy($scope.buddyLName);
     $scope.cbuddyContact=angular.copy($scope.buddyContact);
     $scope.cbuddyAbout=angular.copy($scope.buddyAbout);
     $scope.cbuddyEmail=angular.copy($scope.buddyEmail);

   $scope.hideos();
    });
     });



$scope.change=function(){
 $scope.main=true;
 $scope.edit=true;
}

$scope.cancel=function(){
 $scope.main=false;
 $scope.edit=false;
}





$scope.apply=function(first,about,contact,last,email,image){

Buddyref.child($localStorage.buddyid).update({
            userImage:image,
           firstname:first,
           lastname:last,
           contactNumber:contact,
           about:about,
           email:email
}) 
$scope.main=false;
 $scope.edit=false;                   
}


 $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
 $scope.main=false;
 $scope.edits=false;
  });

 
})


                  //   <------------------------------ Set uP CONTROLLER ------------------------------->
apple.controller('setUpCtrl',function($scope,$state,$timeout,$ionicPopup,$ionicLoading,$localStorage,$cordovaCamera){

$scope.pick=function(){

  document.addEventListener("deviceready", function () {

    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
    $scope.image=imageData;



    }, function(err) {
      alert(err);
    });



  }, false);
}
// Loading functions
        $scope.show = function() {
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });
        };

        $scope.hide = function(){
            $ionicLoading.hide();
        };
 $scope.showConfirm = function(buddy) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Submit Data',
     template: 'Are you sure the datas are correct?'
   });


   confirmPopup.then(function(res) {                  
    $scope.show();
     if(res) { 
       
                           Buddyref=rootRef.child('Buddy')
                           Buddyref.child($localStorage.buddyid).update({
                                      firstname:buddy.FirstName,
                                      lastname:buddy.LastName,
                                      contactNumber:buddy.Contact,
                                      about:buddy.About,
                                      email:$localStorage.email,
                                      userImage:$scope.image,
                                      adminStatus:"0",
                                      sellerStatus:"0"

                             }) 
                              
                       $scope.hide();  
                       $state.go('home.menu');          
                        
        }else {
                $scope.hide();
              }
   
   });



 };
})


        //   <------------------------------ Search Buddy CONTROLLER ------------------------------->

apple.controller('searchBuddyCtrl',function($scope,$state,$ionicLoading,$timeout,$ionicPopup,$firebaseArray){

buddyRef=firebase.database().ref().child('Buddy');
$scope.buddyList = $firebaseArray(buddyRef);

 $scope.myGoBack = function() {
                    window.history.back();
                  };

})





        //   <------------------------------ Search Crop CONTROLLER ------------------------------->

apple.controller('searchCropCtrl',function($ionicLoading,$scope,$state,$timeout,$ionicPopup,$firebaseArray,$localStorage){
   $scope.showie = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner> <br>Searching..'
            });
        };

        $scope.hideos = function(){
            $ionicLoading.hide();
        };
$scope.no=true;
$scope.myid=$localStorage.buddyid;
$scope.go=function(input){
  var cropref=rootRef.child('Crops').child(input);


 $scope.showie();
    rootRef.child('Crops').on('value',function(snap){
      if(snap.hasChild(input)){
       
        $scope.no=false;
        $scope.noResult=false;
        $scope.cropselectedlist=$firebaseArray(cropref);
        $scope.hideos();
      }else{
        $scope.no=false;
        $scope.noResult=true;
         $scope.cropselectedlist=false;
         $scope.hideos();
      }


    })
     $scope.toggle = false;
};


$scope.myGoBack = function() {
                    window.history.back();
                  };



})




apple.controller('searchCtrl',function($scope,$state){


  $scope.myGoBack = function() {
                    window.history.back();
                  };
})




apple.controller('searchFarmCtrl',function($scope,$state){

  $scope.myGoBack = function() {
                    window.history.back();
                  };
})




   //   <------------------------------SelectedBuddy CONTROLLER ------------------------------->

apple.controller('selectedBuddyCtrl',function($scope,$state,$firebaseArray,$firebaseObject,$stateParams,$timeout,$ionicPopup,$localStorage,$ionicLoading){
selectedBuddyRef=rootRef.child('Buddy');
var buddy=$stateParams.buddyID;


  selectedBuddyRef.child(buddy).on("value", function(snapshot) {
       $timeout(function(){
            
           $scope.buddyURL=snapshot.val().userImage;
           $scope.buddyId=snapshot.val().UID;
           $scope.buddyFName=snapshot.val().firstname;
           $scope.buddyLName=snapshot.val().lastname;
           $scope.buddyContact=snapshot.val().contactNumber;
           $scope.buddyAbout=snapshot.val().about;
           $scope.buddyEmail=snapshot.val().email; 

        });

  });

  

cropRef=rootRef.child('Buddy').child(buddy).child('usercrops');
$scope.buddycrops=$firebaseArray(cropRef);

$scope.reveal=function(){
rootRef.child('Buddy').child(buddy).on('value',function(snap){
    if(snap.hasChild('usercrops')){
    $scope.reveal=!$scope.reveal;
    }else{
    $scope.wew=true;
    $scope.reveal=false;
    }

})

}


 $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
 $scope.wew=false;
 
  });

 var alertPopup; 

$scope.showAlert = function(crops) {
       alertPopup = $ionicPopup.alert({
        title: "<div style='background-color:red;'><i style='color:#C8F7C5;' class='icon ion-leaf placeholder-icon'></i><b style='color:#C8F7C5'>"+crops.cropname+"</b></div>",
         template: 
         "<br/><div><p><i style='color:#grey;' class='icon ion-ios-location placeholder-icon'></i>"+crops.croplocation+"</p></div>"+
         "<p><i style='color:#grey;' class='icon ion-ios-grid-view placeholder-icon'></i>"+crops.crophectars+" hectars</p>"+
         "<p><i style='color:#grey;' class='icon ion-ios-information-outline placeholder-icon'></i>"+crops.cropinfo+"</p><br/>"
       });


     };

     $scope.sendOrder = function() {
      alertPopup.close();
    };



 $scope.myGoBack = function() {
                    window.history.back();
                  };


})




   //   <------------------------------ MYfarmcrop CONTROLLER ------------------------------->

apple.controller('myfarmcropCtrl',function($scope,$state,$ionicPopup,$ionicLoading,$firebaseArray,$localStorage,$cordovaCamera){

  $scope.showie = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner> <br>Please Wait..'
            });
        };
  $scope.hideos = function(){
            $ionicLoading.hide();
        };

//reference
var cropref=rootRef.child('Buddy').child($localStorage.buddyid).child('usercrops');
$scope.mycrops=$firebaseArray(cropref);

$scope.showie();
var sh=rootRef.child('Buddy').child($localStorage.buddyid);
var me=firebase.database().ref().child('Buddy');

   sh.once("value", function(snapshot) {
      if(snapshot.hasChild('usercrops')){
        $scope.hide=!$scope.hide;
     
      }
      if(snapshot.hasChild('usercrops')){
        $scope.show=!$scope.show;
       
      }
   $scope.hideos();       
   });

//update photo
$scope.update=function(crop){
 document.addEventListener("deviceready", function (){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
       $scope.shoes();
   //updating process
       croplistRef=rootRef.child('Crops').child(crop.cropname).child(crop.cropid);
       croplistRef.update({cropimage:imageData})
       cropref.child(crop.cropid).update({cropimage:imageData})
       $scope.hideoshi();
    }, function(err) {
       alert(err);
       $scope.hideoshi();
    });
 }, false);
}

//Check if user has been validated
$scope.validationChecker = function(){
  rootRef.child('Buddy').child($localStorage.buddyid).on('value',function(snap){
    if(snap.hasChild('validatedSeller')){
      $state.go('cropadd');  
    }else{
      alert("Please validate you account first before adding a crop !");
      $state.go('validationScreen');  
      // TODO   change the alert to Pop-up and Add loading functions :)
    }

  })
}




$scope.delete=function(cropid,cropname){




  rootRef.child('Buddy').on('child_added',function(snap){
    rootRef.child('Buddy').child(snap.key).child('myreservationrequests').on('child_added',function(snapshot){
      if(snapshot.val().postcropid == cropid){
          rootRef.child('Buddy').child(snap.key).child('myreservationrequests').child(snapshot.key).update({
              poststatus:'POST DELETED'
          })
      }
    })
  })



  rootRef.child('Buddy').child($localStorage.buddyid).child('usercrops').child(cropid).remove();
  rootRef.child('Crops').child(cropname).child(cropid).remove();

}

// loading functions
          $scope.shoes = function() {
            $ionicLoading.show({
                template: 'Adding Your Crop<br><img src="img/loader (2).gif">'
            });
        };

        $scope.hideoshi = function(){
            $ionicLoading.hide();
        };

 
})



   //   <------------------------------crop Add CONTROLLER ------------------------------->

apple.controller('cropaddCtrl',function($ionicLoading,$cordovaCamera,$scope,$state,$timeout,$ionicPopup,$firebaseArray,$localStorage,$filter){
   
          $scope.show = function() {
            $ionicLoading.show({
                template: 'Adding Your Crop<br><img src="img/loader (2).gif">'
            });
        };

        $scope.hide = function(){
            $ionicLoading.hide();
        };

   $scope.pick=function(){

                    document.addEventListener("deviceready", function () {
                      var options = {
                        quality: 75,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,                
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 500,
                        targetHeight: 500,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                      };
                        $cordovaCamera.getPicture(options).then(function(imageData) {
                        $scope.image=imageData;
                      }, function(err) {
                        alert(err);
                      });
                    }, false);
                  }


cropref=rootRef.child('Crops');
buddyref=rootRef.child('Buddy');



$scope.countryCode = 'PH';

$scope.onAddressSelection = function (location) {
$scope.address=location.formatted_address;
};
//

firstname=buddyref.child($localStorage.buddyid);

               

$scope.confirm=function(name,hectare,planted,harvest,info){
var add=$scope.address;
if(name== null || hectare==null || planted == null || harvest == null || info == null || add == null || $scope.image == null ){
       $ionicPopup.alert({
                        title: 'Error',
                        template: 'Please Fill Up Everyting'
                     });
}else{
          var a=planted.getTime() +(62 * 24 * 60 * 60 * 1000);
          var b=harvest.getTime();
          if(a > b ){
                 $ionicPopup.alert({
                                  title: 'Value Error',
                                  template: 'Farmbuddy Only Accepts Crops With Atleast 2 Months Before Harvest Date'
                               });
          }else{

            $scope.show();
          var date = new Date();

                  var cropkey=cropref.child(name).push().key;
                  firstname.once("value", function(snapshot) {
                                  
                                    cropref.child(name).child(cropkey).set({
                                            cropid:cropkey,
                                            croppostdate:date.toDateString(),
                                            cropname:name,
                                            croplocation:$scope.address,
                                            crophectars:hectare,
                                            cropplantdate:planted.toDateString(),
                                            cropharvestdate:harvest.toDateString(),                                 
                                            cropinfo:info,
                                            cropseller:snapshot.val().firstname,
                                            cropsellerid:$localStorage.buddyid,
                                            cropselleremail:snapshot.val().email,
                                            cropsellermobile:snapshot.val().contactNumber,
                                            cropimage:$scope.image

                                    })
                                      
                                        buddyref.child($localStorage.buddyid).child('usercrops').child(cropkey).set({
                                            cropid:cropkey,
                                            croppostdate:date.toDateString(),
                                            cropname:name,
                                            croplocation:$scope.address,
                                            crophectars:hectare,
                                            cropplantdate:planted.toDateString(),
                                            cropharvestdate:harvest.toDateString(),         
                                            cropinfo:info,
                                            cropimage:$scope.image
                                        }).then(function() {
                                          $scope.hide();
                                              $ionicPopup.alert({
                                                  title: 'SUCCESS',
                                                  template: 'Successfully Added A Crop'
                                               });
                                          })
                            
                                        
                                         $state.go('myfarmcrop');  
                          })
            

                 
          }


    }
}
})


   //   <------------------------------ReservationForm CONTROLLER ------------------------------->

apple.controller('reservationformCtrl',function($scope,$state,$firebaseArray,$stateParams,$timeout,$ionicPopup,$localStorage){



var buddyID=$stateParams.buddyID;
var cropID=$stateParams.cropID;
var cropName=$stateParams.cropname;
var cropRef=rootRef.child('Crops').child(cropName).child(cropID);
var userRef=rootRef.child('Buddy').child($localStorage.buddyid);
var resRef=rootRef.child('Buddy').child(buddyID).child('reservationOffers');





myreservationRef=rootRef.child('Buddy').child($localStorage.buddyid).child('myreservationrequests');

$scope.myGoBack = function() {
                    window.history.back();
                  };


$scope.submit=function(reservation){

        userRef.once('value',function(snap){

               cropRef.once('value',function(snapshot){
                   var resKey=resRef.push().key;
                       resRef.child(resKey).set({
                              resbuyername:snap.val().firstname,
                              rescropid:cropID,
                              rescropname:snapshot.val().cropname,
                              respostdate:snapshot.val().croppostdate,
                              resid:resKey,
                              resbuyerid:$localStorage.buddyid,
                              ressellerid:buddyID,
                              resoffer:reservation.price,
                              resinfo:reservation.info
                       })


                       myreservationRef.child(resKey).set({
                              postresid:resKey,
                              postdate:snapshot.val().croppostdate,
                              poststatus:'PENDING',
                              postseller:snapshot.val().cropseller,
                              postsellerid:snapshot.val().cropsellerid,
                              postcropid:snapshot.val().cropid,
                              postname:snapshot.val().cropname,
                              postplantdate:snapshot.val().cropplantdate,
                              postharvestdate:snapshot.val().cropharvestdate,
                              postlocation:snapshot.val().croplocation,
                              posthectars:snapshot.val().crophectars,
                              postcropinfo:snapshot.val().cropinfo,
                              postmyoffer:reservation.price,
                              postmyinfo:reservation.info
                       })

                       .then(function() {
                            $ionicPopup.alert({
                                title: 'SUCCESS',
                                template: 'Successfully Applied For A Reservation'
                             });

                               rootRef.child('Buddy').child(buddyID).once('value',function(snap){
                                 badgecount=snap.val().badgecount;

                                  if(badgecount != "" && snap.hasChild('badgecount')){
                           
                                      var newbadge=parseInt(badgecount)+1;
                                        rootRef.child('Buddy').child(buddyID).update({
                                         badgecount:newbadge
                                       })
                                        
                                    
                                  }else{
                                
                                      rootRef.child('Buddy').child(buddyID).update({
                                         badgecount:'1'
                                       })
                                        
                                  }
                               })
                         })
                      $state.go('myreservationrequest');
               })
 

        })
 

}

})




   //   <------------------------------ReservationRequest CONTROLLER ------------------------------->

apple.controller('reservationrequestCtrl',function($scope,$state,$firebaseArray,$ionicLoading,$stateParams,$timeout,$ionicPopup,$localStorage){
 $scope.showie = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner> <br>Please Wait..'
            });
        };

        $scope.hideos = function(){
            $ionicLoading.hide();
        };
resRef=rootRef.child('Buddy').child($localStorage.buddyid).child('reservationOffers');
acceptedresRef=rootRef.child('Buddy').child($localStorage.buddyid).child('acceptedReservations');

$scope.reservationOffers=$firebaseArray(resRef);

$scope.myGoBack = function() {
                    window.history.back();
                  };



$scope.accept=function(offer){

//Update The My Reservation Status
rootRef.child('Buddy').child(offer.resbuyerid).child('myreservationrequests').child(offer.resid).update({
  poststatus:'ACCEPTED'
})

crop=rootRef.child('Crops').child(offer.rescropname);
acceptedresRefSeller=rootRef.child('Buddy').child(offer.resbuyerid).child('acceptedReservations');

//<---Add to acceptedReservations--->

crop.child(offer.rescropid).once('value',function(snap){
      acceptedresRef.child(snap.val().cropid).set({
              arbuyername:offer.resbuyername,
              arbuyerid:offer.resbuyerid,
              arbuyeroffer:offer.resoffer,
              arbuyermessage:offer.resinfo,
              arid:snap.val().cropid,
              croppostdate:snap.val().croppostdate,
              cropname:snap.val().cropname,
              croplocation:snap.val().croplocation,
              crophectars:snap.val().crophectars,
              cropplantdate:snap.val().cropplantdate,
              cropharvestdate:snap.val().cropharvestdate,                                 
              cropinfo:snap.val().cropinfo,
              cropseller:snap.val().cropseller,
              cropsellerid:snap.val().cropsellerid,
              buyer:'fuck'

      });

      acceptedresRefSeller.child(snap.val().cropid).set({
              arbuyername:offer.resbuyername,
              arbuyerid:offer.resbuyerid,
              arbuyeroffer:offer.resoffer,
              arbuyermessage:offer.resinfo,
              arid:snap.val().cropid,
              croppostdate:snap.val().croppostdate,
              cropname:snap.val().cropname,
              croplocation:snap.val().croplocation,
              crophectars:snap.val().crophectars,
              cropplantdate:snap.val().cropplantdate,
              cropharvestdate:snap.val().cropharvestdate,                                 
              cropinfo:snap.val().cropinfo,
              cropseller:snap.val().cropseller,
              cropsellerid:snap.val().cropsellerid,
              seller:'fuck'

      });



}).then(function() {
                    $ionicPopup.alert({
                        title: 'SUCCESS',
                        template: 'You have successfully accepted an offer. Other offers for this crop will now be removed'
                     });

                     rootRef.child('Buddy').child(offer.resbuyerid).once('value',function(snap){
                                 badgecount=snap.val().badgecount;

                                  if(badgecount != "" && snap.hasChild('badgecount')){
                           
                                      var newbadge=parseInt(badgecount)+1;
                                        rootRef.child('Buddy').child(offer.resbuyerid).update({
                                         badgecount:newbadge
                                       })
                                        
                                    
                                  }else{
                                
                                      rootRef.child('Buddy').child(offer.resbuyerid).update({
                                         badgecount:'1'
                                       })
                                        
                                  }
                               })


                })

//<---remove reservations--->

resRef.on('child_added',function(snapshot){
  if(snapshot.val().rescropid==offer.rescropid){
    resRef.child(snapshot.val().resid).remove()
  }
})

//<---remove from cropList--->

rootRef.child('Crops').child(offer.rescropname).child(offer.rescropid).remove();

//<---remove from userCroplist--->

usercropRef=rootRef.child('Buddy').child($localStorage.buddyid).child('usercrops');
usercropRef.on('child_added',function(snapshot){
  if(snapshot.val().cropid==offer.rescropid){
      usercropRef.child(offer.rescropid).remove()
  }
})


}


//<---Remove Unwanted Request--->
$scope.remove=function(offer){

rootRef.child('Buddy').child(offer.resbuyerid).child('myreservationrequests').child(offer.resid).update({
  poststatus:'REJECTED'
})

resRef.child(offer.resid).remove().then(function() {
  $ionicPopup.alert({
      title: 'Removed',
      template: 'Request has been removed'
   });

        rootRef.child('Buddy').child(offer.resbuyerid).once('value',function(snap){
                                 badgecount=snap.val().badgecount;

                                  if(badgecount != "" && snap.hasChild('badgecount')){
                           
                                      var newbadge=parseInt(badgecount)+1;
                                        rootRef.child('Buddy').child(offer.resbuyerid).update({
                                         badgecount:newbadge
                                       })
                                        
                                    
                                  }else{
                                
                                      rootRef.child('Buddy').child(offer.resbuyerid).update({
                                         badgecount:'1'
                                       })
                                        
                                  }
                               })
})
}

//
$scope.showie();
rootRef.child('Buddy').child($localStorage.buddyid).on('value',function(snap){

    if(snap.hasChild('reservationOffers')){
    $scope.reveal=false;
    $scope.hideos();
    }else{
    $scope.wew=true;
    $scope.hideos();
    }

})



 $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
 $scope.wew=false;
 $scope.reveal=true;
  });
//
})



//   <------------------------------Accepted Reservation CONTROLLER ------------------------------->

apple.controller('acceptedreservationsCtrl',function($scope,$ionicLoading,$state,$firebaseArray,$stateParams,$timeout,$ionicPopup,$localStorage){

   $scope.showie = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner> <br>Please Wait..'
            });
        };

        $scope.hideos = function(){
            $ionicLoading.hide();
        };

acceptedresRef=rootRef.child('Buddy').child($localStorage.buddyid).child('acceptedReservations');
$scope.acceptedreservations=$firebaseArray(acceptedresRef);

//
$scope.showie();
rootRef.child('Buddy').child($localStorage.buddyid).on('value',function(snap){
    if(snap.hasChild('acceptedReservations')){

    $scope.reveal=false;
    $scope.hideos();
    }else{
      $scope.hideos();
    $scope.wew=true;
    }

})



 $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
 $scope.wew=false;
  $scope.reveal=true;
  });

//

$scope.showcrop=function(reservation){
  $ionicPopup.alert({
      title: "<i style='color:#DCEDC8;'' class='icon ion-leaf placeholder-icon'></i><b>"+reservation.cropname+"</b",
      template:
      "<b>CROP LOCATION</b><br/>"+ reservation.croplocation+"<br/>"+
      "<b>NUMBER OF HECTARES</b><br/>"+ reservation.crophectars+"<br/>"+
      "<b>CROP PLANT DATE</b><br/>"+ reservation.cropplantdate+"<br/>"+
      "<b>CROP ESTIMATED HARVEST DATE</b><br/>"+ reservation.cropharvestdate+"<br/>"+
      "<b>Additional Info</b><br/>"+ reservation.cropinfo+"<br/><br/>"+
      "Date Posted : "+ reservation.croppostdate+" | "+reservation.arbuyername+"<br/>"+
      "Crop Image : "


  });


}


$scope.notice=function(info){
    $ionicPopup.alert({
      title: "Cancellation Notice",
      template:info.notice+"<br>"+"<br>"+
      "Please Contact The Seller For More Information"
      
  });
  var rm=rootRef.child('Buddy').child($localStorage.buddyid).child('acceptedReservations').child(info.arid);
        rm.remove().then(function(){
       console.log('deleted');          
        })

}

$scope.sendnotice=function(info){
 $ionicPopup.prompt({
   title: 'Cancellation Notice',
   template: 'Please state the reason',
   inputType: 'text',
 }).then(function(res) {
   $scope.notice=res;

    $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Reservation will be Deleted',
     template: 'Are you sure you want to cancel this reservation?'
   });

   confirmPopup.then(function(res) {
     if(res) {
        var rm=rootRef.child('Buddy').child($localStorage.buddyid).child('acceptedReservations').child(info.arid);
        rm.remove().then(function(){
             $ionicPopup.alert({
                title: "Reservation Deleted",
                template:
                "A cancellation notice has been Sent to the buyer"
            });

             var buyer=rootRef.child('Buddy').child(info.arbuyerid).child('acceptedReservations').child(info.arid).update({
                notice:$scope.notice,
             })
        })
     } 
   });
 };
 $scope.showConfirm();


 });
}




$scope.myGoBack = function() {
                    window.history.back();
                  };

})





//   <------------------------------My Reservation Request CONTROLLER ------------------------------->


apple.controller('myreservationrequestCtrl',function($scope,$state,$ionicLoading,$firebaseArray,$stateParams,$timeout,$ionicPopup,$localStorage){

  $scope.myGoBack = function() {
                    window.history.back();
                  };

 $scope.showie = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner> <br>Please Wait..'
            });
        };

        $scope.hideos = function(){
            $ionicLoading.hide();
        };
  myresRef=rootRef.child('Buddy').child($localStorage.buddyid).child('myreservationrequests');

  $scope.myres=$firebaseArray(myresRef);

  




   $scope.remove=function(res){
myresRef=rootRef.child('Buddy').child($localStorage.buddyid).child('myreservationrequests');
sellerRef=rootRef.child('Buddy').child(res.postsellerid).child('reservationOffers');
myresRef.child(res.postresid).remove();
sellerRef.child(res.postresid).remove();


  }

  $scope.showcrop=function(res){
  $ionicPopup.alert({
      title: "<i style='color:#DCEDC8;'' class='icon ion-leaf placeholder-icon'></i><b>Seller's Crop Info</b",
      template:
      "<b>CROP NAME</b><br/>"+ res.postname+"<br/>"+
      "<b>LOCATION</b><br/>"+ res.postlocation+"<br/>"+
      "<b>HECTARS</b><br/>"+ res.posthectars+"<br/>"+
      "<b>PLANT DATE</b><br/>"+ res.postplantdate+"<br/>"+
      "<b>HARVEST DATE</b><br/>"+ res.postharvestdate+"<br/>"+
      "<b>ADDITIONAL INFO</b><br/>"+ res.postcropinfo+"<br/><br/>"+
      "<center><br/><b style='color:#1E824C;font-size:18px'>MY OFFER</b><br/></center>"+
      "<br/><b>PRICE OFFER</b><br/>"+ res.postmyoffer+"<br/>"+
      "<b>OFFER INFO </b><br/>"+ res.postmyinfo+"<br/><br/>"

  });


}

$scope.showie();
rootRef.child('Buddy').child($localStorage.buddyid).on('value',function(snap){
    if(snap.hasChild('myreservationrequests')){

        $scope.reveal=false;
        $scope.hideos();
    }else{
     $scope.wew=true;
      $scope.hideos();
    }

})



 $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
 $scope.wew=false;
  $scope.reveal=true;
  });


})



//   <------------------------------resMenu  CONTROLLER ------------------------------->


apple.controller('resmenuCtrl',function($scope,$state,$localStorage){

   badgeRef=rootRef.child('Buddy').child($localStorage.buddyid);
    
     badgeRef.on('value',function(snap){
       badgeRef.update({
        badgecount:""
       })
     })


  
})


//   <------------------------------map  CONTROLLER ------------------------------->


apple.controller('mapCtrl',function($scope,$state,$localStorage,$firebaseArray,$firebaseObject,$compile){




  var myCenter = new google.maps.LatLng(12,122 );
  var mapCanvas = document.getElementById("map");
  var mapOptions = {
                    center: myCenter, 
                    zoom: 5,
                    disableDefaultUI: true,
                    zoomControl:true,
                    fullscreenControl:true,
                    mapTypeId:'roadmap' 
                    //google.maps.MapTypeId.HYBRID
  };

  //map initialization
var map = new google.maps.Map(mapCanvas, mapOptions);

$scope.toogle=function(){
  if($scope.satellite != true){
 $scope.satellite = true;
 $scope.roadmap = true;
 map.setMapTypeId(google.maps.MapTypeId.HYBRID);

  }else{
     $scope.satellite = false;
 $scope.roadmap = false;
  map.setMapTypeId('roadmap');
 

  }
}

/* add marker on click
map.addListener('click',function(e){
 var marker= new google.maps.Marker({
    position:e.latLng,
    map:map
  })
  map.panTo(e.latLng);
})
*/




var icon = {
    url: "img/marker.png", // url
    scaledSize: new google.maps.Size(80, 80), // scaled size

};


geocoder = new google.maps.Geocoder();

var markers=[];

  
  $scope.cropSelected=function(crop){

$scope.remove();//para mawala xa daan ang mga markers sa previous shit
    var cropRef=rootRef.child('Crops').child(crop);
    var list=$firebaseArray(cropRef);
     list.$loaded().then(function(){
          for(var i=0; i<list.length; i++){  

             var address = list[i].croplocation;
             var cropname=list[i].cropname;
             var harvestdate=list[i].cropharvestdate;
             var plantdate=list[i].cropplantdate;
             var postdate=list[i].croppostdate;
             var info=list[i].cropinfo;
             var crophectars=list[i].crophectars;
             var cropseller=list[i].cropseller;
             var email=list[i].cropselleremail;
            var mobile=list[i].cropsellermobile;
             var cropid=list[i].cropid;
             var cropsellerid=list[i].cropsellerid;
   


             geocoder.geocode( { 'address': address}, function(results, status){
                  if (status == 'OK') {

                       // map.setCenter(results[0].geometry.location);
                        var marker= new google.maps.Marker({

                            map: map,
                            position: results[0].geometry.location,
                            animation: google.maps.Animation.BOUNCE,
                            icon:icon
                        });
                        markers.push(marker);
//show info window
                        marker.addListener('click', function() {

                              var contentString='<div id="content">'+
                                '<div id="siteNotice">'+
                                '</div>'+
                                '<h1  id="firstHeading" style="font-size:24px;color:#78a64a" class="firstHeading">'+  cropname + '</h1>'+
                                '<div id="bodyContent">'+
                                '<p style="color:grey" ><b>Location</b><br/>'+results[0].formatted_address+'</p>'+
                                '<p style="color:grey" ><b>Number Of Hectars</b><br/>'+crophectars+'</p>'+
                                '<p style="color:grey" ><b>Seller Name</b><br/>'+cropseller+'</p>'+
                                '<p style="color:grey" ><b>Date Planted</b><br/>'+plantdate+'</p>'+
                                '<p style="color:grey" ><b>Estimated Harvest Date</b><br/>'+harvestdate+'</p>'+
                                '<p style="color:grey" ><b>Date Posted</b><br/>'+postdate+'</p>'+
                                '<p style="color:grey" ><br><b>CONTACT INFO</b><br/></p>'+
                                '<p style="color:grey" >Email : '+email+'</p>'+
                                '<p style="color:grey" >Mobile :'+mobile+'</p>'+
                                '<button class="button button-samll button-balanced" ng-click="reserve()">Request Reservation</button>'
                                '</div>'+
                                '</div>'; 
                                var infowindow = new google.maps.InfoWindow({});
                                //$compile para ma gamit niya ang mgaangular directives bisag 
                                //template sya (html content sa info window nga gibuhat script)
                                var compiled = $compile(contentString)($scope);
                                $scope.$apply();
                                infowindow.setContent(compiled[0]);                   
                                infowindow.open(map,marker);

                                

                        });

                        
                    $scope.reserve=function(){
                      $state.go('reservationform', { 'cropname':cropname, 'buddyID': cropsellerid, 'cropID':cropid });
                    }

                  } 
                });     
           }  
     });


                                    
  }

$scope.remove=function(){
           for(var i=0; i<markers.length; i++){  
               markers[i].setMap(null);
           }
}

/* set ug boundiry para dli mu lapas ug lihok lihok ang user sa philippines ra nga map
var allowedBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(18.720503, 118.349477), 
     new google.maps.LatLng(6.061529, 128.225676)
);
var lastValidCenter = map.getCenter();

google.maps.event.addListener(map, 'center_changed', function() {
    if (allowedBounds.contains(map.getCenter())) {
        // still within valid bounds, so save the last valid position
        lastValidCenter = map.getCenter();
        return; 
    }

    // not valid anymore => return to last valid position
    map.panTo(lastValidCenter);
});

*/
})



//   <------------------------------Intro CONTROLLER ------------------------------->
apple.controller('introCtrl',function($scope,$state,$localStorage,$ionicHistory){
$ionicHistory.clearHistory();

if($localStorage.buddyid!=null){
  $state.go('home.menu');

}

})

//   <------------------------------CropRates CONTROLLER ------------------------------->


apple.controller('cropratesCtrl',function($scope,$state,$localStorage,$firebaseArray){

ratesRef=rootRef.child('CropRates');
$scope.croprates=$firebaseArray(ratesRef);

})

//   <------------------------------Admin CONTROLLER ------------------------------->

apple.controller('adminCtrl',function($scope,$state,$localStorage,$firebaseArray){
$scope.Signout=function(){
   firebase.auth().signOut().then(function(){
      delete $localStorage.buddyid;
      delete $localStorage.email;
      $state.go('intro');  
    } ,function(error) {
        alert('something went wrong');
      });
}


})

//   <------------------------------Menu CONTROLLER ------------------------------->


apple.controller('MenuCtrl',function($scope,$state,$localStorage,$firebaseArray,$ionicPopup){

var userRef=rootRef.child('Buddy').child($localStorage.buddyid);

$scope.verifyUser=function(){
 
    userRef.once('value',function(snap){
   console.log('atay' +snap.val().sellerStatus);
        if(snap.val().sellerStatus == "0"){

              // When button is clicked, the popup will be shown...
              $scope.showConfirm();
        }else{
            $state.go('myfarmcrop');
        }
     })
}


$scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
      title: 'Send Seller Request ?',
      template: 'You need to send a request first to sell?'
   });
   confirmPopup.then(function(res) {
      if(res) {
       console.log('shet');
      } else {
         
      }
     });
                
};




})


