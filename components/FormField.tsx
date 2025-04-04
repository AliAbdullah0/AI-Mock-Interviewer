import React from 'react'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, Controller, FieldValues, Path, ControllerRenderProps, ControllerFieldState, UseFormStateReturn } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'file';
}

const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text'
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
        formState
      }: {
        field: ControllerRenderProps<T, any>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<T>;
      }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormField;
