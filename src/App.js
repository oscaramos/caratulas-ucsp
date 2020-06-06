import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { fetchGenerateCover } from "./api";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const debug = false;

const defaultData = {
  career: {
    value: debug ? "Ciencias de la computacion" : "",
    label: "Carrera"
  },
  course: {
    value: debug ? "Microprocessors" : "",
    label: "Curso"
  },
  work: {
    value: debug ? "Real final job" : "",
    label: "Nombre del trabajo"
  },
  gender: {
    value: debug ? "M" : "",
    label: "Género"
  },
  names: {
    value: debug ? ["Oscar Daniel Ramos Ramirez"] : [""],
    label: "Integrantes"
  },
  semester: {
    value: debug ? "VIII Semester" : "",
    label: "Semestre"
  },
  year: {
    value: debug ? "1999" : "",
    label: "Año"
  }
};

const useStyles = makeStyles(theme => ({
  "@global": {
    html: {
      backgroundColor: theme.palette.background.default
    }
  },
  root: {
    marginTop: theme.spacing(8)
  },
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  textContainer: {
    width: "80%"
  }
}));

function App() {
  const classes = useStyles();
  const [url, setUrl] = useState("Aquí aparecerá un link");
  const [data, setData] = useState(defaultData);

  const generateCover = () => {
    const convertToDataApi = data =>
      Object.keys(data).reduce((prev, key) => {
        prev[key] = data[key].value;
        return prev;
      }, {});

    fetchGenerateCover(convertToDataApi(data)).then(pdfUrl => {
      setUrl(pdfUrl);
    });
  };

  const handleTextInput = event => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <Container maxWidth="xs" className={classes.root}>
      <Paper>
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          className={classes.form}
          component="form"
          noValidate
          autoComplete="off"
        >
          <Grid item>
            <Typography variant="h5">Carátulas UCSP</Typography>
          </Grid>
          {Object.keys(data).map(field => (
            <Grid item key={field} className={classes.textContainer}>
              <TextField
                key={field}
                name={field}
                label={data[field].label}
                defaultValue={data[field].value}
                onChange={handleTextInput}
                fullWidth
              />
            </Grid>
          ))}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => generateCover()}
            >
              Generar Caratula
            </Button>
          </Grid>
          <Grid item>
            <a href={url}>{url}</a>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
