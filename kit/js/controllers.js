/* App Controllers */


// Create a Global var to keep track of the player session
window.USER = {
 "isLogged": false
}


// Start number of actions when the page is loaded
function LoadPageCtrl($resource) {
  // Mapping the Global var to the current controller var
  // Note: Object copping in JavaScript is made by reference
  this.USER = window.USER;
  
  // Send a request back to the server which page was loaded and when
  LogAccessCtrl($resource);
  
  // Preload some basic images
  MM_preloadImages('_images/landingPages/landingPageButtons/singpathLogo_on.png','_images/landingPages/landingPageButtons/signUp_on.png','_images/landingPages/landingPageButtons/houseProfile_on.png','_images/landingPages/landingPageButtons/shoppingTrolley_on.png','_images/landingPages/landingPageButtons/gr8ph1csLogo_on.png','_images/landingPages/landingPageButtons/signIn_on.png');
}

LoadPageCtrl.$inject = ['$resource'];


// Send a request back to the server which page was loaded and when
function LogAccessCtrl($resource) {
  logAccess = $resource('../jsonapi/log_access').get(function() {
    logAccess.page = getHref();
    logAccess.date = new Date().getTime();
    
    // Saving will be available once we create the back-end server to response the POST requests
    // logAccess.$save();
  });
}


// Preload images
// TODO: To be updated
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}


function UserLoginMenuCtrl($resource, $window) {
  self = this;
  this.player = $resource('../jsonapi/player').get(function() {
    // Setting the Global var
    window.USER.isLogged = getUserLoggedInStatus(self.player);
    
    // Secure a maximum nickname chars so the string won't over flow outside the box
    self.player.nickname = clampString(self.player.nickname, 35);
  });
}

UserLoginMenuCtrl.$inject = ['$resource', '$window'];


function IndexCtrl($resource) {
  statsModel = $resource('../jsonapi/statistics');
  this.stats = statsModel.get();
  
  currentPlayersModel = $resource('../jsonapi/current_players');
  this.current_players = currentPlayersModel.query();
}

IndexCtrl.$inject = ['$resource'];


function FooterLogosCtrl($resource) {
  this.baseSrcBegin = "_images/landingPages/indexPage/logos/";
  this.baseSrcEnd   = "Logo.png";
  this.footerLogos  = $resource('../jsonapi/footerLogos').query();
}

FooterLogosCtrl.$inject = ['$resource'];


function RankingCtrl($resource) {
  countryModel = $resource("../jsonapi/country_ranking");
  this.country_ranking = countryModel.get();
}

RankingCtrl.$inject = ["$resource"];


function ContributorCtrl($resource) {
  // Getting all contributors from the jsonapi
  this.contributors = $resource('../jsonapi/contributors').query();
  
  // Cache the base sorce path so we could keep the database thin
  this.baseSrc = '../kit/_images/landingPages/contributionPage/profiles/';
};
ContributorCtrl.$inject = ['$resource'];


function StaffCtrl($resource) {
  // Getting all contributors from the jsonapi
  this.staff = $resource('../jsonapi/staff').query();
  
  // Cache the base sorce path so we could keep the database thin
  this.baseSrc = '../kit/_images/landingPages/contributionPage/profiles/';
};
StaffCtrl.$inject = ['$resource'];


function YourLevelBadgesCtrl($resource) {	
    yourLevelBadgesModel = $resource("../jsonapi/all_badges");
    this.badges = yourLevelBadgesModel.get();
    this.doFilter = function(elem) {
    	elem.imageURL = elem.imageURL.replace(/^\/static/, "../static");
        if (elem.imageURL && !elem.awarded) {
        	elem.imageURL = elem.imageURL.replace('_on', '_off');
        }
    	var eval_class = (elem.class.indexOf('CountryBadge')<0 && elem.class.indexOf('Level_Badge')<0);
        return (eval_class);
    }
    
    this.clickEvent = function(elem,badge){
    	window.alert("elem:"+elem.src);
    }
    
    this.returnClass = function(elem){
    	var url = elem.imageURL.replace(/^\/static/, "../static");
        var clazz = 'earnedBadge';
        if (url && !elem.awarded) {
            clazz = 'notEarnedBadge';
        }
        return clazz;

    }
 }

YourLevelBadgesCtrl.$inject = ["$resource"];

function CountryLevelBadgesCtrl($resource) {	
    countryLevelBadgesModel = $resource("../jsonapi/all_badges");
    this.badges = countryLevelBadgesModel.get();
    this.doFilter = function(elem) { 
    	elem.imageURL = elem.imageURL.replace(/^\/static/, "../static");
        if (elem.imageURL && !elem.awarded) {
        	elem.imageURL = elem.imageURL.replace('_on', '_off');
        }
        var eval_class = elem.class.indexOf('CountryBadge')>0
        return eval_class ;
    }
    this.clickEvent = function(elem,badge){
    	window.alert("elem:"+elem.src);
    }
    this.returnClass = function(elem){
    	var url = elem.imageURL.replace(/^\/static/, "../static");;
        var clazz = 'earnedBadge';
        if (url && !elem.awarded) {
            clazz = 'notEarnedBadge';
        }
        return clazz;

    }
 }

CountryLevelBadgesCtrl.$inject = ["$resource"];

function YourBadgesBoxTop($resource) {	
	yourBadgesBoxTop = $resource("../jsonapi/all_badges");
    this.badges = yourBadgesBoxTop.get();
    this.badges_elements = [];
    this.prevBadge = undefined;
    
    this.clickEvent = function(elem,badge){
    	window.alert("elem:"+elem.src);
    }
    
    this.doFilter = function(elem) {
    	elem.imageURL = elem.imageURL.replace(/^\/static/, "../static");;
        if (elem.imageURL && !elem.awarded) {
        	elem.imageURL = elem.imageURL.replace('_on', '_off');
        }
        this.badges_elements.push(elem);
        var eval_class = elem.class.indexOf('Level_Badge')>0;
        return eval_class;
    }
    this.returnStyle = function(elem){
    	var index = this.badges_elements.indexOf(elem);
    	var prevBadge = undefined;
    	if (index>0) {
    		prevBadge =  this.badges_elements[index-1];
    		
    	}else{
    		window.alert(elem.description);
    	}
    	if (prevBadge && prevBadge.path_id != elem.path_id){
    		
    		return '{display:block;clear:both;}';
    	}
    	return '';
    }
    this.returnClass = function(elem){
    	var url = elem.imageURL.replace(/^\/static/, "../static");;
        var clazz = 'earnedBadge';
        if (url && !elem.awarded) {
            clazz = 'notEarnedBadge';
        }
        
        
        return clazz;
    }
 }

YourBadgesBoxTop.$inject = ["$resource"];


function CountriesCtrl($resource) {	
    allCountriesModel = $resource("../jsonapi/all_countries");
    this.allCountries = allCountriesModel.get();
}

CountriesCtrl.$inject = ["$resource"];

function HeadMenuOptionsCtrl($resource, $location) {
  // Taking all menu options
  this.options = $resource('../jsonapi/headMenuOptions').query(function(options) {
    // Setting the selected menu option as 'menuSelected' regarding the page href
    href = getHref();
    for(i in options) {
      option = options[i];
      if(option.href == href) {
        option.class = 'menuSelected';
        break;
      }
    }
  });
}

HeadMenuOptionsCtrl.$inject = ['$resource', '$location'];


function FooterMenuOptionsCtrl($resource) {
  // Taking all footer menu options
  this.options = $resource('../jsonapi/footerMenuOptions').query();
}

FooterMenuOptionsCtrl.$inject = ['$resource'];


function GoogleAnalyticsCtrl() {
  // Location Google Analytics JS file
  this.gaJsSrc = getFirstURLChars() + 'google-analytics.com/ga.js';
}


function JanrainCtrl() {
  // Location Janrain JS file
  this.rpxJsSrc = getFirstURLChars() + 'rpxnow.com/js/lib/rpx.js';
}


function CopyrightCtrl() {
  // Setting the Copyright year
  this.year = new Date().getFullYear();
}


// Controller for the home.html
// TODO: To be updated
function HomeController($resource, $route, $xhr){
  this.$xhr = $xhr;
  this.player = undefined;
  this.Jsonapi = $resource('../jsonapi/:id', {id: '@id'});
  this.loadPlayer();
  
  HomeController.prototype = {
    loadPlayer: function() {
      this.player = this.Jsonapi.get({id: 'player_test'}, function(p){
        console.log(p)
      });
    }
  }
}
HomeController.$inject = ['$resource', '$route', '$xhr'];
