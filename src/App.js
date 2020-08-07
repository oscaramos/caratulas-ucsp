import React, { useState } from "react";

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
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import { fetchGenerateCover } from "./api";

const defaultData = {
  career: {
    value: "Ciencia de la Computación",
    label: "Carrera",
    options: [
      "Ciencia de la Computación",
      "Administración de Empresas",
      "Arquitectura y Urbanismo",
      "Contabilidad",
      "Derecho",
      "Educación inicial y primaria",
      "Ingenieria Mecatronica",
      "Ingenieria Civil",
      "Ingenieria Electronica y Telecomunicaciones",
      "Ingenieria Industrial",
      "Psicologia",
      "Sin carrera",
      ""
    ]
  },
  course: {
    value: "",
    label: "Curso"
  },
  work: {
    value: "",
    label: "Nombre del trabajo"
  },
  semester: {
    value: "",
    label: "Semestre",
    options: ["Semestre I", "Semestre II", "Semestre III", "Semestre IV", "Semestre V"
      , "Semestre VI", "Semestre VII", "Semestre VIII", "Semestre IX", "Semestre X"
      , "Semestre XI", "Semestre XII", ""]
  },
  year: {
    value: "2020-2",
    label: "Año"
  },
  gender: {
    value: "M",
    radio: { "M": "Masculino", "F": "Femenino" },
    label: "Género"
  },
  names: {
    value: [""],
    label: "Integrantes"
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
  itemContainer: {
    width: "80%"
  },
  semesterInput: {
    width: "60%",
    display: "inline"
  },
  yearInput: {
    width: "40%",
    display: "inline"
  }
}));



function App() {
  const classes = useStyles();

  const [url, setUrl] = useState("");
  const [data, setData] = useState(defaultData);

  const [isFetchingCover, setIsFetchingCover] = useState(false);
  const [clickedGenerate, setClickedGenerate] = useState(false);

  const generateCover = () => {
    const convertToDataApi = data =>
      Object.keys(data).reduce((prev, key) => {
        prev[key] = data[key].value;
        return prev;
      }, {});

    const allFieldsAreFilled = () => {
      const empties = Object.values(convertToDataApi(data)).filter(val => !val);
      return empties.length === 0;
    };

    setClickedGenerate(true);
    if (allFieldsAreFilled()) {
      setIsFetchingCover(true);
      fetchGenerateCover(convertToDataApi(data))
        .then(pdfUrl => {
          setUrl(pdfUrl);
          setIsFetchingCover(false);
        })
        .catch(() => {
          alert("Error: Servidor posiblemente apagado\n" +
            "Solución: Esperar de 1 a 2 minutos y volver a generar una carátula");
          setIsFetchingCover(false);
        });
    }
  };

  const handleDataChange = (field, value) => {
    setData({
      ...data,
      [field]: {
        ...data[field],
        value
      }
    });
  };

  const changeName = index => event => {
    const changeNameFromData = (value) => {
      const newValues = [...value];
      newValues[index] = event.target.value;
      return newValues;
    }

    setData({
      ...data,
      names: {
        ...data.names,
        value: changeNameFromData(data.names.value)
      }
    });
  }

  const addName = () => {
    setData({
      ...data,
      names: {
        ...data.names,
        value: [...data.names.value, ""]
      }
    })
  }

  const removeName = indexToRemove => () => {
    setData({
      ...data,
      names: {
        ...data.names,
        value: data.names.value.filter((_, idx) => idx !== indexToRemove)
      }
    })
  }

  return (
    <Container maxWidth='xs' className={classes.root}>
      <Paper>
        {" "}
        {/*----- User data input -----*/}
        <Grid container spacing={2} direction='column' alignItems='center'
              className={classes.form} component='form' noValidate autoComplete='off'>
          {" "}
          {/*----- Header -----*/}
          <Grid item>
            <Typography variant='h4'>Carátulas UCSP</Typography>
          </Grid>

          {" "}
          {/*----- Career -----*/}
          <Grid item className={classes.itemContainer}>
            <Autocomplete
              options={data['career'].options}
              value={data['career'].value}
              onChange={(event, value) => handleDataChange('career', value)}
              renderInput={(params) =>
                <TextField
                  name='career'
                  variant='outlined'
                  label={data['career'].label}
                  error={clickedGenerate && !data['career'].value}
                  fullWidth
                  {...params}
                />
              }
            />
          </Grid>

          {" "}
          {/*----- Course -----*/}
          <Grid item className={classes.itemContainer}>
            <TextField
              name='course'
              variant='outlined'
              value={data['course'].value}
              label={data['course'].label}
              onChange={(event) => handleDataChange('course', event.target.value)}
              error={clickedGenerate && !data['course'].value}
              fullWidth
            />
          </Grid>

          {" "}
          {/*----- Work -----*/}
          <Grid item className={classes.itemContainer}>
            <TextField
              name='work'
              variant='outlined'
              value={data['work'].value}
              label={data['work'].label}
              onChange={(event) => handleDataChange('work', event.target.value)}
              error={clickedGenerate && !data['work'].value}
              fullWidth
            />
          </Grid>

          {" "}
          {/*----- Semester and Year -----*/}
          <Grid item className={classes.itemContainer}>
            <Grid container spacing={1} direction='row'>
              <Grid item className={classes.semesterInput}>
                <Autocomplete
                  options={data['semester'].options}
                  value={data['semester'].value}
                  onChange={(event, value) => handleDataChange('semester', value)}
                  renderInput={(params) =>
                    <TextField
                      name='semester'
                      variant='outlined'
                      label={data['semester'].label}
                      error={clickedGenerate && !data['semester'].value}
                      fullWidth
                      {...params}
                    />
                  }
                />
              </Grid>
              <Grid item className={classes.yearInput}>
                <TextField
                  name='year'
                  variant='outlined'
                  value={data['year'].value}
                  label={data['year'].label}
                  onChange={(event) => handleDataChange('year', event.target.value)}
                  error={clickedGenerate && !data['year'].value}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          {" "}
          {/*----- Gender -----*/}
          <Grid item className={classes.itemContainer}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>{data['gender'].label}</FormLabel>
              <RadioGroup row aria-label={data['gender'].label} value={data['gender'].value}
                          onChange={(event) => handleDataChange('gender', event.target.value)}>
                {
                  Object.entries(data['gender'].radio).map(([key, label]) => (
                    <FormControlLabel
                      name='gender'
                      key={key}
                      value={key}
                      label={label}
                      style={{ marginRight: "1.25em" }}
                      control={<Radio color='primary' />}
                    />
                  ))
                }
              </RadioGroup>
            </FormControl>
          </Grid>

          {" "}
          {/*----- Names -----*/}
          <Grid item className={classes.itemContainer}>
            <FormLabel component='legend'>Integrantes</FormLabel>
            <div style={{ width: "100%", height: "0.5em" }} />
            <Grid container spacing={1}>
              {
                data['names'].value.map((name, index) =>
                  <Grid item container key={index}>
                    <TextField
                      variant='outlined'
                      name='names'
                      value={name}
                      onChange={changeName(index)}
                      error={clickedGenerate && data['names'].value.length===0}
                      fullWidth
                      InputProps={{
                        endAdornment:
                          <InputAdornment position='end'>
                            {/*----- The last name has plus button, the others has minus buttons -----*/}
                            {
                              (index === data['names'].value.length - 1 ?
                                <IconButton aria-label='add name' onClick={addName}>
                                  <AddIcon fontSize='small' />
                                </IconButton>
                                :
                                <IconButton aria-label='remove name' onClick={removeName(index)}>
                                  <RemoveIcon fontSize='small' />
                                </IconButton>)
                            }
                          </InputAdornment>
                      }}
                    />
                  </Grid>
                )
              }
            </Grid>
          </Grid>

          {" "}
          {/*----- User interactions -----*/}
          <Grid item> {/*----- Button -----*/}
            <Button variant='contained' color='primary' onClick={() => generateCover()}>
              Generar Caratula
            </Button>
          </Grid>
          <Grid item> {/*----- Link -----*/}
            {
              !isFetchingCover ?
                <IconButton href={url} target='_blank' disabled={!url} color='primary'>
                  <PictureAsPdfIcon />
                </IconButton>
                :
                <CircularProgress />
            }
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
