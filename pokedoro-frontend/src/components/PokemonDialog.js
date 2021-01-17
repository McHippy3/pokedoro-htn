import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  button: {
    margin: 15
  },
  pText: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
  }
});

export default function PokemonDialog(props) {
  const classes = useStyles();
  const { pokemon, onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleRelease = () => {
    onClose(pokemon.id);
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby={pokemon.name} open={open}>
      <DialogTitle>{pokemon.name}</DialogTitle>
      <img
        src={pokemon.img}
        alt={pokemon.name}
        style={{ maxWidth: 300, margin: 15 }}
      />
      <p className={classes.pText}>{"ID: " + pokemon.id}</p> 
      <p className={classes.pText}>{"Level: " + pokemon.level}</p>
      <p className={classes.pText}>{"Species: " + pokemon.species}</p>
      <p className={classes.pText}>{"Captured On: " + pokemon.capturedOn}</p>
      <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleRelease()}>
        Release
      </Button>
    </Dialog>
  );
}
