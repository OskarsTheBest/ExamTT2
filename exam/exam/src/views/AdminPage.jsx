import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/getUsers')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  }, []);

  const deleteUser = (email) => {
    axios.delete('http://localhost:5000/api/deleteUser', { data: { email } })
      .then(response => {
        setUsers(users.filter(user => user.email !== email));
      })
      .catch(err => {
        console.error('Error deleting user:', err);
      });
  };

  return (
    <div className="container mx-auto px-4 py-6  text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">User Accounts</h1>
      <div className="max-h-96 overflow-y-auto">
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{user.name}</div>
                <div className="text-sm text-gray-300">{user.email}</div>
              </div>
              <button 
                onClick={() => deleteUser(user.email)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;

