// taken from https://stackoverflow.com/a/63853097/13187269
import React, { ComponentProps } from "react";
import { Controller } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AutocompleteProps } from "@material-ui/lab/Autocomplete/Autocomplete";

export default function ControlledAutocomplete<T>({
  options,
  renderInput,
  control,
  defaultValue,
  name,
  rules,
  ...moreProps
}: {
  options: T[];
  renderInput: ComponentProps<typeof Autocomplete>["renderInput"];
  control: ComponentProps<typeof Controller>["control"];
  defaultValue: ComponentProps<typeof Controller>["defaultValue"];
  name: ComponentProps<typeof Controller>["name"];
  rules: ComponentProps<typeof Controller>["rules"];
} & AutocompleteProps<
  T,
  boolean | undefined,
  boolean | undefined,
  boolean | undefined
>) {
  return (
    <Controller
      render={({ onChange, value, ...props }) => (
        <Autocomplete
          options={options ?? []}
          renderInput={renderInput}
          onInputChange={(e, data) => {
            onChange(data);
          }}
          {...props}
          {...moreProps}
        />
      )}
      defaultValue={defaultValue}
      name={name}
      control={control}
      rules={rules}
    />
  );
}
