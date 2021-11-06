import { debounce } from "lodash";
import React, { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { usePreviousDistinct } from "react-use";

import {
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";

import { careerOptions, courses, semesterOptions } from "./autocompleteOptions";
import ControlledAutocomplete from "./components/ControlledAutocomplete";
import { useStyles } from "./styles";

type CoverData = {
  work: string;
  career: typeof careerOptions[number] | "";
  course: string;
  semester: typeof semesterOptions[number] | "";
  year: string;
  gender: "male" | "female";
  members: { name: string }[];
};

export default function CoverForm({
  onSubmit,
}: {
  onSubmit: (data: CoverData) => void;
}) {
  const classes = useStyles();

  const { register, watch, errors, getValues, control, setValue } = useForm<
    Omit<CoverData, "names">
  >({
    mode: "onBlur",
    defaultValues: {
      work: "",
      career: "",
      course: "",
      semester: "",
      gender: "male",
      year: `${new Date().getFullYear()}-${new Date().getMonth() >= 7 ? 2 : 1}`,
      members: [{ name: "" }],
    },
  });

  const career = watch("career");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const onChange = useCallback(
    debounce(() => {
      if (Object.values(errors).length > 0) {
        return;
      }

      const values = getValues();

      onSubmit({
        ...values,
        members: values.members.filter((member) => member.name.length > 0),
      });
    }, 3000),
    []
  );

  const onCourseChangeByAutocomplete = () => {
    onChange();

    const career = getValues("career");
    const course = getValues("course");
    if (!career || !course) return;

    const semester = courses[career].find((item) => item.name === course)
      ?.semester;
    setValue("semester", semester);
  };

  const members = watch("members");
  const previousMembers = usePreviousDistinct(
    members,
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );

  useEffect(() => {
    if (members.length === 0) return;

    if (members[members.length - 1].name.length > 0) {
      append({ name: "" });
    }

    members.forEach((member, index) => {
      const wasModifiedToEmpty =
        previousMembers?.[index]?.name.length !== member.name.length &&
        member.name.length === 0;

      if (
        wasModifiedToEmpty &&
        (index > 1 || (index === 1 && members.length > 2))
      ) {
        remove(index);
        onChange();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(members),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(previousMembers),
    append,
    onChange,
    remove,
  ]);

  useEffect(() => {
    append({ name: "" });
    onChange();
  }, [append, onChange]);

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
          options={(careerOptions as unknown) as string[]}
          renderInput={(params) => (
            <TextField
              name="career"
              variant="outlined"
              label="Carrera"
              onChange={onChange}
              error={!!errors.career}
              helperText={errors?.career?.message}
              {...params}
            />
          )}
          onChange={onChange}
          rules={{ required: "Escriba una carrera" }}
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
          options={career !== "" ? courses[career] : []}
          groupBy={(option) => option.semester}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              name="course"
              variant="outlined"
              label="Curso"
              onChange={onChange}
              error={!!errors.course}
              helperText={errors?.course?.message}
              {...params}
            />
          )}
          onChange={onCourseChangeByAutocomplete}
          rules={{ required: "Escriba un curso" }}
          defaultValue={null}
          openOnFocus
          freeSolo
          ignoreControllerRenderValue
        />
      </Grid>
      {/*----- Work -----*/}
      <Grid item className={classes.itemContainer}>
        <TextField
          name="work"
          variant="outlined"
          label="Nombre del trabajo"
          onChange={onChange}
          error={!!errors.work}
          helperText={errors?.work?.message}
          inputRef={register({ required: "Escriba el nombre de su trabajo" })}
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
              options={(semesterOptions as unknown) as string[]}
              renderInput={(params) => (
                <TextField
                  name="semester"
                  variant="outlined"
                  label="Semestre"
                  onChange={onChange}
                  error={!!errors.semester}
                  helperText={errors?.semester?.message}
                  {...params}
                />
              )}
              onChange={onChange}
              rules={{ required: "Escriba el semestre del curso" }}
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
              onChange={onChange}
              error={!!errors.year}
              helperText={errors?.year?.message}
              inputRef={register({
                required: "Escriba el año y semestre del trabajo",
              })}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
      {/*----- Gender -----*/}
      <Grid item className={classes.itemContainer}>
        <Collapse in={fields.length <= 2}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Género</FormLabel>
            <Controller
              name="gender"
              control={control}
              as={
                <RadioGroup row aria-label="Género">
                  <FormControlLabel
                    name="gender"
                    key="M"
                    value="male"
                    label="Masculino"
                    style={{ marginRight: "1.25em" }}
                    control={<Radio color="primary" />}
                    onChange={onChange}
                  />
                  <FormControlLabel
                    name="gender"
                    key="F"
                    value="female"
                    label="Femenino"
                    style={{ marginRight: "1.25em" }}
                    control={<Radio color="primary" />}
                    onChange={onChange}
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
                    error={!!errors?.members?.[index]}
                    helperText={errors?.members?.[index]?.name?.message}
                    onKeyDown={() => {
                      onChange();
                    }}
                    fullWidth
                  />
                }
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
