import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { fetchGenerateCover } from "./api";

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

const debug = false;

const defaultData = {
  career: {
    value: debug ? "Ciencias de la Computación" : "",
    label: "Carrera",
    options: [
      "Administración de Empresas",
      "Arquitectura y Urbanismo",
      "Ciencias de la Computación",
      "Ingenieria Mecatronica",
      "Ingenieria Civil",
      "Contabilidad",
      "Derecho",
      "Educación inicial y primaria",
      "Ingenieria Electronica y Telecomunicaciones",
      "Ingenieria Industrial",
      "Psicologia",
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
    label: "Semestre"
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
  shortInput: {
    width: "50%",
    display: "inline"
  },
  nameInput: {
    width: "85%",
  },
  iconContainer: {
    paddingTop: "0.65em"
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
    setData({...data, names: {...data.names, value: [...data.names.value, ""]}})
  }

  const removeName = indexToRemove => () => {
    const removeNameFromData = value => value.filter((x, idx) => idx !== indexToRemove)

    setData({...data, names: {...data.names, value: removeNameFromData(data.names.value) } })
  }


  return (
    <Container maxWidth='xs' className={classes.root}>
      <Paper>
        <Grid container spacing={2} direction='column' alignItems='center'
          className={classes.form} component='form' noValidate autoComplete='off'>
          <Grid item>
            <Typography variant='h5'>Carátulas UCSP</Typography>
          </Grid>
          {Object.keys(data).map((field) => {
              if(field === 'career') {
                return (
                <Grid item key={field} className={classes.itemContainer}>
                  <Autocomplete
                    options={data['career'].options}
                    value={data['career'].value}
                    onInputChange={(event, value) => handleDataChange('career', value)}
                    renderInput={(params) =>
                      <TextField {...params} label={data['career'].label} variant="outlined" />
                    }
                  />
                </Grid>
                )
              }
              else if (field === 'names') {
                return (
                  <Grid item key={field} className={classes.itemContainer}>
                    <FormLabel component='legend'>Integrantes</FormLabel>
                    {
                      data[field].value.map((name, idx) =>
                      <React.Fragment key={idx}>
                        <div style={{marginTop: "0.5em"}}/>
                        <TextFieldView className={classes.nameInput} key={field} name={field} value={name}
                                       onChange={handleNamesInput(idx)} />
                        {
                          (idx === data[field].value.length - 1 ?
                          <IconButton aria-label='add name' className={classes.iconContainer} onClick={addName}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                          :
                          <IconButton aria-label='remove name' className={classes.iconContainer} onClick={removeName(idx)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>)
                        }
                      </React.Fragment>
                      )
                    }
                  </Grid>
                )
              } else if (field === 'semester') {
                return (
                  <Grid item key={field} className={classes.itemContainer}>
                    <Grid container spacing={1} direction='row'>
                      <Grid item className={classes.shortInput}>
                        <TextFieldView key='semester' name='semester' value={data[field].value} label={data[field].label}
                                       onChange={(event) => handleDataChange('semester', event.target.value)} />
                      </Grid>
                      <Grid item className={classes.shortInput}>
                        <TextFieldView key='year' name='year' value={data['year'].value} label={data['year'].label}
                                       onChange={(event) => handleDataChange('year', event.target.value)} />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              } else if (field === 'year') {
                return <React.Fragment key={field}/>
              } else if (data[field].radio) {
                return (
                  <Grid item key={field} className={classes.itemContainer}>
                    <RadiosView classes={classes} key={field} field={field} label={data[field].label}
                                data={data} handleRadioChange={(event) => handleDataChange(field, event.target.value)} />
                  </Grid>
                )
              } else {
                return (
                  <Grid item key={field} className={classes.itemContainer}>
                    <TextFieldView key={field} name={field} value={data[field].value} label={data[field].label}
                                   onChange={(event) => handleDataChange(field, event.target.value)} />
                  </Grid>
                )
              }
            }
          )}
          <Grid item>
            <Button variant='contained' color='primary' onClick={() => generateCover()}>
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
