import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import HeaderBar from "./HeaderBar";
import PokemonDialog from "./PokemonDialog";

import { currentUser } from "../utils/auth";
import "./style/Dashboard.css";

const useStyles = makeStyles((theme) => ({
  gridListRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    maxWidth: "90%",
    maxHeight: 800,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  shopCard: {
    maxWidth: 600,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  loader: {
    position: "relative",
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

const apiUrl = "http://167.71.101.168:8000";

export default function Dashboard() {
  const userId = currentUser();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    fetch(apiUrl + "/get_pokemon?user_id=" + userId.toString(), {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let newList = [];
        data["pokemon"].forEach(function (entry) {
          newList.push({
            id: entry.pokemon_id,
            species: entry.species,
            name: entry.name,
            capturedOn: entry.captured_on
              .toString()
              .substring(0, entry.captured_on.length - 13),
            level: entry.level,
            img: entry.image_url,
          });
        });
        setPokemonList(newList);
        setLoading(false);
      });

    fetch(apiUrl + "/user_details?user_id=" + userId.toString(), {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserDetails({
          username: data.username,
          points: data.points,
          pokeBalls: data.poke_ball,
          greatBall: data.great_ball,
          ultraBall: data.ultra_ball,
        });
      });
  }, [userId]);

  const handleOpenDialog = (pokemon) => {
    setSelectedPokemon(pokemon);
    setDialogOpen(true);
  };

  const handleCloseDialog = (pokemon_id = -1) => {
    setDialogOpen(false);
    if (pokemon_id !== -1) {
      fetch(apiUrl + "/remove_pokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, pokemon_id: pokemon_id }),
      })
        .then((response) => response.json())
        .then((data) => {
          var newList = [];
          for (var i = 0; i < pokemonList.length; i++) {
            if (pokemonList[i].id !== pokemon_id) {
              newList.push(pokemonList[i]);
            }
          }
          setPokemonList(newList);
        });
    }
  };

  const handleBuyBall = (ballType) => {
    fetch(apiUrl + "/buy_ball", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, ball_type: ballType }),
    })
      .then((response) => response.json())
      .then((data) => {
        var userDetailsCopy = JSON.parse(JSON.stringify(userDetails));
        userDetailsCopy.points = data.points_remaining;
        userDetailsCopy.pokeBalls = data.poke_ball;
        userDetailsCopy.greatBall = data.great_ball;
        userDetailsCopy.ultraBall = data.ultra_ball;
        setUserDetails(userDetailsCopy);
      });
  };

  return loading ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <>
      <HeaderBar
        username={userDetails.username}
        pokeCount={pokemonList.length}
      />
      <Grid container spacing={3} direction="row" style={{ maxWidth: "100%" }}>
        <Grid item xs={6} style={{ marginTop: 10 }}>
          <div className={classes.gridListRoot}>
            <GridList cellHeight={300} className={classes.gridList}>
              <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
                <ListSubheader component="div">Captured Pokemon</ListSubheader>
              </GridListTile>
              {pokemonList.map((entry) => (
                <GridListTile key={entry.id}>
                  <img
                    src={entry.img}
                    alt={entry.name}
                    style={{ padding: 50 }}
                  />
                  <GridListTileBar
                    title={entry.name}
                    subtitle={`Captured on ${entry.capturedOn}`}
                    actionIcon={
                      <IconButton
                        aria-label={`info about ${entry.name}`}
                        className={classes.icon}
                        onClick={() => handleOpenDialog(entry)}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))}
              <PokemonDialog
                pokemon={selectedPokemon}
                open={dialogOpen}
                onClose={handleCloseDialog}
              />
            </GridList>
          </div>
          {/* Store Section */}
        </Grid>
        <Grid item xs={6}>
          <h5 style={{ margin: 10 }}>Points: {userDetails.points}</h5>
          <Card className={classes.shopCard}>
            <Grid container direction="row" spacing={4}>
              <Grid item xs={3}>
                <img
                  src="https://cdn.bulbagarden.net/upload/7/79/Dream_Pok%C3%A9_Ball_Sprite.png"
                  alt="pokeball"
                />
              </Grid>
              <Grid item xs={7}>
                <div>
                  <Typography gutterBottom variant="subtitle1">
                    Poké Ball
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    ¥200
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Owned: {userDetails.pokeBalls}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuyBall(1)}
                >
                  Buy
                </Button>
              </Grid>
            </Grid>
          </Card>
          <Card className={classes.shopCard}>
            <Grid container direction="row" spacing={4}>
              <Grid item xs={3}>
                <img
                  src="https://cdn.bulbagarden.net/upload/b/bf/Dream_Great_Ball_Sprite.png"
                  alt="great ball"
                />
              </Grid>
              <Grid item xs={7}>
                <div>
                  <Typography gutterBottom variant="subtitle1">
                    Great Ball
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    ¥600
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Owned: {userDetails.greatBall}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuyBall(2)}
                >
                  Buy
                </Button>
              </Grid>
            </Grid>
          </Card>
          <Card className={classes.shopCard}>
            <Grid container direction="row" spacing={4}>
              <Grid item xs={3}>
                <img
                  src="https://cdn.bulbagarden.net/upload/a/a8/Dream_Ultra_Ball_Sprite.png"
                  alt="ultra ball"
                />
              </Grid>
              <Grid item xs={7}>
                <div>
                  <Typography gutterBottom variant="subtitle1">
                    Ultra Ball
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    ¥1200
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Owned: {userDetails.ultraBall}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuyBall(3)}
                >
                  Buy
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      )
    </>
  );
}
