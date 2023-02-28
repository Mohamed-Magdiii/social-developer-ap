import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getGethubRepos } from '../../actions/profile'
import  Spinner  from '../layouts/Spinner'
const ProfileGithub = ({username , getGethubRepos ,repos }) => {
    useEffect(()=>{
        getGethubRepos(username)
    },[])
    console.log(repos);
    return ( 
    <div className="profile-github ">
            <h2 className="text-primary my-1">Github Repos</h2>
            {repos === null ? (<Spinner/>) : (
               repos.map(repo =>
               <div key={repo._id} className="repo bg-white p-1 my-1">
                   <div>
                   <h4>
                     <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name} </a>
                    </h4>
                    <p>{repo.description}</p>
                   </div>
                   <div>
                       <ul>
                           <li className="badge badge-primary"> 
                           stars: {repo.stargazers_count}
                           </li>
                           <li className="badge badge-dark"> 
                           watchers: {repo.watchers_count}
                           </li>
                           <li className="badge badge-light"> 
                           forks: {repo.forks_count}
                           </li>
                       </ul>
                   </div>
                </div>

                )
            )}

        </div>
    )
}

ProfileGithub.propTypes = {
   getGethubRepos: PropTypes.func.isRequired,
   repos:PropTypes.array.isRequired,
   username:PropTypes.string.isRequired,
}

const mapStateToProps = state =>({
    repos : state.profile.repos

})

export default connect(mapStateToProps,{getGethubRepos})(ProfileGithub)
    