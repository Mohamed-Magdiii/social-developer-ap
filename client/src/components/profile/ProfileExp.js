import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExp = ({experience:{
    company ,title, location,from , to ,current ,descsription
}}) => {
    return (
             <div>
            <h3 class="text-dark">{company}</h3>
            <Moment format="YYYY/MM/DD">{from}</Moment> - {!to ? 'Now' : (<Moment format="YYYY/MM/DD">{to}</Moment>) }
            <p><strong>Position: </strong>{title}</p>
            <p><strong>Description: </strong>{descsription}</p>
          </div>        
        )
}

ProfileExp.propTypes = {
experience : PropTypes.object.isRequired,
}

export default ProfileExp
