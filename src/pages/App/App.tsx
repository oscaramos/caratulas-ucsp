import JsPDF from "jspdf";
import React, { ComponentProps, useEffect, useState } from "react";
import ReactGA from "react-ga";
import GithubCorner from "react-github-corner";

import { Grid, Paper, Typography } from "@material-ui/core";

import LogoSanPabloImg from "assets/logo-sanpablo.png";

import CoverForm from "components/CoverForm";

import { useStyles } from "./styles";

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
    doc.addImage(LogoSanPabloImg, "JPEG", 120, 20, 70, 30);

    const xcenter = 105;
    const xright = 190;

    doc.setFontSize(22);
    doc.text(data.career, xcenter, 80, { align: "center" });

    doc.setFontSize(18);
    doc.text(data.course, xcenter, 90, { align: "center" });

    doc.setFontSize(16);
    doc.text(data.work, xcenter, 100, { align: "center" });

    doc.setFontSize(18);
    doc.text(data.members[0].name, xright, 120, { align: "right" });

    doc.text(data.semester, xright, 200, { align: "right" });
    doc.text(data.year, xright, 210, { align: "right" });

    if (data.gender === "male") {
      doc.text(
        `"El alumno declara haber realizado el presente trabajo de`,
        xcenter,
        230,
        { align: "center" }
      );
      doc.text(
        `acuerdo a las normas de la Universidad Católica San Pablo"`,
        xcenter,
        237,
        { align: "center" }
      );
    } else if (data.gender === "female") {
      doc.text(
        `"La alumna declara haber realizado el presente trabajo de`,
        xcenter,
        230,
        { align: "center" }
      );
      doc.text(
        `acuerdo a las normas de la Universidad Católica San Pablo"`,
        xcenter,
        237,
        { align: "center" }
      );
    }

    doc.line(xcenter - 20, 260, xcenter + 20, 260);

    setOutputUrl(doc.output("bloburl"));
  };

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
                <CoverForm onSubmit={generateCover} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <iframe
            title="outputPdf"
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
