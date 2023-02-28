/** @format */

import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileTop from './ProfileTop'
import ProfileAbout from "./ProfileAbout";
import ProfileExp from "./ProfileExp";
import ProfileEduc from "./ProfileEduc";
import ProfileGithub from "./ProfileGithub";

const Profile = ({
  match,
  profile: { profile, loading },
  auth,
  getProfileById,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, []);
  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {
          auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit
              </Link>
            )
            }
                  <div className="profile-grid my-1">
                      <ProfileTop profile={profile}/>
                      <ProfileAbout profile={profile}/>
                        <div className="profile-exp bg-white p-2">
                            <h2 className="text-primary">Experience</h2>
                            {profile.experience.length > 0  ? (
                                <Fragment>
                                    {profile.experience.map(exp=> 
                                        <ProfileExp key={exp._id} experience={exp}/>
                                        )}
                                </Fragment> 
                                )
                                :(<h2>No Experience Credentials</h2>)
                            }
                        </div>
                        <div className="profile-exp bg-white p-2">
                            <h2 className="text-primary">Experience</h2>
                            {profile.education.length > 0  ? (
                                <Fragment>
                                    {profile.education.map(edu=> 
                                        <ProfileEduc key={edu._id} education={edu}/>
                                        )}
                                </Fragment> 
                                )
                                :(<h2>No Education Credentials</h2>)
                            }
                        </div>
                    {profile.githubusername && (<ProfileGithub  username={profile.githubusername}/>)}
                    </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
