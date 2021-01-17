import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import Button from "@material-ui/core/Button";

import { useHistory } from "react-router-dom";

import { logout } from '../utils/auth';

import "./style/HeaderBar.css";
import pokedoroLogo from '../images/pokedoro_logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 5,
    marginBottom: 10,
    maxHeight: 50
  },
}));

export default function HeaderBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const open = Boolean(anchorEl);

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    history.push('/');
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <img src={pokedoroLogo} className={classes.title} alt="pokedoro logo"/>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleUserMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={open}
              onClose={handleClose}
            >
              <div style={{padding:"10px"}}>
                <p>Username: {props.username} </p>
                <p>Pokemon Captured: {props.pokeCount}</p>
                <Button variant="contained" color="secondary" style={{margin: "auto"}} onClick={() => handleLogout()}>
                  Logout
                </Button>
              </div>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}