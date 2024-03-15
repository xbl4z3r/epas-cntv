import {Schema} from "mongoose";
import {TriviaSession} from "./trivia";

const LeaderboardSchema = new Schema({
    players: [TriviaSession]
});