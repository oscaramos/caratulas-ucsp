import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import {
  Grid,
  IconButton,
  TextField,
  Collapse,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Button from "@material-ui/core/Button";

import ControlledAutocomplete from "../ControlledAutocomplete";
import courses from "../courses.json";

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
  return courses[career] ?? [];
};

const useStyles = makeStyles((theme) => ({
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemContainer: {
    width: "100%",
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

export default function CoverForm({ onSubmit }) {
  const classes = useStyles();

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

  const onClickGenerate = () => {
    const values = getValues();
    const data = {
      ...values,
      names: values.members.map((obj) => obj.name),
      course: values.course.name,
    };
    onSubmit(data);
  };

  return (
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
      </Grid>
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
      </Grid>
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
      </Grid>
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
      </Grid>
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
      </Grid>
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
                        onClickGenerate();
                      } else if (keyEvent.key === "Enter") {
                        append({ name: "" });
                      }
                    }}
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
      </Grid>
      <Grid item style={{ marginTop: "2em" }}>
        <Button variant="contained" color="primary" onClick={onClickGenerate}>
          Generar Carátula
        </Button>
      </Grid>
    </Grid>
  );
}
