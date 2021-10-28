import React, { ComponentProps, useEffect, useState } from "react";
import ReactGA from "react-ga";
import GithubCorner from "react-github-corner";

import { Grid, Paper, Typography } from "@material-ui/core";

import CoverForm from "components/CoverForm";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import JsPDF from "jspdf";

function App() {
  const classes = useStyles();

  const [outputUrl, setOutputUrl] = useState<URL | null>(null);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const generateCover: ComponentProps<typeof CoverForm>["onSubmit"] = async (
    data
  ) => {
    const doc = new JsPDF();
    doc.text("Hello world!", 20, 20);
    doc.text("This is client-side Javascript, pumping out a PDF.", 20, 30);
    doc.addPage();
    doc.text("Do you like that?", 20, 20);

    setOutputUrl(doc.output("bloburl"));
  };

  console.log(outputUrl);

  return (
    <div className={classes.root}>
      <Grid container direction="row">
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              className={classes.formContainer}
            >
              <Grid item>
                <Typography variant="h2">Carátulas UCSP</Typography>
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
                        disabled={hasErrors}
                      >
                        Generar Carátula
                      </Button>
                    </div>
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <iframe
            style={{
              width: "100%",
              height: "100%",
              zIndex: 2,
              border: "none",
            }}
            src={(outputUrl as unknown) as string}
          />
        </Grid>
      </Grid>

      <GithubCorner
        href="https://github.com/oscaramos/caratulas-ucsp"
        size={80}
      />
    </div>
  );
}

export default App;
