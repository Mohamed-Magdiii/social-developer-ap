import axios from 'axios';
import {
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    GET_REPOS,
    UPDATE_PROFILE,
} from '../actions/types';
import { setAlert } from './alert';

//Get current user profile
export const getCurrentProfile = ()=> async dispatch =>{
 try {
     const res = await axios.get('/api/profile/me');
     console.log(res);
     dispatch({
        type: GET_PROFILE,
        payload: res.data
     })
 } catch (error) {
    dispatch({ type: CLEAR_PROFILE });
     dispatch({
         type:PROFILE_ERROR,
         payload: {msg: error.response.statusText, status:error.response.status}
     })
 }

}

//Create and update profile details
export const createProfile= (formData , history, edit=false)=>async dispatch =>{
  
 try {
    const config ={
     headers:{
         'Content-Type':'application/json'
     }
    } 
const profile = await axios.post('/api/profile', formData,config);
dispatch({
    type: GET_PROFILE,
    payload: profile.data,
});

dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'));
if(edit){
    history.push('/dashboard'); 
}
 } catch(err){
     const errors = err.response.data.errors;
     console.log(errors);
     if(errors){
         errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg: err.response.statusText}
        });
 }

}

//Add Experience to Profile

export const addExperience = (formData, history) => async dispatch =>{
    try {
        const config ={
         headers:{
             'Content-Type':'application/json'
         }
        } 
    const profile = await axios.put('/api/profile/experience', formData,config);
    dispatch({
        type: UPDATE_PROFILE,
        payload: profile.data,
    });
    
    dispatch(setAlert('Experinece Added' ,'success',)); 
        history.push('/dashboard'); 
    
     } catch(err){
         const errors = err.response.data.errors;
         console.log(errors);
         if(errors){
             errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
            }
            dispatch({
                type:PROFILE_ERROR,
                payload: {msg: err.response.statusText}
            });
     }



}

//Add Education to Profile
export const addEducation = (formData, history) =>async dispatch =>{
    try {
        const config ={
         headers:{
             'Content-Type':'application/json'
         }
        } 
    const profile = await axios.put('/api/profile/education', formData,config);
    dispatch({
        type: UPDATE_PROFILE,
        payload: profile.data,
    });
    
    dispatch(setAlert('Education Added' ,'success',)); 
        history.push('/dashboard'); 
    
     } catch(err){
         const errors = err.response.data.errors;
         console.log(errors);
         if(errors){
             errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
            }
            dispatch({
                type:PROFILE_ERROR,
                payload: {msg: err.response.statusText}
            });
     }

}


//Delete Experience by ID

export const deleteExp = (id)=> async dispatch =>{
    
try {
     const res = await axios.delete(`/api/profile/experience/:${id}`) 
     dispatch({
         type:UPDATE_PROFILE,
        payload:res.data
     })
     dispatch(setAlert("Experience Removed", "success"))
} catch (error) {
    const errors = error.response.data.errors;
    if(errors){
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
       }
       dispatch({
           type:PROFILE_ERROR,
           payload: {msg: error.response.statusText}
       });
}
}

//Delete Education

export const deleteEducation = (id)=> async dispatch =>{
try {
     const res = await axios.delete(`/api/profile/education/:${id}`) 
     dispatch({
         type:UPDATE_PROFILE,
        payload:res.data
     })
     dispatch(setAlert("Education Removed", "success"))
} catch (err) {
    const errors = err.response.data.errors;
    if(errors){
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
       }
       dispatch({
           type:PROFILE_ERROR,
           payload: {msg: err.response.statusText}
       });
}

}

//Delete Account

export const deleteAccount = (history) => async dispatch =>{
    if(window.confirm("Are You Sure You To Delete This Account")){
        try {
            await axios.delete('/api/profile')
        dispatch({
            type:CLEAR_PROFILE
        })
        dispatch({
            type:DELETE_ACCOUNT
        })
        dispatch(setAlert("Profile Deleted"))
  history.push('/login')
    } catch (err) {
            alert("Profile not Deleted")

            const errors = err.response.data.errors;
            if(errors){
                errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
               }
               dispatch({
                   type:PROFILE_ERROR,
                   payload: {msg: err.response.statusText}
               });
        }
    }

}


//Get All profiles

export const getAllProfiles= ()=>async dispatch=>{
   
  dispatch({type:CLEAR_PROFILE})
  try {
      const res = await axios.get('/api/profile')
      dispatch({
          type:GET_PROFILES,
          payload:res.data
      })
  } catch (err) {
      const errors = err.response.data.errrors
      if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg ,"danger")))
      }
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg: err.response.statusText}
        })
  }

}


//Get ProfileByID

export const getProfileById= userId=>async dispatch=>{
    try {
        const res = await axios.get(`/api/profile/user/${userId}`)
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    } catch (err) {
        const errors = err.response.data.errrors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg ,"danger")))
        }
          dispatch({
              type:PROFILE_ERROR,
              payload: {msg: err.response.statusText}
          })
    }
  
  }

  //Get GithubRepoitories
export const getGethubRepos =username =>async dispatch=>{
    try {
        const res = await axios.get(`/api/profile/github/${username}`)
        dispatch({
            type:GET_REPOS,
            payload:res.data
        })
    } catch (err) {
        const errors = err.response.data.errrors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg ,"danger")))
        }
          dispatch({
              type:PROFILE_ERROR,
              payload: {msg: err.response.statusText}
          })
    }
  
  }