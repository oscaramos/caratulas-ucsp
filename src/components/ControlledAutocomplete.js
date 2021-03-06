// taken from https://stackoverflow.com/a/63853097/13187269
import React from "react";
import { Controller } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function ControlledAutocomplete({
  options = [],
  renderInput,
  onChange: ignored,
  control,
  defaultValue,
  name,
  renderOption,
  rules,
  ...moreProps
}) {
  return (
    <Controller
      render={({ onChange, value, ...props }) => (
        <Autocomplete
          options={options}
          renderOption={renderOption}
          renderInput={renderInput}
          inputValue={value ?? ""}
          onInputChange={(e, data) => {
            onChange(data);
          }}
          {...props}
          {...moreProps}
        />
      )}
      onChange={([, data]) => data}
      defaultValue={defaultValue}
      name={name}
      control={control}
      rules={rules}
    />
  );
}
