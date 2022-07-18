import React, {  useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import SLTLDBConnection from '../apis/SLTLDBConnection'

//Toastify
import {notifyInfo,notifyWarning,notifyError,notifySuccess} from '../utils/toastify'





const Login = ({ setAuth, setUserData }) => {
     const [inputs, setInputs] = useState({
          name: "c",
          password: "c"
     });
     const { name, password } = inputs;

     const onChange = e =>
          setInputs({ ...inputs, [e.target.name]: e.target.value });

     const onSubmitForm = async e => {
          e.preventDefault();
          try {
               const response = await SLTLDBConnection.put(`/auth/insertuser`, {
                    "name": name,
                    "password": password,
               })

               if (!response.data.error) {
                    const {
                         user_name,
                         user_password,
                         auth_level,
                         isadmin,
                         department
                    } = response.data.data.user
                    const user = {
                         user_name,
                         user_password,
                         auth_level,
                         isadmin,
                         department

                    }
                    setUserData(user)
                    setAuth(true)
                  
               }
               if (response.data.error) {
                    setAuth(false)
                    notifyError(response.data.error)
               }
               
          } catch (err) {
               console.error(err.message)
               notifyError(err.message)
          }
     };



     return (
          <div className='container'>
               <h1 className="mt-5 text-center">Login</h1>
               <form onSubmit={onSubmitForm}>
                    <input
                         type="text"
                         name="name"
                         placeholder="Name"
                         value={name}
                         onChange={e => onChange(e)}
                         className="form-control my-3"
                    />
                    <input
                         placeholder="Password"
                         type="password"
                         name="password"
                         value={password}
                         onChange={e => onChange(e)}
                         className="form-control my-3"
                    />
                    <button className="btn btn-success btn-block">Enter</button>
               </form>
          </div>
     );
};

export default Login;
