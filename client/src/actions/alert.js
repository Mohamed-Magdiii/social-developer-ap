import {SET_ALERT , REMOVE_ALERT} from './types';
import {v4 as uuid} from 'uuid';

export const setAlert =(msg,alertType,timeout=5000)=> dispactch =>{
const id= uuid();
dispactch({
    type: SET_ALERT,
    payload:{msg, alertType, id} 
}); 
setTimeout(() => dispactch({type:REMOVE_ALERT, payload:id}),timeout);
};