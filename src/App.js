import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './Firebase/firebase.init';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();

function App() {

  const auth = getAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login, setLoign] = useState(false);

  const btnStyles = {
    marginTop: '25px',
    marginLeft: '25px',
    width: '180px',
    height: '40px',
    borderRadius: '5px',
    border: '1px solid gray',
    backgroundColor: 'lightcoral',
    fontWeight: '700',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer'
  }

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })

    /* .catch((error) => {
      console.log(error.message);
    }); */
  }

  const handleRegistration = event => {
    event.preventDefault();
    console.log(email, password);

    if (password.length < 6) {
      setError('Something wrong! Password should be at least six characters long!');
      return;
    }
    login ? processLogin(email, password) : registerNewUser(email, password);
  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })

      .catch((error) => {
        setError(error.message);
      });
  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        emailVerify();
        setUserName();
      })

      .catch((error) => {
        setError(error.message);
      });
  }

  const emailVerify = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      });
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {displayName: name})
    .then(result => {
      console.log(result);
    })
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleEmailChange = event => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }

  const toggleLogin = event => {
    setLoign(event.target.checked);
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <div className="App">

      <form onSubmit={handleRegistration}>
        <h3 className='text-primary mb-5'>Please {login ? 'Login' : 'Register'}</h3>
        {!login && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="inputName" required />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already registered?
              </label>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger" id='display-error' role="alert">
          {error}
        </div>}
        <button type="submit" className="btn btn-primary btn-sm me-2">{login ? 'Login' : 'Register'}</button>
        <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={handleResetPassword}>Reset Password</button>
      </form>

      <br /><br /><br />
      {/* <button style={btnStyles} onClick={handleGoogleSignIn}>Google Sign In</button> */}
    </div>
  );
}

export default App;
