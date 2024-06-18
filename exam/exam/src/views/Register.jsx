import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    secretPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleCheckboxChange = () => {
    setData(prevData => ({
      ...prevData,
      isAdmin: !prevData.isAdmin
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/users";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit}>
            <h1 className="block text-3xl font-bold mb-6 text-center text-black">Create Account</h1>
            <div className="mb-4">
              <input
                type='text'
                placeholder='Name'
                name='name'
                value={data.name}
                required
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <input
                type='email'
                placeholder='Email'
                name='email'
                value={data.email}
                required
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <input
                type='password'
                placeholder='Password'
                name='password'
                value={data.password}
                required
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {data.isAdmin && (
                <input
                  type='password'
                  placeholder='Secret Password'
                  name='secretPassword'
                  value={data.secretPassword}
                  required={data.isAdmin}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
              )}
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
            </div>
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={data.isAdmin}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2">Register as admin</span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                type='submit'
                className="bg-[#00df9a] hover:bg-green-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
              <Link to="/login" className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
