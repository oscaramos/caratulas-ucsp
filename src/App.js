import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import useFetch from "use-http";
import GithubCorner from "react-github-corner";

import {
  Container,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  Typography,
  Collapse,
} from "@material-ui/core";
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
  wrapperSubmitButton: {
    position: "relative",
  },
  buttonProgress: {
    color: theme.palette.primary,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
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
            <CoverForm
              onSubmit={generateCover}
              submitButton={(onClickGenerate, hasErrors) => (
                <div className={classes.wrapperSubmitButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickGenerate}
                    disabled={loading || !!hasErrors}
                  >
                    Generar Carátula
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              )}
            />
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

      <GithubCorner href="https://github.com/oscaramos/caratulas-ucsp" size={80} />
    </Container>
  );
}

export default App;
