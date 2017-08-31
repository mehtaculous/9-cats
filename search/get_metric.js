'use strict';

var AlexaSkill = require('../AlexaSkill');

var Keys = require('../data_keys');

module.exports = function getMetricRequest(intent, session, response) {
    var player = session.attributes.playerName,
        metric = session.attributes.metricName,
        season = session.attributes.seasonNumber,
        metric_value = session.attributes.metric_value,
        games_played = session.attributes.games_played,
        minutes_played = session.attributes.minutes_played,
        points = session.attributes.points,
        total_rebounds = session.attributes.total_rebounds,
        assists = session.attributes.assists,
        steals = session.attributes.steals,
        blocks = session.attributes.blocks,
        turnovers = session.attributes.turnovers,
        field_goal_percentage = session.attributes.field_goal_percentage,
        free_throw_percentage = session.attributes.free_throw_percentage,
        three_point_percentage = session.attributes.three_point_percentage,
        three_pointers_made = session.attributes.three_pointers_made,
        minutes_per_game = session.attributes.minutes_per_game,
        points_per_game = session.attributes.points_per_game,
        total_rebounds_per_game = session.attributes.total_rebounds_per_game,
        assists_per_game = session.attributes.assists_per_game,
        steals_per_game = session.attributes.steals_per_game,
        blocks_per_game = session.attributes.blocks_per_game,
        turnovers_per_game = session.attributes.turnovers_per_game,
        three_pointers_made_per_game = session.attributes.three_pointers_made_per_game,
        speechOutput,
        cardTitle,
        cardContent;

    console.log("Get Metric Request...");
    console.log("Player: " + player);
    console.log("Metric: " + metric);
    console.log("Season: " + season);
    console.log("Metric Value: " + metric_value);
    console.log("Games Played: " + games_played);
    console.log("Minutes Played: " + minutes_played);
    console.log("Points: " + points);
    console.log("Total Rebounds: " + total_rebounds);
    console.log("Assists: " + assists);
    console.log("Steals: " + steals);
    console.log("Blocks: " + blocks);
    console.log("Turnovers: " + turnovers);
    console.log("Field Goal Percentage: " + field_goal_percentage);
    console.log("Free Throw Percentage: " + free_throw_percentage);
    console.log("Three Point Percentage: " + three_point_percentage);
    console.log("Three Pointers Made: " + three_pointers_made);
    console.log("Minutes Per Game: " + minutes_per_game);
    console.log("Points Per Game: " + points_per_game);
    console.log("Total Rebounds Per Game: " + total_rebounds_per_game);
    console.log("Assists Per Game: " + assists_per_game);
    console.log("Steals Per Game: " + steals_per_game);
    console.log("Blocks Per Game: " + blocks_per_game);
    console.log("Turnovers Per Game: " + turnovers_per_game);
    console.log("Three Pointers Made Per Game: " + three_pointers_made_per_game);
    console.log("Finish Metric Request");

    if (Keys[player] && Keys[season] && (games_played === undefined || isNaN(games_played))) {
        console.log("I'm sorry, but " + player + " did not play in a single game during the " + season + " season.");
        speechOutput = {
            speech: "I'm sorry, but " + player + " did not play in a single game during the " + season + " season.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = "did not play";
        cardContent = player + " did not play in a single game during " + season;
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    } else if (Keys[player] && (season === "2017") && metric === "season stats") {
        console.log("For the " + season + " season, " + player + " has a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made + " three pointers, with a current total of " + points + " points, " + total_rebounds + " rebounds, " + assists + " assists, " + steals + " steals, " + blocks + " blocks, and " + turnovers + " turnovers.")
        speechOutput = {
            speech: "For the " + season + " season, " + player + " has a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made + " three pointers, with a current total of " + points + " points, " + total_rebounds + " rebounds, " + assists + " assists, " + steals + " steals, " + blocks + " blocks, and " + turnovers + " turnovers.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = "season stats for " + player + " during " + season;
        cardContent = field_goal_percentage + "% field goal percentage, " + free_throw_percentage + "% free throw percentage, " + three_pointers_made + " three pointers made, " + points + " points, " + total_rebounds + " rebounds, " + assists + " assists, " + steals + " steals, " + blocks + " blocks, " + turnovers + " turnovers";
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    } else if (Keys[player] && (season === "2017") && metric === "average stats") { 
        console.log("For the " + season + " season, " + player + " has had a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made_per_game + " three pointers per game, with current averages of " + points_per_game + " points, " + total_rebounds_per_game + " rebounds, " + assists_per_game + " assists, " + steals_per_game + " steals, " + blocks_per_game + " blocks, and " + turnovers_per_game + " turnovers.")
        speechOutput = {
            speech: "For the " + season + " season, " + player + " has a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made_per_game + " three pointers per game, with current averages of " + points_per_game + " points, " + total_rebounds_per_game + " rebounds, " + assists_per_game + " assists, " + steals_per_game + " steals, " + blocks_per_game + " blocks, and " + turnovers_per_game + " turnovers.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = "average stats for " + player + " during " + season;
        cardContent = field_goal_percentage + "% field goal percentage, " + free_throw_percentage + "% free throw percentage, " + three_pointers_made_per_game + " three pointers made, " + points_per_game + " points, " + total_rebounds_per_game + " rebounds, " + assists_per_game + " assists, " + steals_per_game + " steals, " + blocks_per_game + " blocks, " + turnovers_per_game + " turnovers";
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    } else if (Keys[player] && Keys[season] && metric === "season stats") {
        console.log("During the " + season + " season, " + player + " had a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made + " three pointers, to finish with a total of " + points + " points, " + total_rebounds + " rebounds, " + assists + " assists, " + steals + " steals, " + blocks + " blocks, and " + turnovers + " turnovers.")
        speechOutput = {
            speech: "During the " + season + " season, " + player + " had a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made + " three pointers, to finish with a total of " + points + " points, " + total_rebounds + " rebounds, " + assists + " assists, " + steals + " steals, " + blocks + " blocks, and " + turnovers + " turnovers.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = "season stats for " + player + " during " + season;
        cardContent = field_goal_percentage + "% field goal percentage, " + free_throw_percentage + "% free throw percentage, " + three_pointers_made + " three pointers made, " + points + " points, " + total_rebounds + " rebounds, " + assists + " assists, " + steals + " steals, " + blocks + " blocks, " + turnovers + " turnovers";
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    } else if (Keys[player] && Keys[season] && metric === "average stats") { 
        console.log("During the " + season + " season, " + player + " had a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made_per_game + " three pointers per game, to finish with averages of " + points_per_game + " points, " + total_rebounds_per_game + " rebounds, " + assists_per_game + " assists, " + steals_per_game + " steals, " + blocks_per_game + " blocks, and " + turnovers_per_game + " turnovers.")
        speechOutput = {
            speech: "During the " + season + " season, " + player + " had a field goal percentage of " + field_goal_percentage + "%, and a free throw percentage of " + free_throw_percentage + "%, while making " + three_pointers_made_per_game + " three pointers per game, to finish with averages of " + points_per_game + " points, " + total_rebounds_per_game + " rebounds, " + assists_per_game + " assists, " + steals_per_game + " steals, " + blocks_per_game + " blocks, and " + turnovers_per_game + " turnovers.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = "average stats for " + player + " during " + season;
        cardContent = field_goal_percentage + "% field goal percentage, " + free_throw_percentage + "% free throw percentage, " + three_pointers_made_per_game + " three pointers made, " + points_per_game + " points, " + total_rebounds_per_game + " rebounds, " + assists_per_game + " assists, " + steals_per_game + " steals, " + blocks_per_game + " blocks, " + turnovers_per_game + " turnovers";
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    } else if (metric === "games played" && metric_value) {
        console.log("During the " + season + " season, " + player + " played in " + games_played + " games.");
        speechOutput = {
            speech: "During the " + season + " season, " + player + " played in " + games_played + " games.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = metric + " for " + player + " during " + season;
        cardContent = metric_value + " " + metric;
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    } else if ((metric === "field goal percentage" || metric === "free throw percentage" || metric === "3 point percentage") && metric_value) {
        console.log("During the " + season + " season, " + player + " had a " + metric + " of " + metric_value + "%");
        speechOutput = {
            speech: "During the " + season + " season, " + player + " had a " + metric + " of " + metric_value + "%",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = metric + " for " + player + " during " + season;
        cardContent = metric_value + "% " + metric;
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    } else if (Keys[player] && Keys[season] && Keys[metric] && metric_value) {
        console.log("During the " + season + " season, " + player + " had " + metric_value + " " + metric);
        speechOutput = {
            speech: "During the " + season + " season, " + player + " had " + metric_value + " " + metric,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = metric + " for " + player + " during " + season;
        cardContent = metric_value + " " + metric;
        response.tellWithCard(speechOutput, cardTitle, cardContent); 
    } else {
        console.log("I'm sorry, but the information you have provided is invalid.");
        speechOutput = {
            speech: "I'm sorry, but the information you have provided is invalid. Please check the Voice Feedback to make sure I heard you correctly.",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        cardTitle = "the information you have provided is invalid";
        cardContent = "please check the voice feedback to see what alexa heard";
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    }
};