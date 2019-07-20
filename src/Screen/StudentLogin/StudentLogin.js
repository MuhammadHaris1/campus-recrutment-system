import React, { Component } from 'react';
import '../../../src/App.css';
import firebase from 'firebase'
var currentUserObj

class StudentLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signUp: false,
            isSignIn: false,
            emailRef: '',
            passRef: '',
            studentName: '',
            fatherName: '',
            collageName: '',
            studentEmail: '',
            studentPass: '',
            studentsEmail: [],
            students: [],
            currentUserObj: '',
            uid: '',
            showProfile: true,
            showDashboard: false,
            vaccancies: [],
            appliedUser: [],
        }
        this.emailRef = this.emailRef.bind(this)
        this.passRef = this.passRef.bind(this)
        this.studentName = this.studentName.bind(this)
        this.fatherName = this.fatherName.bind(this)
        this.collageName = this.collageName.bind(this)
        this.studentEmail = this.studentEmail.bind(this)
        this.studentPass = this.studentPass.bind(this)
        this.signUp = this.signUp.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        // var currentUserObj 
        // console.log(state.uid)
        if (state.uid) {
            firebase.database().ref('/StudentAccounts/' + state.uid + '/').on('child_added', (snap) => {
                // console.log(snap.val())
                currentUserObj = snap.val();
            });

        }
        // console.log(currentUserObj)
        return { currentUserObj }
    }

    componentDidMount() {
        const { studentsEmail, students, vaccancies, appliedUser, uid } = this.state;
        console.log('componentDidMount')
        firebase.database().ref('/StudentAccounts/').on('child_added', (snapShot) => {
            var user = snapShot.val()
            var key = snapShot.key
            for (var key in user) {
                studentsEmail.push(user[key].studentEmail)
                students.push(user[key])
                // console.log(studentsEmail)
                this.setState({ studentsEmail, students })
            }
        })



        firebase.database().ref('/vaccancy/').on('child_added', (snap) => {
            var vaccancy = snap.val()
            var parentKey = snap.key
            // console.log(parentKey)
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
                // console.log(vaccancy[key].applied_by)
                this.setState({ vaccancies })
                firebase.database().ref('/vaccancy/' + parentKey + '/' + key + '/applied_by/' + uid + '/').on('child_added', shot => {
                    var appliedUsers = shot.val()
                    for (var key in appliedUsers) {
                        appliedUser.push(appliedUsers[key].uid)
                        // console.log(appliedUsers[key].uid)
                        this.setState({ appliedUser })
                    }
                })

            }
        })

        // firebase.database().ref('/vaccancy/').on('child_added', (snap) => {
        //     var key = snap.key;
        //     firebase.database().ref('/vaccancy/' + key + '/' ).on('child_added', (snap) => {
        //         var applied_by = snap.val();
        //         console.log(applied_by.applied_by)

        //     })

        // })
    }

    emailRef(e) {
        this.setState({ emailRef: e.target.value })
    }

    passRef(e) {
        this.setState({ passRef: e.target.value })
    }

    studentName(e) {
        this.setState({ studentName: e.target.value })
    }

    fatherName(e) {
        this.setState({ fatherName: e.target.value })
    }

    collageName(e) {
        this.setState({ collageName: e.target.value })
    }

    studentEmail(e) {
        this.setState({ studentEmail: e.target.value })
    }

    studentPass(e) {
        this.setState({ studentPass: e.target.value })
    }

    login() {
        const { emailRef, passRef, studentsEmail } = this.state;
        if (studentsEmail.includes(emailRef)) {
            firebase.auth().signInWithEmailAndPassword(emailRef, passRef)
                .then((success) => {
                    console.log(success)
                    this.setState({ isSignIn: true, uid: success.user.uid })
                })
                .catch((error) => {
                    console.log(error)
                })

        }
        else {
            console.log('no Student found')
        }
    }

    logout() {
        firebase.auth().signOut()
        this.setState({ isSignIn: false, uid: '', currentUserObj: '' })
    }

    signUp() {
        const { studentEmail, studentName, fatherName, collageName, studentPass } = this.state;
        // console.log(companyEmail, companyName, companyNumber, companyPass, companyObj)
        firebase.auth().createUserWithEmailAndPassword(studentEmail, studentPass)
            .then((succes) => {
                succes.user.updateProfile({
                    displayName: studentName,
                })
                console.log(succes)
                const companyObj = {
                    studentEmail: studentEmail,
                    studentName: studentName,
                    fatherName: fatherName,
                    collageName: collageName,
                    studentPass: studentPass,
                    uid: succes.user.uid
                }
                if (succes) {
                    firebase.database().ref('/StudentAccounts/' + succes.user.uid + '/').push(companyObj)
                    console.log(succes)
                }
                else {
                    console.log('signUp unsuccesfull')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderSignUpForm() {
        return (
            <div className="login">
                <button onClick={() => { this.setState({ signUp: false }) }} >back</button>
                <h1>Student's Registration</h1>
                <p>Student Name:</p>
                <input placeholder="Student Name" onChange={this.studentName} />
                <p>Father Name:</p>
                <input placeholder="Father Name" onChange={this.fatherName} />
                <p>Collage Name</p>
                <input placeholder="Collage Name" onChange={this.collageName} />
                <p>Email Adress:</p>
                <input placeholder="Email Adress" onChange={this.studentEmail} />
                <p>Password:</p>
                <input placeholder="Password" type="Password" onChange={this.studentPass} /><br />
                <button onClick={this.signUp}>SignUp</button>
            </div>
        )
    }

    renderLoginForm() {
        const { back } = this.props;
        const { signUp } = this.state;
        return (
            <div className="login">
                <button onClick={back} >back</button>
                <h1>Student Login</h1>
                <p>Student Email:</p>
                <input placeholder="Student Email" onChange={this.emailRef} />
                <p>Password:</p>
                <input placeholder="password" type="Password" onChange={this.passRef} /><br />
                <button onClick={this.login}>Login</button>
                <p>if You don't have Student's account so signup <button onClick={() => { this.setState({ signUp: !signUp }) }}>here</button> </p>
            </div>
        )
    }

    renderCurrentUserProfile() {
        return (
            <div className="current-user">
                <h1>{currentUserObj.studentName}</h1>
                <button onClick={this.logout}>Log out</button>
                <p><b>Father Name:</b>{currentUserObj.fatherName}</p>
                <p><b>Collage Name:</b>{currentUserObj.collageName}</p>
                <p><b>Email:</b>{currentUserObj.studentEmail}</p>

            </div>
        )
    }

    applyVac(childKey, uid) {
        const currentUserUid = firebase.auth().currentUser.uid;
        const appliedUser = {
            name: firebase.auth().currentUser.displayName,
            email: firebase.auth().currentUser.email,
            uid: firebase.auth().currentUser.uid,
            childKey: childKey,
        }
        
        firebase.database().ref('/vaccancy/' + uid + '/' + childKey + '/' + 'applied_by/' + currentUserUid + '/').push(appliedUser)
    }

    renderDashboard() {
        const { vaccancies, appliedUser, uid } = this.state;
        console.log(appliedUser)
        return (
            <div>
                {/* <h1>Dashboard</h1> */}
                <h1 style={{ backgroundColor: 'blue', padding: '20px', margin: 10 }} >All Vaccancies</h1>
                {vaccancies.map((value, index) => {
                    // console.log(!!appliedUser, appliedUser)
                    return (
                        <div className="vaccancy">
                            <h2>{value.companyName}</h2>
                            <p><b>Job Title:</b>{value.jobTitle}</p>
                            <p><b>Skills Required:</b>{value.skillsReq}</p>
                            <p><b>Experience Level:</b>{value.expLvl}</p>
                            <p><b>Sallary :</b>{value.sallary}</p>
                            {
                                ( appliedUser[index] === uid) ? <button disabled >Apply</button>:<button id='apply' onClick={this.applyVac.bind(this, value.childKey, value.uid)} >Apply</button>
                             
                            }
                                {/* {appliedUser[index].childKey !== value.childKey && appliedUser[index].uid === uid && <button id='apply' onClick={this.applyVac.bind(this, value.childKey, value.uid)} >Apply</button>} */}
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        // const { back } = this.props;
        const { signUp, isSignIn, showDashboard, showProfile } = this.state;
        // console.log( vaccancies )
        return (
            <div>
                {!isSignIn && (signUp ? this.renderSignUpForm() : this.renderLoginForm())}
                {isSignIn && <div>
                    <button onClick={() => { this.setState({ showProfile: true, showDashboard: false }) }}>Profile</button>
                    <button onClick={() => { this.setState({ showProfile: false, showDashboard: true }) }}>Dashboard</button>
                </div>
                }
                {isSignIn && showProfile && this.renderCurrentUserProfile()}
                {isSignIn && showDashboard && this.renderDashboard()}
            </div>
        );
    }
}

export default StudentLogin;