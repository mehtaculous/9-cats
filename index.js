'use strict';

var AlexaSkill = require('./AlexaSkill');

var API = require('./api_keys');

var Keys = require('./data_keys');

var APP_ID = 'amzn1.ask.skill.08c20189-e802-4a87-b1bb-97d5b9cc5490';

var YahooFantasy = require('yahoo-fantasy');

var yf = new YahooFantasy(
    API.consumer_key,
    API.consumer_secret
);

var express = require('express');

var request = require('request');

var app = express();

var GA_TRACKING_ID = 'UA-81123913-2';

function trackEvent(category, action, label, value, callbback) {
    var data = {
        v: '1',
        tid: GA_TRACKING_ID,
        cid: '555',
        t: 'event',
        ec: category,
        ea: action,
        el: label,
        ev: value,
    };

    request.post(
        'http://www.google-analytics.com/collect', {
            form: data
        },
        function(err, response) {
            if (err) { return callbback(err); }
            if (response.statusCode !== 200) {
                return callbback(new Error('Tracking failed'));
            }
        callbback();
        }
    );
}

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

        var game_id = JSON.stringify(Keys[seasonNumber]),
            player_id = JSON.stringify(Keys[playerName]),
            metric_id = JSON.stringify(Keys[metricName]),
            metric_value,
            games_played,
            minutes_played,
            field_goal_attempts,
            field_goals_made,
            field_goal_percentage,
            free_throw_attempts,
            free_throws_made,
            free_throw_percentage,
            three_point_attempts,
            three_pointers_made,
            three_point_percentage,
            points,
            offensive_rebounds,
            defensive_rebounds,
            total_rebounds,
            assists,
            steals,
            blocks,
            turnovers,
            personal_fouls,
            minutes_per_game,
            field_goal_attempts_per_game,
            field_goals_made_per_game,
            free_throw_attempts_per_game,
            free_throws_made_per_game,
            three_point_attempts_per_game,
            three_pointers_made_per_game,
            points_per_game,
            offensive_rebounds_per_game,
            defensive_rebounds_per_game,
            total_rebounds_per_game,
            assists_per_game,
            steals_per_game,
            blocks_per_game,
            turnovers_per_game,
            fouls_per_game;
            
        var player_key = game_id + '.p.' + player_id;

        yf.player.stats(
            player_key,
            function cb(err, data) {
                if (err) {
                    console.log(err);
                    getMetricRequest(intent, session, response);
                } else {
                    console.log("Calling player season stats...");
                    for (var key in data["stats"]["stats"]) {
                        if (data["stats"]["stats"][key]["stat_id"] === metric_id) {
                            metric_value = data["stats"]["stats"][key]["value"];
                            if (metricName === "field goal percentage" || metricName === "free throw percentage" || metricName === "3 point percentage") {
                                metric_value = (metric_value * 100).toFixed(1);
                                console.log("Metric Value TEST: " + metric_value);
                            }
                        }
                    }

                    games_played = parseFloat(data["stats"]["stats"]["0"]["value"]);
                    minutes_played = parseFloat(data["stats"]["stats"]["2"]["value"]);
                    field_goal_attempts = parseFloat(data["stats"]["stats"]["3"]["value"]);
                    field_goals_made = parseFloat(data["stats"]["stats"]["4"]["value"]);
                    field_goal_percentage = parseFloat(data["stats"]["stats"]["5"]["value"]) * 100;
                    free_throw_attempts = parseFloat(data["stats"]["stats"]["6"]["value"]);
                    free_throws_made = parseFloat(data["stats"]["stats"]["7"]["value"]);
                    free_throw_percentage = parseFloat(data["stats"]["stats"]["8"]["value"]) * 100;
                    three_point_attempts = parseFloat(data["stats"]["stats"]["9"]["value"]);
                    three_pointers_made = parseFloat(data["stats"]["stats"]["10"]["value"]);
                    three_point_percentage = parseFloat(data["stats"]["stats"]["11"]["value"]) * 100;
                    points = parseFloat(data["stats"]["stats"]["12"]["value"]);
                    offensive_rebounds = parseFloat(data["stats"]["stats"]["13"]["value"]);
                    defensive_rebounds = parseFloat(data["stats"]["stats"]["14"]["value"]);
                    total_rebounds = parseFloat(data["stats"]["stats"]["15"]["value"]);
                    assists = parseFloat(data["stats"]["stats"]["16"]["value"]);
                    steals = parseFloat(data["stats"]["stats"]["17"]["value"]);
                    blocks = parseFloat(data["stats"]["stats"]["18"]["value"]);
                    turnovers = parseFloat(data["stats"]["stats"]["19"]["value"]);
                    personal_fouls = parseFloat(data["stats"]["stats"]["21"]["value"]);
                    
                    console.log("Games Played: " + games_played);
                    console.log("Minutes Played: " + minutes_played);
                    console.log("Field Goal Attempts: " + field_goal_attempts);
                    console.log("Field Goals Made: " + field_goals_made);
                    console.log("Field Goal Percentage: " + field_goal_percentage);
                    console.log("Free Throw Attempts: " + free_throw_attempts);
                    console.log("Free Throws Made: " + free_throws_made);
                    console.log("Free Throw Percentage: " + free_throw_percentage);
                    console.log("Three Point Attempts: " + three_point_attempts);
                    console.log("Three Pointers Made: " + three_pointers_made);
                    console.log("Three Point Percentage: " + three_point_percentage);
                    console.log("Points: " + points);
                    console.log("Offensive Rebounds: " + offensive_rebounds);
                    console.log("Defensive Rebounds: " + defensive_rebounds);
                    console.log("Total Rebounds: " + total_rebounds);
                    console.log("Assists: " + assists);
                    console.log("Steals: " + steals);
                    console.log("Blocks: " + blocks);
                    console.log("Turnovers: " + turnovers);
                    console.log("Personal Fouls: " + personal_fouls);

                    minutes_per_game = (minutes_played / games_played).toFixed(1);
                    field_goal_attempts_per_game = (field_goal_attempts / games_played).toFixed(1);
                    field_goals_made_per_game = (field_goals_made / games_played).toFixed(1);
                    free_throw_attempts_per_game = (free_throw_attempts / games_played).toFixed(1);
                    free_throws_made_per_game = (free_throws_made / games_played).toFixed(1);
                    three_point_attempts_per_game = (three_point_attempts / games_played).toFixed(1);
                    three_pointers_made_per_game = (three_pointers_made / games_played).toFixed(1);
                    points_per_game = (points / games_played).toFixed(1);
                    offensive_rebounds_per_game = (offensive_rebounds / games_played).toFixed(1);
                    defensive_rebounds_per_game = (defensive_rebounds / games_played).toFixed(1);
                    total_rebounds_per_game = (total_rebounds / games_played).toFixed(1);
                    assists_per_game = (assists / games_played).toFixed(1);
                    steals_per_game = (steals / games_played).toFixed(1);
                    blocks_per_game = (blocks / games_played).toFixed(1);
                    turnovers_per_game = (turnovers / games_played).toFixed(1);
                    fouls_per_game = (personal_fouls / games_played).toFixed(1);
                    
                    console.log("Minutes Per Game: " + minutes_per_game);
                    console.log("Field Goal Attempts Per Game: " + field_goal_attempts_per_game);
                    console.log("Field Goals Made Per Game: " + field_goals_made_per_game);
                    console.log("Free Throw Attempts Per Game: " + free_throw_attempts_per_game);
                    console.log("Free Throws Made Per Game: " + free_throws_made_per_game);
                    console.log("Three Point Attempts Per Game: " + three_point_attempts_per_game);
                    console.log("Three Pointers Made Per Game: " + three_pointers_made_per_game);
                    console.log("Points Per Game: " + points_per_game);
                    console.log("Offensive Rebounds Per Game: " + offensive_rebounds_per_game);
                    console.log("Defensive Rebounds Per Game: " + defensive_rebounds_per_game);
                    console.log("Total Rebounds Per Game: " + total_rebounds_per_game);
                    console.log("Assists Per Game: " + assists_per_game);
                    console.log("Steals Per Game: " + steals_per_game);
                    console.log("Blocks Per Game: " + blocks_per_game);
                    console.log("Turnovers Per Game: " + turnovers_per_game);
                    console.log("Fouls Per Game: " + fouls_per_game);

                    if (metricName === "minutes per game") {
                        metric_value = minutes_per_game;
                    } else if (metricName === "field goal attempts per game") {
                        metric_value = field_goal_attempts_per_game;
                    } else if (metricName === "field goals made per game") {
                        metric_value = field_goals_made_per_game;
                    } else if (metricName === "free throw attempts per game") {
                        metric_value = ppr_points_per_game;
                    } else if (metricName === "free throws made per game") {
                        metric_value = free_throws_made_per_game;
                    } else if (metricName === "3 point attempts per game") {
                        metric_value = three_point_attempts_per_game;
                    } else if (metricName === "3 pointers made per game") {
                        metric_value = three_pointers_made_per_game;
                    } else if (metricName === "points per game") {
                        metric_value = points_per_game;
                    } else if (metricName === "offensive rebounds per game") {
                        metric_value = offensive_rebounds_per_game;
                    } else if (metricName === "defensive rebounds per game") {
                        metric_value = defensive_rebounds_per_game;
                    } else if (metricName === "total rebounds per game") {
                        metric_value = total_rebounds_per_game;
                    } else if (metricName === "assists per game") {
                        metric_value = assists_per_game;
                    } else if (metricName === "steals per game") {
                        metric_value = steals_per_game;
                    } else if (metricName === "blocks per game") {
                        metric_value = blocks_per_game;
                    } else if (metricName === "turnovers per game") {
                        metric_value = turnovers_per_game;
                    } else if (metricName === "fouls per game") {
                        metric_value = fouls_per_game;
                    }

                    if (metric_value === "0.0") {
                        metric_value = "0";
                    } else if (metric_value === "NaN") {
                        metric_value = "0";
                    }

                    session.attributes.games_played = games_played;
                    session.attributes.metric_value = metric_value;
                    console.log("Player Key: " + player_key);
                    console.log("Metric Value: " + metric_value);
                    console.log("Finished calling player season stats");

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
                            getMetricRequest(intent, session, response);
                        }
                    });
                }
            }
        );
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
            'na',
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
            'na',
            '100',
            function(err) {
                if (err) {
                    console.log(err);
                }
            var speechOutput = "Thank you for using 9 Cats. Goodbye";
            response.tell(speechOutput);
        });
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        trackEvent(
            'Intent',
            'AMAZON.StopIntent',
            'na',
            '100',
            function(err) {
                if (err) {
                    console.log(err);
                }
            var speechOutput = "Thank you for using 9 Cats. Goodbye";
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
        repromptText = "You can say something like, two thousand and fourteen.";
    response.ask(speechOutput, repromptText);
}

function getMetricRequest(intent, session, response) {

    var player = session.attributes.playerName,
        metric = session.attributes.metricName,
        season = session.attributes.seasonNumber,
        games_played = session.attributes.games_played,
        metric_value = session.attributes.metric_value,
        speechOutput,
        cardTitle,
        cardContent;

    console.log("getPlayerRequest: " + player);
    console.log("getMetricRequest: " + metric);
    console.log("getSeasonRequest: " + season);
    console.log("getGamesPlayedRequest: " + games_played);
    console.log("getMetricValueRequest: " + metric_value);

    if (metric === "games played" && metric_value) {
        console.log("During the " + season + " season, " + player + " played " + games_played + " games.");
        speechOutput = {
            speech: "During the " + season + " season, " + player + " played " + games_played + " games.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = metric + " for " + player + " during the " + season + " season";
        cardContent = metric_value + " " + metric;
        response.tellWithCard(speechOutput, cardTitle, cardContent);

    } else if ((metric === "field goal percentage" || metric === "free throw percentage" || metric === "3 point percentage") && metric_value) {
        console.log("During the " + season + " season, " + player + " had a " + metric + " of " + metric_value + "%");
        speechOutput = {
            speech: "During the " + season + " season, " + player + " had a " + metric + " of " + metric_value + "%",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = metric + " for " + player + " during the " + season + " season";
        cardContent = metric_value + "% " + metric;
        response.tellWithCard(speechOutput, cardTitle, cardContent);

    } else if (Keys[player] && Keys[season] && Keys[metric] && metric_value) {
        console.log("During the " + season + " season, " + player + " had " + metric_value + " " + metric);
        speechOutput = {
            speech: "During the " + season + " season, " + player + " had " + metric_value + " " + metric,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = metric + " for " + player + " during the " + season + " season";
        cardContent = metric_value + " " + metric;
        response.tellWithCard(speechOutput, cardTitle, cardContent);

    } else if (Keys[player] && Keys[season] && Keys[metric]) {
        console.log("I'm sorry, but " + player + " did not play in a single game during the " + season + " season.");
        speechOutput = {
            speech: "I'm sorry, but " + player + " did not play in a single game during the " + season + " season.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardContent = player + " did not play in a single game during the " + season + " season";
        response.tellWithCard(speechOutput, cardContent);   

    } else {
        console.log("I'm sorry, but the information you have provided is invalid.");
        speechOutput = {
            speech: "I'm sorry, but the information you have provided is invalid. Please check the Voice Feedback to make sure I heard you correctly.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = "please check the voice feedback to see what alexa heard";
        cardContent = "the information you have provided is invalid";
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    }
}

function yahooSearch(intent, session, response) {
    var playerName = session.attributes.playerName,
        metricName = session.attributes.metricName,
        seasonNumber = session.attributes.seasonNumber;

    var game_id = JSON.stringify(Keys[seasonNumber]),
        player_id = JSON.stringify(Keys[playerName]),
        metric_id = JSON.stringify(Keys[metricName]),
        metric_value,
        games_played,
        minutes_played,
        field_goal_attempts,
        field_goals_made,
        field_goal_percentage,
        free_throw_attempts,
        free_throws_made,
        free_throw_percentage,
        three_point_attempts,
        three_pointers_made,
        three_point_percentage,
        points,
        offensive_rebounds,
        defensive_rebounds,
        total_rebounds,
        assists,
        steals,
        blocks,
        turnovers,
        personal_fouls,
        minutes_played,
        field_goal_attempts_per_game,
        field_goals_made_per_game,
        free_throw_attempts_per_game,
        free_throws_made_per_game,
        three_point_attempts_per_game,
        three_pointers_made_per_game,
        points_per_game,
        offensive_rebounds_per_game,
        defensive_rebounds_per_game,
        total_rebounds_per_game,
        assists_per_game,
        steals_per_game,
        blocks_per_game,
        turnovers_per_game,
        fouls_per_game;

    var player_key = game_id + '.p.' + player_id;

    yf.player.stats(
        player_key,
        function cb(err, data) {
            if (err) {
                console.log(err);
                getMetricRequest(intent, session, response);
            } else {
                console.log("Calling player season stats...");
                for (var key in data["stats"]["stats"]) {
                    if (data["stats"]["stats"][key]["stat_id"] === metric_id) {
                        metric_value = data["stats"]["stats"][key]["value"];
                    }
                }

                games_played = parseFloat(data["stats"]["stats"]["0"]["value"]);
                minutes_played = parseFloat(data["stats"]["stats"]["2"]["value"]);
                field_goal_attempts = parseFloat(data["stats"]["stats"]["3"]["value"]);
                field_goals_made = parseFloat(data["stats"]["stats"]["4"]["value"]);
                field_goal_percentage = parseFloat(data["stats"]["stats"]["5"]["value"]) * 100;
                free_throw_attempts = parseFloat(data["stats"]["stats"]["6"]["value"]);
                free_throws_made = parseFloat(data["stats"]["stats"]["7"]["value"]);
                free_throw_percentage = parseFloat(data["stats"]["stats"]["8"]["value"]) * 100;
                three_point_attempts = parseFloat(data["stats"]["stats"]["9"]["value"]);
                three_pointers_made = parseFloat(data["stats"]["stats"]["10"]["value"]);
                three_point_percentage = parseFloat(data["stats"]["stats"]["11"]["value"]) * 100;
                points = parseFloat(data["stats"]["stats"]["12"]["value"]);
                offensive_rebounds = parseFloat(data["stats"]["stats"]["13"]["value"]);
                defensive_rebounds = parseFloat(data["stats"]["stats"]["14"]["value"]);
                total_rebounds = parseFloat(data["stats"]["stats"]["15"]["value"]);
                assists = parseFloat(data["stats"]["stats"]["16"]["value"]);
                steals = parseFloat(data["stats"]["stats"]["17"]["value"]);
                blocks = parseFloat(data["stats"]["stats"]["18"]["value"]);
                turnovers = parseFloat(data["stats"]["stats"]["19"]["value"]);
                personal_fouls = parseFloat(data["stats"]["stats"]["21"]["value"]);
                
                console.log("Games Played: " + games_played);
                console.log("Minutes Played: " + minutes_played);
                console.log("Field Goal Attempts: " + field_goal_attempts);
                console.log("Field Goals Made: " + field_goals_made);
                console.log("Field Goal Percentage: " + field_goal_percentage);
                console.log("Free Throw Attempts: " + free_throw_attempts);
                console.log("Free Throws Made: " + free_throws_made);
                console.log("Free Throw Percentage: " + free_throw_percentage);
                console.log("Three Point Attempts: " + three_point_attempts);
                console.log("Three Pointers Made: " + three_pointers_made);
                console.log("Three Point Percentage: " + three_point_percentage);
                console.log("Points: " + points);
                console.log("Offensive Rebounds: " + offensive_rebounds);
                console.log("Defensive Rebounds: " + defensive_rebounds);
                console.log("Total Rebounds: " + total_rebounds);
                console.log("Assists: " + assists);
                console.log("Steals: " + steals);
                console.log("Blocks: " + blocks);
                console.log("Turnovers: " + turnovers);
                console.log("Personal Fouls: " + personal_fouls);

                minutes_per_game = (minutes_played / games_played).toFixed(1);
                field_goal_attempts_per_game = (field_goal_attempts / games_played).toFixed(1);
                field_goals_made_per_game = (field_goals_made / games_played).toFixed(1);
                free_throw_attempts_per_game = (free_throw_attempts / games_played).toFixed(1);
                free_throws_made_per_game = (free_throws_made / games_played).toFixed(1);
                three_point_attempts_per_game = (three_point_attempts / games_played).toFixed(1);
                three_pointers_made_per_game = (three_pointers_made / games_played).toFixed(1);
                points_per_game = (points / games_played).toFixed(1);
                offensive_rebounds_per_game = (offensive_rebounds / games_played).toFixed(1);
                defensive_rebounds_per_game = (defensive_rebounds / games_played).toFixed(1);
                total_rebounds_per_game = (total_rebounds / games_played).toFixed(1);
                assists_per_game = (assists / games_played).toFixed(1);
                steals_per_game = (steals / games_played).toFixed(1);
                blocks_per_game = (blocks / games_played).toFixed(1);
                turnovers_per_game = (turnovers / games_played).toFixed(1);
                fouls_per_game = (personal_fouls / games_played).toFixed(1);
                
                console.log("Minutes Per Game: " + minutes_per_game);
                console.log("Field Goal Attempts Per Game: " + field_goal_attempts_per_game);
                console.log("Field Goals Made Per Game: " + field_goals_made_per_game);
                console.log("Free Throw Attempts Per Game: " + free_throw_attempts_per_game);
                console.log("Free Throws Made Per Game: " + free_throws_made_per_game);
                console.log("Three Point Attempts Per Game: " + three_point_attempts_per_game);
                console.log("Three Pointers Made Per Game: " + three_pointers_made_per_game);
                console.log("Points Per Game: " + points_per_game);
                console.log("Offensive Rebounds Per Game: " + offensive_rebounds_per_game);
                console.log("Defensive Rebounds Per Game: " + defensive_rebounds_per_game);
                console.log("Total Rebounds Per Game: " + total_rebounds_per_game);
                console.log("Assists Per Game: " + assists_per_game);
                console.log("Steals Per Game: " + steals_per_game);
                console.log("Blocks Per Game: " + blocks_per_game);
                console.log("Turnovers Per Game: " + turnovers_per_game);
                console.log("Fouls Per Game: " + fouls_per_game);

                if (metricName === "minutes per game") {
                    metric_value = minutes_per_game;
                } else if (metricName === "field goal attempts per game") {
                    metric_value = field_goal_attempts_per_game;
                } else if (metricName === "field goals made per game") {
                    metric_value = field_goals_made_per_game;
                } else if (metricName === "free throw attempts per game") {
                    metric_value = ppr_points_per_game;
                } else if (metricName === "free throws made per game") {
                    metric_value = free_throws_made_per_game;
                } else if (metricName === "three point attempts per game") {
                    metric_value = three_point_attempts_per_game;
                } else if (metricName === "three pointers made per game") {
                    metric_value = three_pointers_made_per_game;
                } else if (metricName === "points per game") {
                    metric_value = points_per_game;
                } else if (metricName === "offensive rebounds per game") {
                    metric_value = offensive_rebounds_per_game;
                } else if (metricName === "defensive rebounds per game") {
                    metric_value = defensive_rebounds_per_game;
                } else if (metricName === "total rebounds per game") {
                    metric_value = total_rebounds_per_game;
                } else if (metricName === "assists per game") {
                    metric_value = assists_per_game;
                } else if (metricName === "steals per game") {
                    metric_value = steals_per_game;
                } else if (metricName === "blocks per game") {
                    metric_value = blocks_per_game;
                } else if (metricName === "turnovers per game") {
                    metric_value = turnovers_per_game;
                } else if (metricName === "fouls per game") {
                    metric_value = fouls_per_game;
                }

                if (metric_value === "0.0") {
                    metric_value = "0";
                } else if (metric_value === "NaN") {
                    metric_value = "0";
                }

                session.attributes.games_played = games_played;
                session.attributes.metric_value = metric_value;
                console.log("Player Key: " + player_key);
                console.log("Metric Value: " + metric_value);
                console.log("Finished calling player season stats");

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
                        getMetricRequest(intent, session, response);
                    }
                });
            }
        }
    );
}

exports.handler = function (event, context) {
    var skill = new NineCats();
    skill.execute(event, context);
};