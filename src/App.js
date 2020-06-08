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
  textContainer: {
    width: "80%"
  },
  radioContainer: {
    width: "80%"
  }
}));

const TextFieldView = ({ classes, data, handleTextInput, name }) =>
  <Grid item className={classes.textContainer}>
    <TextField
      variant='outlined'
      name={name}
      value={data[name].value}
      label={data[name].label}
      onChange={handleTextInput}
      fullWidth
    />
  </Grid>;

const RadiosView = ({ classes, data, field, handleRadioChange }) => (
  <Grid item className={classes.radioContainer}>
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
  </Grid>

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
          spacing={1}
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
          {Object.keys(data).map(field =>
            (
              <React.Fragment key={field}>
                {
                  data[field].radio ?
                    <RadiosView key={field} classes={classes} field={field} data={data} handleRadioChange={handleRadioChange} />
                    :
                    <TextFieldView key={field} classes={classes} name={field} data={data} handleTextInput={handleTextInput} />
                }
              </React.Fragment>
            )
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
