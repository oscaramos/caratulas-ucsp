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
  semester: {
    value: debug ? "VIII Semester" : "",
    label: "Semestre"
  },
  year: {
    value: debug ? "1999" : "",
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
    width: "80%",
  }
}));

const TextFieldView = ({ classes, data, handleTextInput, name, additionalGridClassName, additionalTextClassname }) =>
  <TextField
    className={additionalTextClassname}
    variant='outlined'
    name={name}
    value={data[name].value}
    label={data[name].label}
    onChange={handleTextInput}
    fullWidth
  />;

const RadiosView = ({ classes, data, field, handleRadioChange }) => (
  <FormControl component='fieldset' key={field}>
    <FormLabel component='legend'>{data[field].label}</FormLabel>
    <RadioGroup row aria-label={data[field].label} value={data[field].value} onChange={handleRadioChange}>
      {
        Object.keys(data[field].radio).map(key => (
          <FormControlLabel
            key={key}
            name={field}
            value={key}
            control={
              <Radio color='primary' />
            }
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

  const handleTextInput = event => {
    const field = event.target.name;
    const value = event.target.value;
    setData({ ...data, [field]: { ...data[field], value } });
  };

  const handleRadioChange = event => {
    const field = event.target.name;
    const value = event.target.value;
    setData({ ...data, [field]: { ...data[field], value } })
  };

  return (
    <Container maxWidth='xs' className={classes.root}>
      <Paper>
        <Grid
          container
          spacing={2}
          direction='column'
          alignItems='center'
          className={classes.form}
          component='form'
          noValidate
          autoComplete='off'
        >
          <Grid item>
            <Typography variant='h5'>Carátulas UCSP</Typography>
          </Grid>
          {Object.keys(data).map(field => {
              if (field === 'names') {
                return (
                  <Grid item className={classes.itemContainer}>
                    <TextFieldView classes={classes} additionalTextClassname={classes.nameInput}
                                   key={field} name={field} data={data} handleTextInput={handleTextInput} />
                    <IconButton aria-label='add name' style={{paddingTop: "0.6em"}}>
                       <AddIcon />
                    </IconButton>
                  </Grid>
                )
              } else if (field === 'semester') {
                return (
                  <Grid item className={classes.itemContainer}>
                    <Grid container spacing={1} direction='row'>
                      <Grid item className={[classes.itemContainer, classes.shortInput]}>
                        <TextFieldView classes={classes} key='semester' name='semester' data={data}
                                       handleTextInput={handleTextInput} />
                      </Grid>
                      <Grid item className={[classes.itemContainer, classes.shortInput]}>
                        <TextFieldView classes={classes} key='year' name='year' data={data}
                                       handleTextInput={handleTextInput} />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              } else if (field === 'year') {
                return <React.Fragment />
              } else if (data[field].radio) {
                return (
                  <Grid item className={classes.itemContainer}>
                    <RadiosView classes={classes} key={field} field={field} data={data}
                                handleRadioChange={handleRadioChange} />
                  </Grid>
                )
              } else {
                return (
                  <Grid item className={classes.itemContainer}>
                    <TextFieldView classes={classes} key={field} name={field} data={data}
                                   handleTextInput={handleTextInput} />
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
