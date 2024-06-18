import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Home.css';
import Typed from 'react-typed';

function HomePage() {
  useEffect(() => {
    // Plain JavaScript DOM manipulation
    const heroHeader = document.querySelector('.Hero-p');
    if (heroHeader) {
      heroHeader.style.color = 'blue';
    }
  }, []);

  document.title = 'OTools';

  return (
    <div className='Hero'>
      <div className='Hero-txt'>
        <p className='Hero-p'>Use OTools to come further</p>
        <h1 className='Hero-header'>Improve with Tools</h1>
        <div className='Typed'>
          <p>Fast, Easy</p>
          <Typed
            className='Typed-Letter'
            strings={['Image Converting', 'Video downsizing', 'File Converting']}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <button className='nav-btn'>
          <NavLink to='/register' className='about-btn'>
            Get started
          </NavLink>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
