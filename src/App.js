import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import useFetch from "use-http";

import {
  Container,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  Snackbar,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

import CoverForm from "./components/CoverForm";
import { useErrorSnack } from "./hooks/useErrorSnack";
import Button from "@material-ui/core/Button";

ReactGA.initialize("UA-160924990-2");

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(10),
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      maxWidth: "100%",
      marginLeft: 0,
      marginRight: 0,
    },
  },
  paper: {
    paddingTop: "2em",
    paddingBottom: "2em",
    paddingLeft: "10%",
    paddingRight: "10%",
  },
}));

const apiUrl = "https://caratulas-ucsp-api-proxy.vercel.app/api/cover";

function App() {
  const classes = useStyles();

  const [url, setUrl] = useState("");

  const { post, response, loading, error } = useFetch(apiUrl);

  const { showError } = useErrorSnack();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const generateCover = async (data) => {
    const coverData = await post("/", data);
    if (response.ok) {
      setUrl(coverData.link);
    }
  };

  useEffect(() => {
    if (error) {
      showError(`Error: ${error}`);
    }
  }, [showError, error]);

  const handleDownloadCover = () => {
    ReactGA.event({
      category: "User",
      action: "Download the generated Cover",
    });
  };

  return (
    <Container maxWidth="xs" className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container direction="column" alignItems="center">
          <Grid item style={{ marginBottom: "1em" }}>
            <Typography variant="h1">Carátulas UCSP</Typography>
          </Grid>

          <Grid item container>
            <CoverForm onSubmit={generateCover} />
          </Grid>

          <Grid item>
            <Collapse in={!!url}>
              <IconButton
                href={url}
                onClick={handleDownloadCover}
                target="_blank"
                hidden={!url}
                color="primary"
              >
                <PictureAsPdfIcon />
              </IconButton>
            </Collapse>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
