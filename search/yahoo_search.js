'use strict';

var API = require('../api_keys');

var YahooFantasy = require('yahoo-fantasy');

var yf = new YahooFantasy(
    API.consumer_key,
    API.consumer_secret
);

var Keys = require('../data_keys');

var trackEvent = require('./track_event');

var getMetricRequest = require('./get_metric');

module.exports = function yahooSearch(intent, session, response) {
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
                for (var key in data["stats"]["stats"]) {
                    if (data["stats"]["stats"][key]["stat_id"] === metric_id) {
                        metric_value = data["stats"]["stats"][key]["value"];
                    }
                }

                games_played = parseFloat(data["stats"]["stats"]["0"]["value"]);
                minutes_played = parseFloat(data["stats"]["stats"]["2"]["value"]);
                field_goal_attempts = parseFloat(data["stats"]["stats"]["3"]["value"]);
                field_goals_made = parseFloat(data["stats"]["stats"]["4"]["value"]);
                field_goal_percentage = (parseFloat(data["stats"]["stats"]["5"]["value"]) * 100).toFixed(1);
                free_throw_attempts = parseFloat(data["stats"]["stats"]["6"]["value"]);
                free_throws_made = parseFloat(data["stats"]["stats"]["7"]["value"]);
                free_throw_percentage = (parseFloat(data["stats"]["stats"]["8"]["value"]) * 100).toFixed(1);
                three_point_attempts = parseFloat(data["stats"]["stats"]["9"]["value"]);
                three_pointers_made = parseFloat(data["stats"]["stats"]["10"]["value"]);
                three_point_percentage = (parseFloat(data["stats"]["stats"]["11"]["value"]) * 100).toFixed(1);
                points = parseFloat(data["stats"]["stats"]["12"]["value"]);
                offensive_rebounds = parseFloat(data["stats"]["stats"]["13"]["value"]);
                defensive_rebounds = parseFloat(data["stats"]["stats"]["14"]["value"]);
                total_rebounds = parseFloat(data["stats"]["stats"]["15"]["value"]);
                assists = parseFloat(data["stats"]["stats"]["16"]["value"]);
                steals = parseFloat(data["stats"]["stats"]["17"]["value"]);
                blocks = parseFloat(data["stats"]["stats"]["18"]["value"]);
                turnovers = parseFloat(data["stats"]["stats"]["19"]["value"]);
                personal_fouls = parseFloat(data["stats"]["stats"]["21"]["value"]);

                console.log("Yahoo Search...");
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
                } else if (metricName === "field goal percentage") {
                    metric_value = field_goal_percentage;
                } else if (metricName === "field goal attempts per game") {
                    metric_value = field_goal_attempts_per_game;
                } else if (metricName === "field goals made per game") {
                    metric_value = field_goals_made_per_game;
                } else if (metricName === "free throw percentage") {
                    metric_value = free_throw_percentage;
                } else if (metricName === "free throw attempts per game") {
                    metric_value = ppr_points_per_game;
                } else if (metricName === "free throws made per game") {
                    metric_value = free_throws_made_per_game;
                } else if (metricName === "3 point percentage") {
                    metric_value = three_point_percentage;
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

                if ((metric_value === "0.0") || (metric_value === "NaN")) {
                    metric_value = "0";
                }

                session.attributes.metric_value = metric_value;
                session.attributes.games_played = games_played;
                session.attributes.minutes_played = minutes_played;
                session.attributes.points = points;
                session.attributes.total_rebounds = total_rebounds;
                session.attributes.assists = assists;
                session.attributes.steals = steals;
                session.attributes.blocks = blocks;
                session.attributes.turnovers = turnovers;
                session.attributes.field_goal_percentage = field_goal_percentage;
                session.attributes.free_throw_percentage = free_throw_percentage;
                session.attributes.three_point_percentage = three_point_percentage;
                session.attributes.three_pointers_made = three_pointers_made;
                session.attributes.minutes_per_game = minutes_per_game;
                session.attributes.points_per_game = points_per_game;
                session.attributes.total_rebounds_per_game = total_rebounds_per_game;
                session.attributes.assists_per_game = assists_per_game;
                session.attributes.steals_per_game = steals_per_game;
                session.attributes.blocks_per_game = blocks_per_game;
                session.attributes.turnovers_per_game = turnovers_per_game;
                session.attributes.three_pointers_made_per_game = three_pointers_made_per_game;
            
                console.log("Player Key: " + player_key);
                console.log("Metric Value: " + metric_value);
                console.log("Finish Yahoo Search");

                trackEvent(
                    'Intent',
                    'YahooSearch',
                    'NA',
                    '100',
                    function(err) {
                        if (err) {
                            console.log(err);
                        }
                    getMetricRequest(intent, session, response);
                });
            }
        }
    );
};