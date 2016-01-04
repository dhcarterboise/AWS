// Velma 
var http       = require('http')
var https       = require('https')
var AlexaSkill = require('./AlexaSkill')

var APP_ID = "amzn1.echo-sdk-ams.app.f2fd86b9-98bb-438d-8105-fc57330461eb"; 
var API_ROOT = 'https://sapi.velma.com/';
//var API_ROOT = 'http://velma.build/api/';
var API_GETBUSINESSCOUNT_CALL = 'askforbusinessinfobyid/';

//https://sapi.velma.com/askforbusinessinfobyid/35

var Velma = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Velma.prototype = Object.create(AlexaSkill.prototype);
Velma.prototype.constructor = Velma;

Velma.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Velma onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // Put an initializing logic here
};

Velma.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
   
   console.log("Velma onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    
	var output = "Hi.  welcome to Velma, which business are you interested in?";

    var repromptText = "Dave, don't be shy , tell me the I D for the business.";
	
    response.ask(output, repromptText);
};

Velma.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Velma onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
 
    // Clean Up here
};


var getBusinessById = function (businessId) {

    console.log("velma_GetBusinessById " + businessId);
	var call = API_ROOT + API_GETBUSINESSCOUNT_CALL + businessId;
	console.log("velma_GetBusinessById " + call);
	return API_ROOT + API_GETBUSINESSCOUNT_CALL + businessId;

}

var getBusinessCountFromVelma = function (businessId, callback) {
	
	https.get(getBusinessById(businessId), function(res){

		console.log("velma getBusinessCountFromVelma");
		
		var body = '';

		res.on('data', function(data){
		
			console.log("velma_data");
			console.log(data);
		
			body += data;
		
		});

		res.on('end', function(){
			
			console.log("velma_end");
			console.log(body);
			
			var result = JSON.parse(body);
			callback(result);
    
		});

	}).on('error', function(e){
		
		console.log('Error: ' + e);
	});
	
}


var handleBusinessIDRequest = function(intent, session, response) {
	
	var businessId = intent.slots.business.value;
	//var text = "Your asking about the count for business " + businessId + "One Second Please";
	//response.tellWithCard(text, 'Business Count', text);
		
	getBusinessCountFromVelma(businessId, function (data) {
		
		console.log("velma_callBack");
			
		var accountText;
		if (data.accountsPurchased == 99999) 
			accountText = 'a Crap load of';
		else 
			accountsText = data.accountsPurchased;
			
		var cardText = 'Damn, that was a lot of leg work but I found you info on the business named. ' + data.name 
		+ '. . .,  ' + data.name + ' has ' + data.subscriberCount + ' subscribers' 
		+ '. . ., their phone number is ' + data.phoneNumber 
		+ '. . ., they have purchased ' + accountText + ' accounts'
		+ '. . ., but they are only using ' + data.accountsUsed + ' of them'
		+ '. . ., THANKS. And Have a Happy. New Year.';
		
		response.tellWithCard(cardText, 'Business Count', cardText);
	});
	
}

/* Velma Calls */

Velma.prototype.intentHandlers = {
    // register custom intent handlers
    "VelmaIntent": function (intent, session, response) {
		//var val = 35;
		//response.tellWithCard("Oh, I'm pretty good today, what about you! " + val, "Velma", "Velma!");
		handleBusinessIDRequest(intent, session, response);
		
    },
    
	"AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("What do you want Velma to do?", "What do you want Velma to do?");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Velma skill.
    var velma = new Velma();
    velma.execute(event, context);
};






























