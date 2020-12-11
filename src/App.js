import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import { useForm, Controller, useFieldArray } from "react-hook-form";

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
import ControlledAutocomplete from "./ControlledAutocomplete";

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

  const { register, watch, errors, getValues, control } = useForm({
    mode: "onBlur",
    defaultValues: {
      work: "",
      career: "",
      course: "",
      semester: "",
      year: "2021-1",
      members: [{ name: "" }],
    },
  });
  const career = watch("career");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const [isFetchingCover, setIsFetchingCover] = useState(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState("");

  useEffect(() => {
    // Mark page as visited by Google Analytics
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const generateCover = () => {
    const values = getValues();
    const data = {
      ...values,
      names: values.members.map((obj) => obj.name),
      course: values.course.name,
    };

    ReactGA.event({
      category: "User",
      action: "Generate an Cover",
    });

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

  const handleCloseSnack = (event, reason) => {
    if (reason !== "clickaway") {
      setOpenSnack(false);
    }
  };

  const handleDownloadCover = () => {
    // ReactGA.event({
    //   category: "User",
    //   action: "Download the generated Cover",
    // });
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
            <ControlledAutocomplete
              control={control}
              name="career"
              options={careerOptions}
              renderInput={(params) => (
                <TextField
                  name="career"
                  variant="outlined"
                  label="Carrera"
                  error={!!errors.career}
                  fullWidth
                  {...params}
                />
              )}
              rules={{ required: true }}
              defaultValue={null}
              openOnFocus
              freeSolo
            />
          </Grid>{" "}
          {/*----- Course -----*/}
          <Grid item className={classes.itemContainer}>
            <ControlledAutocomplete
              control={control}
              name="course"
              options={getCourses(career)}
              groupBy={(option) => option.semester}
              getOptionLabel={(option) => option?.name ?? ""}
              renderInput={(params) => (
                <TextField
                  name="course"
                  variant="outlined"
                  label="Curso"
                  error={!!errors.course}
                  fullWidth
                  {...params}
                />
              )}
              rules={{ required: true }}
              defaultValue={null}
              openOnFocus
              freeSolo
            />
          </Grid>{" "}
          {/*----- Work -----*/}
          <Grid item className={classes.itemContainer}>
            <TextField
              name="work"
              variant="outlined"
              label="Nombre del trabajo"
              error={!!errors.work}
              inputRef={register({ required: true })}
              fullWidth
            />
          </Grid>{" "}
          {/*----- Semester and Year -----*/}
          <Grid item className={classes.itemContainer}>
            <Grid container spacing={1} direction="row">
              <Grid item className={classes.semesterInput}>
                <ControlledAutocomplete
                  control={control}
                  name="semester"
                  options={semesterOptions}
                  renderInput={(params) => (
                    <TextField
                      name="semester"
                      variant="outlined"
                      label="Semestre"
                      error={!!errors.semester}
                      fullWidth
                      {...params}
                    />
                  )}
                  rules={{ required: true }}
                  defaultValue={null}
                  openOnFocus
                  freeSolo
                />
              </Grid>
              <Grid item className={classes.yearInput}>
                <TextField
                  name="year"
                  variant="outlined"
                  label="Año"
                  error={!!errors.year}
                  inputRef={register({ required: true })}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>{" "}
          {/*----- Gender -----*/}
          <Grid item className={classes.itemContainer}>
            <Collapse in={fields.length === 1}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Género</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue="M"
                  as={
                    <RadioGroup row aria-label="Género">
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
                  }
                />
              </FormControl>
            </Collapse>
          </Grid>{" "}
          {/*----- Names -----*/}
          <Grid item className={classes.itemContainer}>
            <FormLabel component="legend">Integrantes</FormLabel>
            <div style={{ width: "100%", height: "0.5em" }} />
            <Grid container spacing={1}>
              {fields.map((item, index) => (
                <Grid item container key={item.id}>
                  <Controller
                    name={`members[${index}].name`}
                    control={control}
                    defaultValue={item.name}
                    as={
                      <TextField
                        variant="outlined"
                        name="names"
                        autoFocus={true}
                        onKeyDown={(keyEvent) => {
                          if (keyEvent.ctrlKey && keyEvent.key === "Enter") {
                            generateCover();
                          } else if (keyEvent.key === "Enter") {
                            append({ name: "" });
                          }
                        }}
                        // error={clickedGenerate && data["names"].value.length === 0}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {/*----- The last name has plus button, the others has minus buttons -----*/}
                              {index === fields.length - 1 ? (
                                <IconButton
                                  aria-label="add name"
                                  onClick={() => append({ name: "" })}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <IconButton
                                  aria-label="remove name"
                                  onClick={() => remove(index)}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    }
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
