import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { fetchGenerateCover, sendMessageToBackend } from "./api";

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
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from "@material-ui/core/IconButton";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Rating from "@material-ui/lab/Rating";
import CircularProgress from "@material-ui/core/CircularProgress";

const debug = false;

const defaultData = {
  career: {
    value: debug ? "Ciencia de la Computación" : "Ciencia de la Computación",
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
    value: debug ? "Microprocessors" : "",
    label: "Curso"
  },
  work: {
    value: debug ? "Real final job" : "",
    label: "Nombre del trabajo"
  },
  semester: {
    value: debug ? "VIII Semester" : "",
    label: "Semestre",
    options: ["Semestre I", "Semestre II", "Semestre II", "Semestre IV", "Semestre V"
      , "Semestre VI", "Semestre VII", "Semestre VIII", "Semestre IX", "Semestre X"
      , "Semestre XI", "Semestre XII", ""]
  },
  year: {
    value: debug ? "2020-1" : "2020-1",
    label: "Año"
  },
  gender: {
    value: debug ? "M" : "M",
    radio: { "M": "Masculino", "F": "Femenino" },
    label: "Género"
  },
  names: {
    value: debug ? ["Oscar Daniel Ramos Ramirez"] : [""],
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

const TextFieldView = ({ ...otherprops }) =>
  <TextField
    variant='outlined'
    fullWidth
    {...otherprops}
  />;

const RadiosView = ({ data, field, handleRadioChange }) => (
  <FormControl component='fieldset' key={field}>
    <FormLabel component='legend'>{data[field].label}</FormLabel>
    <RadioGroup row aria-label={data[field].label} value={data[field].value} onChange={handleRadioChange}>
      {
        Object.keys(data[field].radio).map(key => (
          <FormControlLabel
            key={key}
            name={field}
            value={key}
            style={{ marginRight: "1.25em" }}
            control={<Radio color='primary' />}
            label={data[field].radio[key]}
          />
        ))
      }
    </RadioGroup>
  </FormControl>
)



function App() {
  const classes = useStyles();

  const [url, setUrl] = useState("Aquí aparecerá un link");
  const [data, setData] = useState(defaultData);

  const [isFetchingCover, setIsFetchingCover] = useState(false);
  const [clickedGenerate, setClickedGenerate] = useState(false);

  const [rank, setRank] = useState(0);
  const [isHiddenRank, setIsHiddenRank] = useState(true);

  const [commentary, setCommentary] = useState("");
  const [isHiddenCommentary, setIsHiddenCommentary] = useState(true);

  const [extraBottomText, setExtraBottomText] = useState("");


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

    const showRank = (milliseconds) => {
      setTimeout(() => {
        setIsHiddenRank(false);
      }, milliseconds);
    }

    setClickedGenerate(true);
    if(allFieldsAreFilled()) {
      showRank(3000);
      setIsFetchingCover(true);
      fetchGenerateCover(convertToDataApi(data))
        .then(pdfUrl => {
          setUrl(pdfUrl);
          setIsFetchingCover(false);
        })
        .catch(error => {
          alert("Error: Servidor posiblemente apagado\n" +
                "Solución: Esperar de 1 a 2 minutos y volver a generar una carátula");
          setIsFetchingCover(false);
        });
    }
  };

  const handleDataChange = (field, value) => {
    setData({ ...data, [field]: { ...data[field], value } });
  };

  const handleNamesInput = index => event => {
    const changeNameFromData = (value) => {
      const newValues = [...value];
      newValues[index] = event.target.value;
      return newValues;
    }

    setData({ ...data, names: { ...data.names, value: changeNameFromData(data.names.value) } });
  }

  const addName = () => {
    setData({ ...data, names: { ...data.names, value: [...data.names.value, ""] } })
  }

  const removeName = indexToRemove => () => {
    const removeNameFromData = value => value.filter((x, idx) => idx !== indexToRemove)

    setData({ ...data, names: { ...data.names, value: removeNameFromData(data.names.value) } })
  }

  const handleRank = (event, newRank) => {
    if(!newRank) return;
    setRank(newRank);
    setTimeout(() => {
      setIsHiddenRank(true);
      setIsHiddenCommentary(false);
    }, 3000)

    sendMessageToBackend(`Estrellas ${newRank}`);
  }

  const handleSendCommentary = () => {
    sendMessageToBackend(commentary);
    setIsHiddenCommentary(true);
    setExtraBottomText("¡Gracias por comentar!");
  }

  return (
    <Container maxWidth='xs' className={classes.root}>
      <Paper>
        <Grid container spacing={2} direction='column' alignItems='center'
              className={classes.form} component='form' noValidate autoComplete='off'>
          {" "}
          {/*----- User data input -----*/}
          <Grid item>
            <Typography variant='h5'>Carátulas UCSP</Typography>
          </Grid>
          <Grid item className={classes.itemContainer}> {/*----- Career -----*/}
            <Autocomplete
              options={data['career'].options}
              value={data['career'].value}
              onChange={(event, value) => handleDataChange('career', value)}
              renderInput={(params) =>
                <TextFieldView {...params} name='career' label={data['career'].label}
                               error={clickedGenerate && !data['career'].value}/>
              }
            />
          </Grid>
          <Grid item className={classes.itemContainer}> {/*----- Course -----*/}
            <TextFieldView name='course' value={data['course'].value} label={data['course'].label}
                           onChange={(event) => handleDataChange('course', event.target.value)}
                           error={clickedGenerate && !data['course'].value}/>
          </Grid>
          <Grid item className={classes.itemContainer}> {/*----- Work -----*/}
            <TextFieldView name='work' value={data['work'].value} label={data['work'].label}
                           onChange={(event) => handleDataChange('work', event.target.value)}
                           error={clickedGenerate && !data['work'].value} />
          </Grid>
          <Grid item className={classes.itemContainer}> {/*----- Semester and Year -----*/}
            <Grid container spacing={1} direction='row'>
              <Grid item className={classes.semesterInput}>
                <Autocomplete
                  options={data['semester'].options}
                  value={data['semester'].value}
                  onChange={(event, value) => handleDataChange('semester', value)}
                  renderInput={(params) =>
                    <TextFieldView {...params} name='semester' label={data['semester'].label}
                                   error={clickedGenerate && !data['semester'].value}/>
                  }
                />
              </Grid>
              <Grid item className={classes.yearInput}>
                <TextFieldView key='year' name='year' value={data['year'].value} label={data['year'].label}
                               onChange={(event) => handleDataChange('year', event.target.value)}
                               error={clickedGenerate && !data['year'].value}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.itemContainer}> {/*----- Gender -----*/}
            <RadiosView classes={classes} field='gender' label={data['gender'].label}
                        data={data} handleRadioChange={(event) => handleDataChange('gender', event.target.value)} />
          </Grid>

          <Grid item className={classes.itemContainer}> {/*----- Names -----*/}
            <FormLabel component='legend'>Integrantes</FormLabel>
            <div style={{ width: "100%", height: "0.5em" }} />
            <Grid container spacing={1}>
              {
                data['names'].value.map((name, idx) =>
                  <React.Fragment key={idx}>
                    <Grid item sm={10} key={idx+"1"}>
                      <TextFieldView name='names' value={name}
                                     onChange={handleNamesInput(idx)}
                                     error={clickedGenerate && !data['names'].value}/>
                    </Grid>
                    <Grid item sm={2} key={idx+"2"} style={{ textAlign: "left" }}>
                      {
                        (idx === data['names'].value.length - 1 ?
                          <IconButton aria-label='add name' onClick={addName}>
                            <AddIcon fontSize='small' />
                          </IconButton>
                          :
                          <IconButton aria-label='remove name' onClick={removeName(idx)}>
                            <RemoveIcon fontSize='small' />
                          </IconButton>)
                      }
                    </Grid>
                  </React.Fragment>
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
              !isFetchingCover?
              <a href={url}>{url}</a>
                :
              <CircularProgress />
            }
          </Grid>
          {" "}
          {/*-----Ranking-----*/}
          {!isHiddenRank?
            <Grid item>
              <Rating name='pristine' value={rank} onChange={handleRank} />
            </Grid>
            :
            <React.Fragment />
          }
          {/*-----Commentary-----*/}
          {
            !isHiddenCommentary?
              <React.Fragment>
                <Grid item>
                  <TextField value={commentary} label="¿Algún comentario?" onChange={(event) => setCommentary(event.target.value)} />
                </Grid>
                <Grid item>
                  <Button variant='contained' color='secondary' onClick={handleSendCommentary}>
                    Enviar
                  </Button>
                </Grid>
              </React.Fragment>
              :
              <React.Fragment />
          }
          {/*-----Extra Bottom Text-----*/}
          {
            extraBottomText?
              <Grid item>
                {extraBottomText}
              </Grid>
              :
              <React.Fragment />
          }
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
