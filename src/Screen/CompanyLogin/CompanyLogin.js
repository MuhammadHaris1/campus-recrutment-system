import React, { Component } from 'react';
import '../../../src/App.css';
import backButton from '../../Assets/BackButton01.jpg';
import firebase from 'firebase';
import MyVaccancies from './MyVaccancies';

// import { constants } from 'fs';
// import { emit } from 'cluster';
var currentUserObj
class CompanyLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signUp: false,
            isSignIn: false,
            companiesEmail: [],
            companies: [],
            uid: '',
            companyName: '',
            companyEmail: '',
            companyNumber: '',
            companyPass: '',
            emailRef: '',
            passRef: '',
            currentUserObj: '',
            showDashboard: false,
            showProfile: true,
            students: [],
            expLvl: '',
            jobTitle: '',
            sallary: '',
            skillsReq: '',
            showVaccanyForm: false,
            vaccancies: [],
        }
        this.companyName = this.companyName.bind(this);
        this.companyEmail = this.companyEmail.bind(this);
        this.companyNumber = this.companyNumber.bind(this);
        this.companyPass = this.companyPass.bind(this);
        this.signUp = this.signUp.bind(this);
        this.emailRef = this.emailRef.bind(this);
        this.passRef = this.passRef.bind(this);
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.expLvl = this.expLvl.bind(this);
        this.jobTitle = this.jobTitle.bind(this);
        this.sallary = this.sallary.bind(this)
        this.skillsReq = this.skillsReq.bind(this)
        this.addVaccancy = this.addVaccancy.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        // var currentUserObj 
        // console.log(state.uid)
        if (state.uid) {
            firebase.database().ref('/companyAccount/' + state.uid + '/').on('child_added', (snap) => {
                // console.log(snap.val())
                currentUserObj = snap.val();
            });
        }
        return { currentUserObj }
    }

    componentDidMount() {
        const { companiesEmail, uid, companies, students, vaccancies, isSignIn } = this.state
        // const { company } = this.props
        console.log('componentDidMount')
        isSignIn && console.log(firebase.auth().currentUser.uid)
        firebase.database().ref('/companyAccount/').on('child_added', (snapShot) => {
            var user = snapShot.val()
            var key = snapShot.key
            for (var key in user) {
                companiesEmail.push(user[key].companyEmail)
                companies.push(user[key])
                this.setState({ companiesEmail, companies })
            }
        });
        firebase.database().ref('/StudentAccounts/').on('child_added', (snapShot) => {
            var user = snapShot.val()
            // console.log(user)
            var key = snapShot.key
            for (var key in user) {
                students.push(user[key])
                this.setState({ students })
            }
        });

    
    }

    login() {
        const { emailRef, passRef, companiesEmail } = this.state;
        if (companiesEmail.includes(emailRef)) {
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
            console.log('no company found')
        }
    }

    signUp() {
        const { companyEmail, companyName, companyNumber, companyPass } = this.state;
        // console.log(companyEmail, companyName, companyNumber, companyPass, companyObj)
        firebase.auth().createUserWithEmailAndPassword(companyEmail, companyPass)
            .then((succes) => {
                succes.user.updateProfile({
                    displayName: companyName,
                })
                console.log(succes)
                const companyObj = {
                    companyEmail: companyEmail,
                    companyName: companyName,
                    companyNumber: companyNumber,
                    companyPass: companyPass,
                    uid: succes.user.uid
                }
                if (succes) {
                    firebase.database().ref('/companyAccount/' + succes.user.uid + '/').push(companyObj)
                }
                else {
                    console.log('signUp unsuccesfull')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    emailRef(e) {
        this.setState({ emailRef: e.target.value })
    }

    passRef(e) {
        this.setState({ passRef: e.target.value })
    }

    companyName(e) {
        this.setState({ companyName: e.target.value })
    }

    companyEmail(e) {
        this.setState({ companyEmail: e.target.value })
    }

    companyNumber(e) {
        this.setState({ companyNumber: e.target.value })
    }

    companyPass(e) {
        this.setState({ companyPass: e.target.value })
    }

    expLvl(e) {
        this.setState({ expLvl: e.target.value })
    }

    jobTitle(e) {
        this.setState({ jobTitle: e.target.value })
    }

    skillsReq(e) {
        this.setState({ skillsReq: e.target.value })
    }

    sallary(e) {
        this.setState({ sallary: e.target.value })
    }

    addVaccancy() {
        const { expLvl, sallary, skillsReq, jobTitle, uid } = this.state;
        const vaccacyObj = {
            expLvl: expLvl,
            sallary: sallary,
            skillsReq: skillsReq,
            jobTitle: jobTitle,
            companyName: firebase.auth().currentUser.displayName,
        }
        firebase.database().ref('/vaccancy/' + uid + '/').push(vaccacyObj)
    }

    logout() {
        firebase.auth().signOut()
        this.setState({ isSignIn: false, uid: '' })
    }

    renderSignUpForm() {
        return (
            <div className="login">
                <button onClick={() => { this.setState({ signUp: false }) }} >back</button>
                <h1>Company's registration</h1>
                <p>Company Name:</p>
                <input placeholder="Company Name" onChange={this.companyName} />
                <p>Email Adress:</p>
                <input placeholder="Email Adress" onChange={this.companyEmail} />
                <p>Phone Number:</p>
                <input placeholder="Phone Number" onChange={this.companyNumber} />
                <p>Password:</p>
                <input placeholder="Password" type="Password" onChange={this.companyPass} /><br />
                <button onClick={this.signUp}>SignUp</button>
            </div>
        )
    }

    renderComanyVacancy() {
        const name = "Experience Level"
        return (
            <div className="login">
                <h1>Vaccancy Form</h1>
                <p>Job Title</p>
                <input placeholder="Job Title" onChange={this.jobTitle} />
                <p>Skills Required</p>
                <input placeholder="Skills Required" onChange={this.skillsReq} />
                <p>{name}</p>
                <select style={{padding: '10px', width: '400px'}} placeholder="Experience" onChange={this.expLvl}>
                    <option value="Beginner" >Beginner</option>
                    <option value="intermidiate">intermidiate</option>
                    <option value="Expert">Expert</option>
                </select>
                <p>Sallary</p>
                <input placeholder="Sallary" onChange={this.sallary} /><br/>
                <button onClick={this.addVaccancy}>Submit</button>
            </div>
        )
    }

    renderLoginForm() {
        const { back } = this.props;
        const { signUp } = this.state;
        return (
            <div className="login">
                <button onClick={back} >back</button>
                <h1>Company Login</h1>
                <p>Company Email:</p>
                <input placeholder="Company Email" onChange={this.emailRef} />
                <p>password:</p>
                <input placeholder="password" type="Password" onChange={this.passRef} /><br />
                <button onClick={this.login}>Login</button>
                <p>if You don't have company account so signup <button onClick={() => { this.setState({ signUp: !signUp }) }}>here</button> </p>
            </div>
        )
    }

    renderCurrentCompanyProfile() {
        // const { vaccancies } = this.state
        // console.log(vaccancies)
        return (
            <div className="current-user">
                <h1>{currentUserObj.companyName}</h1>
                <button onClick={this.logout}>Log out</button>
                <button onClick={() => { this.setState({ showVaccanyForm: true }) }}>Add Vaccancy</button>
                <p><b>Email:</b> {currentUserObj.companyEmail}</p>
                <p><b>Contact Number:</b>{currentUserObj.companyNumber}</p><br /><br />
                <h1>My Vaccancies</h1>
                <MyVaccancies />
            </div>
        )
    }

    renderDashboard() {
        const { students } = this.state
        let a = 0;
        return (
            <div>
                <h1>Dashboard</h1>
                <h2>All Students</h2>

                <ol>{students.map((value) => {
                    return (
                        <div>
                            <li ><h3>{`Student 0${++a}`}</h3></li>
                            <ul>
                                <li><b>Name : </b>{value.studentName}</li>
                                <li><b>Collage Name : </b>{value.collageName}</li>
                                <li><b>Email : </b>{value.studentEmail}</li>
                                <li><b>Father Name : </b>{value.fatherName}</li>
                            </ul>
                        </div>
                    )
                })}</ol>
            </div>
        )
    }

    render() {
        const { signUp, isSignIn, showDashboard, showProfile, showVaccanyForm, vaccancies, uid } = this.state;
        // console.log(uid)
        return (
            <div>
                {!isSignIn && (signUp ? this.renderSignUpForm() : this.renderLoginForm())}
                {isSignIn && <div>
                    <button onClick={() => { this.setState({ showProfile: true, showDashboard: false, showVaccanyForm: false }) }}>Profile</button>
                    <button onClick={() => { this.setState({ showProfile: false, showDashboard: true, showVaccanyForm: false }) }}>Dashboard</button>
                </div>
                }
                {isSignIn && showProfile && !showVaccanyForm && this.renderCurrentCompanyProfile()}
                {isSignIn && !showVaccanyForm && showDashboard && this.renderDashboard()}
                {showVaccanyForm && this.renderComanyVacancy()}
            </div>

        );
    }
}

export default CompanyLogin;