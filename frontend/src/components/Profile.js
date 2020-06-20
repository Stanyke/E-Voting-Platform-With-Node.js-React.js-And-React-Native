import React, { Component } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import '../App.css';

class Profile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            userToken: Cookies.get('authToken'),
            userEmail: '',
            userFullname: '',
            userGender: '',
            userPhone: '',
            userState: '',
            userLocalGovt: '',
            userVIN: ''
        }

        toast.configure()
    }
    
    
    logoutUser()
    {
        document.getElementById('logoutNotice').style.display = 'block';
    }

    stayLoggedIn()
    {
        document.getElementById('logoutNotice').style.display = 'none';
    }

    continueLogout()
    {
        Cookies.set('authToken', '', { expires: 7, path: '/' });
        this.setState({
            userToken: ''
        })
        toast.error('Logout Successful', {position: toast.POSITION.TOP_LEFT, autoClose: 1500});
    }

    componentDidMount()
    {
        const profileCardCarrier = document.getElementById('profileCardCarrier');

        profileCardCarrier.style.display = 'none';

        if(this.state.userToken !== '' || Cookies.get('authToken') !== '')
        {
            const baseUrl = "https://sdg-team-40.herokuapp.com/profile"

            axios.get(baseUrl, {
                headers: {
                    'authorization': 'Bearer '+this.state.userToken,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                }}).then(result=>{

                    document.getElementById('beatLoaders').style.display = 'none';
                    profileCardCarrier.style.display = 'block';

                    if (result.data)
                    {
                        const userDetails = result.data.user_info;
                        
                        this.setState({
                            userEmail: userDetails.email,
                            userFullname: userDetails.fullname,
                            userGender: userDetails.gender,
                            userPhone: userDetails.phone_number,
                            userState: userDetails.state_of_origin,
                            userLocalGovt: userDetails.local_govt,
                            userVIN: userDetails.vin,
                            profileImageFromW3Schools: ''
                        })

                        userDetails.gender === 'Male' ? this.setState({
                                profileImageFromW3Schools: "https://www.w3schools.com/bootstrap4/img_avatar1.png"
                            }) : this.setState({
                                profileImageFromW3Schools: "https://www.w3schools.com/bootstrap4/img_avatar6.png"
                        })
                    }
            }).catch( error => {
                document.getElementById('beatLoaders').style.display = 'none';

                toast.error("There was an issue getting your details, try checking your internet connection & try again...", {position: toast.POSITION.BOTTOM_LEFT, autoClose: false})
            })
        }
    }


    render() {

        const cardStyle = {
            width: "300px",
            color: "black"
          };

        if(this.state.userToken === '' || Cookies.get('authToken') === '')
        {
          return <Redirect to="/" />
        }
        else
        {
            return (
                <div className="container">

                    <h2 className="mb-5" align="center">E-Voting</h2>

                    <div className="row">
                        
                        <div className="col-md-5">

                            <div className="card" id="profileCardCarrier" style={cardStyle} >
                                    
                                <img className="card-img-top" src={this.state.profileImageFromW3Schools} style={{width: '300px'}} alt="Display" />
                                <div class="card-body">
                                    <h4 className="card-title">{this.state.userFullname}</h4>
                                    <p className="card-text"><b>Email:</b> <span className="card-text-child">{this.state.userEmail}</span></p>
                                    <p className="card-text"><b>Gender:</b> <span className="card-text-child">{this.state.userGender}</span></p>
                                    <p className="card-text"><b>Mobile Number:</b> <span className="card-text-child">{this.state.userPhone}</span></p>
                                    <p className="card-text"><b>Country:</b> <span className="card-text-child">Nigeria</span></p>
                                    <p className="card-text"><b>State:</b> <span className="card-text-child">{this.state.userState}</span></p>
                                    <p className="card-text"><b>Local Govt:</b> <span className="card-text-child">{this.state.userLocalGovt}</span></p>
                                    <button className="form-control btn btn-danger" onClick={() => this.logoutUser()}>Logout</button>
                                </div>
                            </div>
                        </div>
                        <div id="beatLoaders" align="center">
                            <BeatLoader size={50} color="#c31432" loading />
                            <b>Loading...</b>
                        </div>

                        <div id="logoutNotice" align="center">
                            <center>You're About To Logout...</center>
                            <br/>
                            <span className="seperateButton"><button type="button" class="btn btn-primary" onClick={() => this.continueLogout()}>Leave</button></span>
                                
                            <button type="button" class="btn btn-primary" onClick={() => this.stayLoggedIn()}>Stay Back</button>
                        </div>

                    </div>

                </div>
            )
        }
    }
}

export default Profile
