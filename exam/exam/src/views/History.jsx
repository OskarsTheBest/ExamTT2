import React, { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const [userHistory, setUserHistory] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return; 
    axios.get(`http://localhost:5000/api/getUsers?email=${userEmail}`)
      .then(response => {
        const user = response.data.find(user => user.email === userEmail);
        if (user && user.history) {
          const recentHistory = user.history.filter(entry => {
            const entryDate = new Date(entry.date);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return entryDate >= sevenDaysAgo;
          }).reverse(); 
          setUserHistory(recentHistory);
        }
      })
      .catch(err => console.log(err));
  }, [userEmail]);

  const deleteHistoryEntry = (entryId) => {
    axios.delete(`http://localhost:5000/api/deleteHistory`, { data: { email: userEmail, entryId } })
      .then(response => {
        setUserHistory(userHistory.filter(entry => entry._id !== entryId));
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='flex justify-center items-start pt-20 h-screen'>
      <div className='w-1/2 bg-transparent overflow-auto max-h-96 p-4 rounded-lg'>
        <h1 className='text-white text-center mb-4'>History</h1>
        <h2 className='text-white text-center mb-4'>All tools used in the last 7 days</h2>
        <ul className='list-none space-y-2'>
          {userHistory.length > 0 ? (
            userHistory.map((entry, index) => (
              <li key={index} className='p-3 rounded-md border border-[#00df9a]'>
                <span className='text-white'> | Tool Name: {entry.toolName}</span>
                <span className='text-white'> | File Name: {entry.fileName}</span>
                <span className='text-white'> | Date: {new Date(entry.date).toLocaleString()}</span>
                <button
                  className='ml-4 p-1 bg-red-500 text-white rounded'
                  onClick={() => deleteHistoryEntry(entry._id)}
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li className='text-center text-white'>No recent history found for {userEmail}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default History;
