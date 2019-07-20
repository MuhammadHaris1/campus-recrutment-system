import React, { Component } from 'react';
import '../../../src/App.css';
// import backButton from '../../Assets/BackButton01.jpg';
import firebase from 'firebase';
// import { constants } from 'fs';
// import { emit } from 'cluster';

class MyVaccancies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vaccancies: [],
            usersApplied: [],
        }
    }

    componentWillMount() {
        const { vaccancies, usersApplied } = this.state
        console.log('componentWillMountOfMyVaccany')
        firebase.database().ref('/vaccancy/' + firebase.auth().currentUser.uid + '/').on('child_added', (snap) => {
            var vaccancy = snap.val()
            // console.log(snap.key)
            // var key = snap.key

            const vaccacyObj = {
                expLvl: vaccancy.expLvl,
                sallary: vaccancy.sallary,
                skillsReq: vaccancy.skillsReq,
                jobTitle: vaccancy.jobTitle,
                companyName: vaccancy.companyName,
                childKey: snap.key,
                // childKey: key,
            }
            // console.log(vaccacyObj)
            vaccancies.push(vaccacyObj)
            this.setState({ vaccancies })
            firebase.database().ref('/vaccancy/' + firebase.auth().currentUser.uid + '/' + snap.key + '/applied_by/').on('child_added', (snap) => {
                // console.log(snap.val())
                var applied_by = snap.val()
                for (var key in applied_by) {
                    usersApplied.push(applied_by[key])
                    this.setState({ usersApplied })
                }
            })

        })
    }

    renderAppliedStudent() {
        const { usersApplied } = this.state;
        return (
            <div>
                {usersApplied.map((value, index) => {
                    return <li>{value.email}</li>
                })}
            </div>
        )
    }

    render() {
        const { vaccancies, usersApplied } = this.state
        // console.log(usersApplied)
        return (
            <div>
                {vaccancies.map((value) => {
                    return <div className="vaccancy">
                        <h2 >{value.companyName}</h2>
                        <div className="disc">
                            <p><b>Job Title:</b>{value.jobTitle}</p>
                            <p><b>Skills Required:</b>{value.skillsReq}</p>
                            <p><b>Experience Level:</b>{value.expLvl}</p>
                            <p><b>Sallary :</b>{value.sallary}</p>
                            <button>Show Details</button>
                            {/* {usersApplied && this.renderAppliedStudent()} */}
                            <h1>Applied by</h1>
                            {<ol>
                            { usersApplied.map((user, index) => {
                                if(value.childKey === user.childKey){
                                    console.log(user.email)
                                    return <div>
                                        <li><b>{user.email}</b></li>
                                        </div>
                                }
                                // else{
                                //    return <p>No Student Apply</p>
                                // }
                           }
                         
                           )}
                        
                           
                           </ol>}
                        </div>
                    </div>
                })}
            </div>

        );
    }
}

export default MyVaccancies;