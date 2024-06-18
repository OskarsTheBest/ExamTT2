import { NavLink } from 'react-router-dom';
import { LINKS } from '../../data';
import { IoClose as CloseIcon } from 'react-icons/io5';
import classes from './style.module.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const renderLinks = () => {
    return LINKS.map((link) => {
      return link.subLinks ? (
        <div key={link.name} className={classes.nonClickableLink}>
          {link.name}
        </div>
      ) : (
        <NavLink
          key={link.name}
          to={link.to}
          className={({ isActive }) => (isActive ? classes.activeLink : '')}
          onClick={closeSidebar}
        >
          {link.name}
        </NavLink>
      );
    });
  };

  return (
    <div className={`${classes.sidebar} ${isOpen ? classes.open : ''}`}>
      <span className={classes.closeIcon} onClick={closeSidebar}>
        <CloseIcon size={30} />
      </span>
      <div className={classes.links}>{renderLinks()}</div>
      <div className={classes.auth}>
        <NavLink to="/login" onClick={closeSidebar} className={classes.login}>
          Login
        </NavLink>
        <NavLink
          to="/register"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `${classes.register} ${isActive ? classes.activeLink : ''}`
          }
        >
          SignUp
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
