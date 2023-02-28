import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import  profile  from "./profile";
import  post  from "./post";

//this file contain combineReducers that save every reducer file created 

export default combineReducers({
    alert,
    auth,
    profile,
    post
});