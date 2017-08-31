'use strict';

var AlexaSkill = require('./AlexaSkill');

var APP_ID = 'amzn1.ask.skill.3b51f77a-7dec-41b7-9b07-e8c4a0333917';

var trackEvent = require('./search/track_event');

var yahooSearch = require('./search/yahoo_search');

var NineCats = function () {
    AlexaSkill.call(this, APP_ID);
};

NineCats.prototype = Object.create(AlexaSkill.prototype);

NineCats.prototype.constructor = NineCats;

NineCats.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechOutput = {
        speech: "Hello and welcome to 9 Cats. How can I be of assistance for you today?",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptText = "For instructions on what you can ask, please say help me.";

    response.ask(speechOutput, repromptText);
};

NineCats.prototype.intentHandlers = {

    "OneShotMetricIntent": function (intent, session, response) {
        var playerSlot = intent.slots.Player,
            metricSlot = intent.slots.Metric,
            seasonSlot = intent.slots.Season,
            playerName,
            metricName,
            seasonNumber;

        if (playerSlot && playerSlot.value){
            playerName = playerSlot.value.toLowerCase();
            if (playerName.slice(-2) === "\'s") {
                playerName = playerName.slice(0, -2);
                session.attributes.playerName = playerName;
            } else {
                session.attributes.playerName = playerName;
            }
        }

        if (metricSlot && metricSlot.value){
            metricName = metricSlot.value.toLowerCase();
            session.attributes.metricName = metricName;
        }
            
        if (seasonSlot && seasonSlot.value){
            seasonNumber = seasonSlot.value.toLowerCase();
            session.attributes.seasonNumber = seasonNumber;
        }

        console.log("oneShotPlayerIntent: " + playerName);
        console.log("oneShotMetricIntent: " + metricName);
        console.log("oneShotSeasonIntent: " + seasonNumber);

        var strLogData = ["oneShotPlayerIntent: " + playerName, "oneShotMetricIntent: " + metricName, "oneShotSeasonIntent: " + seasonNumber];

        trackEvent(
            'Intent',
            'OneShotMetricIntent',
            strLogData,
            '100',
            function(err) {
                if (err) {
                    console.log(err);
                }
            if (playerName === undefined) {
                handleMissingPlayerRequest(intent, session, response);
            } else if (metricName === undefined) {
                handleMissingMetricRequest(intent, session, response);
            } else if (seasonNumber === undefined) {
                handleMissingSeasonRequest(intent, session, response);
            } else {
                yahooSearch(intent, session, response);
            }
        });
    },

    "MissingSlotIntent": function (intent, session, response) {
        var playerSlot = intent.slots.Player,
            metricSlot = intent.slots.Metric,
            seasonSlot = intent.slots.Season,
            playerName,
            metricName,
            seasonNumber;

        if (playerSlot && playerSlot.value) {
            playerName = playerSlot.value.toLowerCase();
            if (playerName.slice(-2) === "\'s") {
                playerName = playerName.slice(0, -2);
                session.attributes.playerName = playerName;
            } else {
                session.attributes.playerName = playerName;
            }
        }

        if (metricSlot && metricSlot.value) {
            metricName = metricSlot.value.toLowerCase();
            session.attributes.metricName = metricName;
        }

        if (seasonSlot && seasonSlot.value) {
            seasonNumber = seasonSlot.value.toLowerCase();
            session.attributes.seasonNumber = seasonNumber;
        } 

        console.log("missingPlayerIntent: " + playerName);
        console.log("missingMetricIntent: " + metricName);
        console.log("missingSeasonIntent: " + seasonNumber);

        var strLogData = ["missingPlayerIntent: " + playerName, "missingMetricIntent: " + metricName, "missingSeasonIntent: " + seasonNumber];

        playerName = session.attributes.playerName,
        metricName = session.attributes.metricName,
        seasonNumber = session.attributes.seasonNumber,

        trackEvent(
            'Intent',
            'MissingSlotIntent',
            strLogData,
            '100',
            function(err) {
                if (err) {
                    console.log(err);
                }
            if (playerName === undefined) {
                handleMissingPlayerRequest(intent, session, response);
            } else if (metricName === undefined) {
                handleMissingMetricRequest(intent, session, response);
            } else if (seasonNumber === undefined) {
                handleMissingSeasonRequest(intent, session, response);
            } else {
                yahooSearch(intent, session, response);
            }
        });
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        trackEvent(
            'Intent',
            'AMAZON.HelpIntent',
            'NA',
            '100',
            function(err) {
                if (err) {
                    console.log(err);
                }
            var speechText = "<speak>Please provide the name of a current player who has played at least one season in the NBA, a valid metric correlating to that player's position, and a valid year pertaining to the NBA season ranging from two thousand and one through two thousand and sixteen. <break time=\"0.618s\"/> Now, what can I help you with today?</speak>"
            var repromptText = "<speak>You can say things like <break time=\"0.618s\"/> How many 3 pointers made did Stephen Curry have in two thousand and fifteen? <break time=\"0.618s\"/> Now, how can I help you?</speak>";
            var speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            };
            var repromptOutput = {
                speech: repromptText,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.ask(speechOutput, repromptOutput);
        });
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        trackEvent(
            'Intent',
            'AMAZON.CancelIntent',
            'NA',
            '100',
            function(err) {
                if (err) {
                    console.log(err);
                }
            var speechOutput = "Thank you for using 9 Cats. Go Lakers!";
            response.tell(speechOutput);
        });
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        trackEvent(
            'Intent',
            'AMAZON.StopIntent',
            'NA',
            '100',
            function(err) {
                if (err) {
                    console.log(err);
                }
            var speechOutput = "Thank you for using 9 Cats. Go Lakers!";
            response.tell(speechOutput);
        });
    }
};

function handleMissingPlayerRequest(intent, session, response) {
    var speechOutput = "Please provide the name of a current player who has played at least one game in the NBA.",
        repromptText = "You can say something like, Kevin Durant";
    response.ask(speechOutput, repromptText);
}

function handleMissingMetricRequest(intent, session, response) {
    var player;
    var playerName = session.attributes.playerName;
    if (playerName.slice(-2) === "\'s") {
        player = playerName;
    } else {
        player = playerName.concat("\'s");
    }

    var speechOutput = "Please provide a valid metric which correlates to " + player + " position.",
        repromptText = "You can say something like, field goal percentage";
    response.ask(speechOutput, repromptText);
}

function handleMissingSeasonRequest(intent, session, response) {
    var player;
    var playerName = session.attributes.playerName;
    if (playerName.slice(-2) === "\'s") {
        player = playerName.slice(0, -2);
    } else {
        player = playerName;
    }

    var speechOutput = "Please provide the year of an NBA season, ranging from two thousand and one through two thousand and sixteen, in which " + player + " has played at least one game.",
        repromptText = "You can say something like, two thousand and sixteen.";
    response.ask(speechOutput, repromptText);
}

exports.handler = function (event, context) {
    var skill = new NineCats();
    skill.execute(event, context);
};