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

    doc.setFontSize(26);
    doc.text(data.career, xcenter, 80, { align: "center" });

    doc.setFontSize(18);
    doc.text(data.course, xcenter, 90, { align: "center" });

    doc.setFontSize(16);
    doc.text(data.work, xcenter, 100, { align: "center" });

    doc.setFontSize(18);
    data.members.forEach((member, index) => {
      doc.text(member.name, xright, 120 + index * 8, { align: "right" });
    });

    doc.text(data.semester, xright, 200, { align: "right" });
    doc.text(data.year, xright, 210, { align: "right" });

    if (data.members.length >= 2) {
      doc.text(
        `"Los alumnos declaran haber realizado el presente trabajo de`,
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
    } else if (data.gender === "male") {
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

    const leftCoordX = xcenter - 15;
    const rightCoordX = xcenter + 15;
    const firstLineY = 260;
    const secondLineY = 275;

    if (data.members.length === 1) {
      doc.line(leftCoordX, firstLineY, rightCoordX, firstLineY);
    } else if (data.members.length === 2) {
      doc.line(leftCoordX - 20, firstLineY, rightCoordX - 20, firstLineY);
      doc.line(leftCoordX + 20, firstLineY, rightCoordX + 20, firstLineY);
    } else if (data.members.length === 3) {
      doc.line(leftCoordX - 40, firstLineY, rightCoordX - 40, firstLineY);
      doc.line(leftCoordX, firstLineY, rightCoordX, firstLineY);
      doc.line(leftCoordX + 40, firstLineY, rightCoordX + 40, firstLineY);
    } else if (data.members.length === 4) {
      doc.line(leftCoordX - 60, firstLineY, rightCoordX - 60, firstLineY);
      doc.line(leftCoordX - 20, firstLineY, rightCoordX - 20, firstLineY);
      doc.line(leftCoordX + 20, firstLineY, rightCoordX + 20, firstLineY);
      doc.line(leftCoordX + 60, firstLineY, rightCoordX + 60, firstLineY);
    } else if (data.members.length >= 5) {
      doc.line(leftCoordX - 80, firstLineY, rightCoordX - 80, firstLineY);
      doc.line(leftCoordX - 40, firstLineY, rightCoordX - 40, firstLineY);
      doc.line(leftCoordX, firstLineY, rightCoordX, firstLineY);
      doc.line(leftCoordX + 40, firstLineY, rightCoordX + 40, firstLineY);
      doc.line(leftCoordX + 80, firstLineY, rightCoordX + 80, firstLineY);
    }

    if (data.members.length === 6) {
      doc.line(leftCoordX, secondLineY, rightCoordX, secondLineY);
    } else if (data.members.length === 7) {
      doc.line(leftCoordX - 20, secondLineY, rightCoordX - 20, secondLineY);
      doc.line(leftCoordX + 20, secondLineY, rightCoordX + 20, secondLineY);
    } else if (data.members.length === 8) {
      doc.line(leftCoordX - 40, secondLineY, rightCoordX - 40, secondLineY);
      doc.line(leftCoordX, secondLineY, rightCoordX, secondLineY);
      doc.line(leftCoordX + 40, secondLineY, rightCoordX + 40, secondLineY);
    } else if (data.members.length === 9) {
      doc.line(leftCoordX - 60, secondLineY, rightCoordX - 60, secondLineY);
      doc.line(leftCoordX - 20, secondLineY, rightCoordX - 20, secondLineY);
      doc.line(leftCoordX + 20, secondLineY, rightCoordX + 20, secondLineY);
      doc.line(leftCoordX + 60, secondLineY, rightCoordX + 60, secondLineY);
    } else if (data.members.length >= 10) {
      doc.line(leftCoordX - 80, secondLineY, rightCoordX - 80, secondLineY);
      doc.line(leftCoordX - 40, secondLineY, rightCoordX - 40, secondLineY);
      doc.line(leftCoordX, secondLineY, rightCoordX, secondLineY);
      doc.line(leftCoordX + 40, secondLineY, rightCoordX + 40, secondLineY);
      doc.line(leftCoordX + 80, secondLineY, rightCoordX + 80, secondLineY);
    }

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
        direction="left"
      />
    </div>
  );
}

export default App;
