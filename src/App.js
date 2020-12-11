import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import Collapse from "@material-ui/core/Collapse";

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

import { fetchGenerateCover } from "./api";

import courses from "./courses.json";

ReactGA.initialize("UA-160924990-2");

const careerOptions = [
  "Ciencia de la Computación",
  "Administración de Empresas",
  "Arquitectura y Urbanismo",
  "Contabilidad",
  "Derecho",
  "Educación Inicial",
  "Educación Primaria",
  "Ingeniería Ambiental",
  "Ingeniería Civil",
  "Ingeniería Electrónica y Telecomunicaciones",
  "Ingeniería Industrial",
  "Ingeniería Mecatrónica",
  "Psicología",
];

const semesterOptions = [
  "Semestre I",
  "Semestre II",
  "Semestre III",
  "Semestre IV",
  "Semestre V",
  "Semestre VI",
  "Semestre VII",
  "Semestre VIII",
  "Semestre IX",
  "Semestre X",
  "Semestre XI",
  "Semestre XII",
];

const getCourses = (career) => {
  if (courses[career]) {
    return courses[career];
  }
  return [];
};

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
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemContainer: {
    width: "80%",
  },
  semesterInput: {
    width: "60%",
    display: "inline",
  },
  yearInput: {
    width: "40%",
    display: "inline",
  },
}));

function App() {
  const classes = useStyles();

  const [url, setUrl] = useState("");
  const [data, setData] = useState({
    career: {
      value: "Ciencia de la Computación",
    },
    course: {
      value: "",
    },
    work: {
      value: "",
    },
    semester: {
      value: "",
    },
    year: {
      value: "2020-2",
    },
    gender: {
      value: "M",
    },
    names: {
      value: [""],
    },
  });
  const [collapseGender, setCollapseGender] = useState(false);

  const [isFetchingCover, setIsFetchingCover] = useState(false);
  const [clickedGenerate, setClickedGenerate] = useState(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState("");

  useEffect(() => {
    if (data.names.value.length > 1) {
      setCollapseGender(true);
    } else {
      setCollapseGender(false);
    }
  }, [data]);

  useEffect(() => {
    // Mark page as visited by Google Analytics
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const generateCover = () => {
    const convertToDataApi = (data) =>
      Object.keys(data).reduce((prev, key) => {
        prev[key] = data[key].value;
        return prev;
      }, {});

    const allFieldsAreFilled = () => {
      const empties = Object.values(convertToDataApi(data)).filter(
        (val) => !val
      );
      return empties.length === 0;
    };

    ReactGA.event({
      category: "User",
      action: "Generate an Cover",
    });

    setClickedGenerate(true);
    if (allFieldsAreFilled()) {
      setIsFetchingCover(true);
      fetchGenerateCover(convertToDataApi(data))
        .then((pdfUrl) => {
          setUrl(pdfUrl);
          setIsFetchingCover(false);
        })
        .catch((error) => {
          setMessageSnack(`Error: ${error}`);
          setOpenSnack(true);
          setIsFetchingCover(false);
        });
    }
  };

  const handleDataChange = (field, value) => {
    setData({
      ...data,
      [field]: {
        ...data[field],
        value,
      },
    });
  };

  const changeName = (index) => (event) => {
    const changeNameFromData = (value) => {
      const newValues = [...value];
      newValues[index] = event.target.value;
      return newValues;
    };

    setData({
      ...data,
      names: {
        ...data.names,
        value: changeNameFromData(data.names.value),
      },
    });
  };

  const addName = () => {
    setData({
      ...data,
      names: {
        ...data.names,
        value: [...data.names.value, ""],
      },
    });
  };

  const removeName = (indexToRemove) => () => {
    setData({
      ...data,
      names: {
        ...data.names,
        value: data.names.value.filter((_, idx) => idx !== indexToRemove),
      },
    });
  };

  const handleCloseSnack = (event, reason) => {
    if (reason !== "clickaway") {
      setOpenSnack(false);
    }
  };

  const handleDownloadCover = () => {
    // This might me useless when the event 'Generate Cover' is done but anyway i'll do it
    // I'll check the radio between Generated covers and the Downloaded covers
    ReactGA.event({
      category: "User",
      action: "Download the generated Cover",
    });
  };

  return (
    <Container maxWidth="xs" className={classes.root}>
      <Paper>
        {" "}
        {/*----- User data input -----*/}
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          className={classes.form}
          component="form"
          noValidate
          autoComplete="off"
        >
          {" "}
          {/*----- Header -----*/}
          <Grid item>
            <Typography variant="h1">Carátulas UCSP</Typography>
          </Grid>
          <div style={{ width: "100%", height: "1em" }} />{" "}
          {/*----- Career -----*/}
          <Grid item className={classes.itemContainer}>
            <Autocomplete
              options={careerOptions}
              inputValue={data["career"].value}
              onInputChange={(event, value) =>
                handleDataChange("career", value)
              }
              openOnFocus
              handleHomeEndKeys
              freeSolo
              renderInput={(params) => (
                <TextField
                  name="career"
                  variant="outlined"
                  label="Carrera"
                  error={clickedGenerate && !data["career"].value}
                  fullWidth
                  {...params}
                />
              )}
            />
          </Grid>{" "}
          {/*----- Course -----*/}
          <Grid item className={classes.itemContainer}>
            <Autocomplete
              options={getCourses(data.career.value)}
              groupBy={(option) => option.semester}
              getOptionLabel={(option) => option.name}
              inputValue={data["course"].value}
              onInputChange={(event, value) =>
                handleDataChange("course", value)
              }
              onChange={(event, value) =>
                handleDataChange("semester", value.semester)
              }
              openOnFocus
              freeSolo
              renderInput={(params) => (
                <TextField
                  name="course"
                  variant="outlined"
                  label="Curso"
                  error={clickedGenerate && !data["course"].value}
                  fullWidth
                  {...params}
                />
              )}
            />
          </Grid>{" "}
          {/*----- Work -----*/}
          <Grid item className={classes.itemContainer}>
            <TextField
              name="work"
              variant="outlined"
              value={data["work"].value}
              label="Nombre del trabajo"
              onChange={(event) => handleDataChange("work", event.target.value)}
              error={clickedGenerate && !data["work"].value}
              fullWidth
            />
          </Grid>{" "}
          {/*----- Semester and Year -----*/}
          <Grid item className={classes.itemContainer}>
            <Grid container spacing={1} direction="row">
              <Grid item className={classes.semesterInput}>
                <Autocomplete
                  options={semesterOptions}
                  inputValue={data["semester"].value}
                  onInputChange={(event, value) =>
                    handleDataChange("semester", value)
                  }
                  openOnFocus
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      name="semester"
                      variant="outlined"
                      label="Semestre"
                      error={clickedGenerate && !data["semester"].value}
                      fullWidth
                      {...params}
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.yearInput}>
                <TextField
                  name="year"
                  variant="outlined"
                  value={data["year"].value}
                  label="Año"
                  onChange={(event) =>
                    handleDataChange("year", event.target.value)
                  }
                  error={clickedGenerate && !data["year"].value}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>{" "}
          {/*----- Gender -----*/}
          <Grid item className={classes.itemContainer}>
            <Collapse in={!collapseGender}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Género</FormLabel>
                <RadioGroup
                  row
                  aria-label="Género"
                  value={data["gender"].value}
                  onChange={(event) =>
                    handleDataChange("gender", event.target.value)
                  }
                >
                  <FormControlLabel
                    name="gender"
                    key="M"
                    value="M"
                    label="Masculino"
                    style={{ marginRight: "1.25em" }}
                    control={<Radio color="primary" />}
                  />
                  <FormControlLabel
                    name="gender"
                    key="F"
                    value="F"
                    label="Femenino"
                    style={{ marginRight: "1.25em" }}
                    control={<Radio color="primary" />}
                  />
                </RadioGroup>
              </FormControl>
            </Collapse>
          </Grid>{" "}
          {/*----- Names -----*/}
          <Grid item className={classes.itemContainer}>
            <FormLabel component="legend">Integrantes</FormLabel>
            <div style={{ width: "100%", height: "0.5em" }} />
            <Grid container spacing={1}>
              {data["names"].value.map((name, index) => (
                <Grid item container key={index}>
                  <TextField
                    variant="outlined"
                    name="names"
                    value={name}
                    onChange={changeName(index)}
                    autoFocus={true}
                    onKeyDown={(keyEvent) => {
                      if (keyEvent.ctrlKey && keyEvent.key === "Enter") {
                        generateCover();
                      } else if (keyEvent.key === "Enter") {
                        addName();
                      }
                    }}
                    error={clickedGenerate && data["names"].value.length === 0}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {/*----- The last name has plus button, the others has minus buttons -----*/}
                          {index === data["names"].value.length - 1 ? (
                            <IconButton aria-label="add name" onClick={addName}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="remove name"
                              onClick={removeName(index)}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>{" "}
          {/*----- User interactions -----*/}
          <div style={{ width: "100%", height: "2em" }} />
          <Grid item>
            {" "}
            {/*----- Button -----*/}
            <Button
              variant="contained"
              color="primary"
              onClick={() => generateCover()}
            >
              Generar Caratula
            </Button>
          </Grid>
          <Grid item>
            {" "}
            {/*----- Link -----*/}
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
          </Grid>{" "}
          {/*----- An message -----*/}
          {url ? (
            <Grid item>
              <Typography variant="caption">
                Intente hacerlo de nuevo sin mouse
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Paper>{" "}
      {/*----- Error Message Snack -----*/}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnack}
        onClose={handleCloseSnack}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={handleCloseSnack}
        >
          {messageSnack}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
