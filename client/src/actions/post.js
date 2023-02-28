import axios from 'axios'
import {
    GET_POSTS, 
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    DELETE_COMMENT
    } from './types'
import {setAlert} from './alert' 

    // Get All Posts 
export const getPosts = () => async dispatch =>{
    try {
        const res = await axios.get('/api/posts')
        dispatch({
            type : GET_POSTS,
            payload: res.data
        })
    } catch (err) {
       dispatch({
           type:POST_ERROR,
           payload:{msg: err.response.statusText , status:err.response.status}
       })
    }
}

//Add Like
export const addLike = id => async dispatch =>{
    try {
        const res = await axios.put(`/api/posts/likes/${id}`)
        dispatch({
            type : UPDATE_LIKES,
            payload:{id ,likes:res.data }
        })
    } catch (err) {
       dispatch({
           type:POST_ERROR,
           payload:{msg: err.response.statusText , status:err.response.status}
       })
    }
}

//Remove Like
export const removeLike = id => async dispatch =>{
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`)
        dispatch({
            type : UPDATE_LIKES,
            payload: {id, likes:res.data}
        })
    } catch (err) {
       dispatch({
           type:POST_ERROR,
           payload:{msg: err.response.statusText , status:err.response.status}
       })
    }
}

//Delete Post
export const deletePost = (id) => async dispacth =>{
    try {
        const res = await axios.delete(`/api/posts/${id}`)
        dispacth({
            type:DELETE_POST,
            payload:id
        })
        dispacth(setAlert('Post Removed' , 'success'))

    } catch (err) {
        dispacth({
            type:POST_ERROR,
            payload: {msg: err.response.statusText, status:err.response.status}
        })
    }
}

//Add Post 
export const addPost = (formData) => async dispatch =>{
    const config={
        headers:{
            'Content-Type':'application/json',
        }
    };
   const body = JSON.stringify(formData);
try {
        const res = await axios.post('/api/posts',body, config)
        dispatch({
            type : ADD_POST,
            payload:res.data
        })
        dispatch(setAlert('Post Added' , 'success'))
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload: {msg: err.response.statusText, status:err.response.status}
        })
    }
}

// Get Post 
export const getPost = (id) => async dispatch =>{
    try {
        const res = await axios.get(`/api/posts/${id}`)
        dispatch({
            type : GET_POST,
            payload: res.data
        })
    } catch (err) {
       dispatch({
           type:POST_ERROR,
           payload:{msg: err.response.statusText , status:err.response.status}
       })
    }
}


//Add Comment
export const addComment = (postId, formData) => async dispatch =>{
    const config ={
    'Conent-Type':'application/json'
    }
    try {
        const res = await axios.post(`/api/posts/comments/${postId}`, formData, config)
        dispatch({
            type : ADD_COMMENT,
            payload:{postId ,likes:res.data }
        })
        dispatch(setAlert('Comment Added' , 'success'))
    } catch (err) {
       dispatch({
           type:POST_ERROR,
           payload:{msg: err.response.statusText , status:err.response.status}
       })
    }
}


//Delete Comment
export const deleteComment = (postId, commetnId) => async dispatch =>{
  alert("Hello")
    try {
        
        await axios.delete(`/api/posts/comments/${postId}/${commetnId}`)
        dispatch({
            type : DELETE_COMMENT,
            payload:commetnId
        })
        dispatch(setAlert('Comment Deleted' , 'success'))
    } catch (err) {
       dispatch({
           type:POST_ERROR,
           payload:{msg: err.response.statusText , status:err.response.status}
       })
    }
}