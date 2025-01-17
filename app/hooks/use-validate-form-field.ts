import React from "react";
import type { UseRemixFormReturn } from "remix-hook-form";
import { useFormState } from "react-hook-form";

export const useValidateFormField = (form: UseRemixFormReturn) => {
    const { control, getValues, resetField, setValue, trigger } = form; // this line should not break the app
    const { dirtyFields } = useFormState({ control })

    console.log("Default values:", getValues())
    console.log("Dirty fields:", dirtyFields)

    const testFormHook = (
        field: string,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        // if passed value is 123, reset field to start clean
        if (event.target.value === "123") {
            resetField(field, { defaultValue: undefined });
            console.log("Resettted the field")
            return;
        }

        // if values are different, set value and touch the field
        setValue(field, event.target.value, {
            shouldTouch: true,
            shouldDirty: true,
        });

        trigger(field);
    };

    return { testFormHook };
}