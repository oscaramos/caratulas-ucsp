import React, { ComponentProps, useEffect, useState } from "react";
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

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

import CoverForm from "components/CoverForm";
import { useErrorSnack } from "hooks/useErrorSnack";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";

function App() {
  const classes = useStyles();

  const [url, setUrl] = useState("");

  const { post, response, loading, error } = useFetch(
    "https://caratulas-ucsp-api-proxy.vercel.app/api/cover"
  );

  const { showError } = useErrorSnack();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const generateCover: ComponentProps<typeof CoverForm>["onSubmit"] = async (
    data
  ) => {
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
                    disabled={loading || hasErrors}
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

      <GithubCorner
        href="https://github.com/oscaramos/caratulas-ucsp"
        size={80}
      />
    </Container>
  );
}

export default App;
