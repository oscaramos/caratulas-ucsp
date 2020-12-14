import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";

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

function App() {
  const classes = useStyles();

  const [url, setUrl] = useState("");

  const [isFetchingCover, setIsFetchingCover] = useState(false);

  const { showError } = useErrorSnack();

  useEffect(() => {
    // ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const generateCover = (data) => {
    // ReactGA.event({
    //   category: "User",
    //   action: "Generate an Cover",
    // });
    setIsFetchingCover(true);
    fetchGenerateCover(data)
      .then((pdfUrl) => {
        setUrl(pdfUrl);
      })
      .catch((error) => {
        setMessageSnack(`Error: ${error}`);
        setOpenSnack(true);
      })
      .finally(() => {
        setIsFetchingCover(false);
      });
  };

  useEffect(() => {
    if (error) {
      showError(`Error: ${error}`);
    }
  }, [showError, error]);

  const handleDownloadCover = () => {
    // ReactGA.event({
    //   category: "User",
    //   action: "Download the generated Cover",
    // });
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
            {!isFetchingCover ? (
              <IconButton
                href={url}
                onClick={handleDownloadCover}
                target="_blank"
                disabled={!url}
                color="primary"
              >
                <PictureAsPdfIcon />
              </IconButton>
            ) : (
              <CircularProgress />
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
