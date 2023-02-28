import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEduc = ({education:{
    school ,degree, fieldofstudy,from , to ,current ,descsription
}}) => {
    return (
             <div>
            <h3 class="text-dark">{school}</h3>
            <Moment format="YYYY/MM/DD">{from}</Moment> - {!to ? 'Now' : (<Moment format="YYYY/MM/DD">{to}</Moment>) }
            <p><strong>Degree: </strong>{degree}</p>
            <p><strong>Field of study: </strong>{fieldofstudy}</p>
            <p><strong>Description: </strong>{descsription}</p>
          </div>        
        )
}

ProfileEduc.propTypes = {
education : PropTypes.object.isRequired,
}

export default ProfileEduc
