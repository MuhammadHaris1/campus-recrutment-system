import React, { Component } from 'react';
import '../../../src/App.css';
import * as firebase from 'firebase'
// import { stat } from 'fs';
import * as admin from 'firebase-admin';
import * as serviceAccount from './campus-recrutment-system-firebase-adminsdk-w15y3-ab4580971f.json'

// var serviceAccount = require("");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://final-project-2019.firebaseio.com"
});



class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignin: false,
            showProfile: true,
            showDashboard: false,
            students: [],
            companies: [],
            vaccancies: [],
            showAllStudents: false,
            showAllCompanies: false,
            showAllVaccancies: false,
            currentIndex: null,
            adminEmail: '',
            adminPass: '',
        }
        this.deleteStudent = this.deleteStudent.bind(this);
        this.deleteCompanies = this.deleteCompanies.bind(this);
        this.adminEmailValue = this.adminEmailValue.bind(this)
        this.adminPassValue = this.adminPassValue.bind(this)
        this.adminLogin = this.adminLogin.bind(this)
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        const { students, companies, vaccancies } = this.state
        firebase.database().ref('/StudentAccounts/').on('child_added', (snapShot) => {
            var studentsProfile = snapShot.val()
            // console.log(user)
            var key = snapShot.key
            for (var key in studentsProfile) {
                students.push(studentsProfile[key])
                this.setState({ students })
            }
        });

        firebase.database().ref('/companyAccount/').on('child_added', (snapShot) => {
            var companyAccounts = snapShot.val()
            var key = snapShot.key
            for (var key in companyAccounts) {
                // companiesEmail.push(user[key].companyEmail)
                companies.push(companyAccounts[key])
                this.setState({ companies })
            }
        });

        firebase.database().ref('/vaccancy/').on('child_added', (snap) => {
            var vaccancy = snap.val()
            var key = snap.key
            for (var key in vaccancy) {
                const vaccacyObj = {
                    expLvl: vaccancy[key].expLvl,
                    sallary: vaccancy[key].sallary,
                    skillsReq: vaccancy[key].skillsReq,
                    jobTitle: vaccancy[key].jobTitle,
                    companyName: vaccancy[key].companyName,
                    uid: snap.key,
                    childKey: key,
                }
                vaccancies.push(vaccacyObj)
                this.setState({ vaccancies })

            }
        })
    }

    logout() {
    this.setState({ isAdminSignin: false});
    firebase.auth().signOut()
  }

    renderProfile() {
        const { logout } = this.props
        return (
            <div className="current-user">
                <h1>Admin</h1>
                <button onClick={this.logout}>Log out</button>
            </div>
        )
    }

    renderDashboard() {
        return (
            <div>
                <h1>Dashboard</h1>
                <button onClick={() => { this.setState({ showAllStudents: true, showAllCompanies: false, showAllVaccancies: false, currentIndex: null }) }}>All Students</button>
                <button onClick={() => { this.setState({ showAllCompanies: true, showAllStudents: false, showAllVaccancies: false, currentIndex: null }) }}>All Companies</button>
                <button onClick={() => { this.setState({ showAllVaccancies: true, showAllStudents: false, showAllCompanies: false }) }}>All Vaccancies</button>
            </div>
        )
    }

    deleteStudent(uid, index) {
        const { students } = this.state
        console.log(uid)
        admin.auth().deleteUser(uid)
            .then((res) => {
                console.log('delete successfull', res)

            })
            .catch((err) => console.log(err))
        students.splice(index, 1)
        this.setState({ students })
        firebase.database().ref('/StudentAccounts/' + uid + '/').remove()
    }

    renderStudents() {
        const { students, currentIndex } = this.state;
        // let a = 0;
        return (
            <div>
                <h2>All Students</h2>

                <ol>{students.map((value, index) => {
                    // console.log(value)
                    return (
                        <div key={value.uid} className="companies">
                            <li id={value.uid} onClick={() => { this.setState({ currentIndex: index }) }} ><h2>{value.studentName}</h2></li>
                            {(currentIndex == index) && <ul>
                                <li><b>Name : </b>{value.studentName}</li>
                                <li><b>Collage Name : </b>{value.collageName}</li>
                                <li><b>Email : </b>{value.studentEmail}</li>
                                <li><b>Father Name : </b>{value.fatherName}</li>
                                <li> <button onClick={() => { this.deleteStudent(value.uid, index) }}>delete</button></li>
                            </ul>}
                        </div>
                    )
                })}</ol>
            </div>
        )
    }

    deleteCompanies(uid, index) {
        const { companies } = this.state
        console.log(uid)
        admin.auth().deleteUser(uid)
            .then((res) => {
                console.log('delete successfull', res)

            })
            .catch((err) => console.log(err))
        firebase.database().ref('/companyAccount/' + uid + '/').remove()
        firebase.database().ref('/vaccancy/' + uid + '/').remove()
        companies.splice(index, 1)
        this.setState({ companies })

    }

    renderCompanies() {
        const { companies, currentIndex } = this.state;

        return (
            <div>
                {companies.map((value, index) => {
                    return <div className="companies">
                        <h2 onClick={() => { this.setState({ currentIndex: index }) }}>{value.companyName}</h2>
                        {currentIndex == index && <div>
                            <p><b>Email:</b> {value.companyEmail}</p>
                            <p><b>Contact Number:</b>{value.companyNumber}</p>
                            <p><button onClick={this.deleteCompanies.bind(this, value.uid, index)}>Delete</button></p>
                        </div>}
                    </div>
                })}
            </div>
        )
    }

    deleteVacancy(index, childKey, uid) {
        // console.log(index,childKey)
        const { vaccancies } = this.state
        firebase.database().ref('/vaccancy/' + uid + '/' + childKey + '/').remove();
        vaccancies.splice(index, 1)
        this.setState({ vaccancies })
    }

    renderVaccancies() {
        const { vaccancies } = this.state
        console.log(vaccancies)
        return (
            <div>
                {vaccancies.map((value, index) => {
                    return <div className="vaccancy">
                        <h2>{value.companyName}</h2>
                        <p><b>Job Title:</b>{value.jobTitle}</p>
                        <p><b>Skills Required:</b>{value.skillsReq}</p>
                        <p><b>Experience Level:</b>{value.expLvl}</p>
                        <p><b>Sallary :</b>{value.sallary}</p>
                        <p><button onClick={this.deleteVacancy.bind(this, index, value.childKey, value.uid)}>delete</button></p>
                    </div>
                })}
            </div>

        );
    }

    adminEmailValue(e) {
        // console.log(e.target.value)
        const adminEmail = e.target.value;
        this.setState({ adminEmail })
    }

    adminPassValue(e) {
        // console.log(e.target.value)
        const adminPass = e.target.value;
        this.setState({ adminPass })
    }

    adminLogin() {
        console.log('admin')
        const { adminEmail, adminPass } = this.state;

        if (adminEmail == "admin@domain.com" && adminPass == "admin123") {
            firebase.auth().signInWithEmailAndPassword(adminEmail, adminPass)
                .then(success => {
                    console.log(success)
                    this.setState({ isAdminSignin: true })
                })
                .catch(err => console.log(err))
            console.log('admin Login Successfull')
            
        }
    }

    // adminPageBack() {
    //     console.log('back')
    //     this.props.history.goBack()
    //   }

    renderLogin() {
        const { back, emailRef, adminLogin, passRef } = this.props

        return (
            <div className="login">
                <button onClick={back} >back</button>
                <h1>Admin Login</h1>
                <p>Admin Email:</p>
                <input placeholder="Admin Email" onChange={this.adminEmailValue} />
                <p>Password:</p>
                <input placeholder="password" type="Password" onChange={this.adminPassValue} /><br />
                <button onClick={this.adminLogin}>Admin Login</button>

            </div>
        )
    }

    render() {
        // const {  } = this.props
        const { isAdminSignin, showDashboard, showProfile, showAllStudents, showAllCompanies, showAllVaccancies, idToken } = this.state
        // console.log(this.props)
        // console.log(admin.auth().getUser())
        return (
            <div>
                {!isAdminSignin && this.renderLogin()}
                {isAdminSignin && <div>
                    <button onClick={() => { this.setState({ showProfile: true, showDashboard: false }) }}>Profile</button>
                    <button onClick={() => { this.setState({ showProfile: false, showDashboard: true }) }}>Dashboard</button>
                </div>
                }
                {isAdminSignin && showProfile && this.renderProfile()}
                {isAdminSignin && showDashboard && this.renderDashboard()}
                {isAdminSignin && showDashboard && showAllStudents && this.renderStudents()}
                {isAdminSignin && showDashboard && showAllCompanies && this.renderCompanies()}
                {isAdminSignin && showDashboard && showAllVaccancies && this.renderVaccancies()}
                {/* {this.renderVaccancies()} */}
                {/* <button onClick={this.admin} >click</button> */}

            </div>
        );
    }
}

export default AdminLogin;