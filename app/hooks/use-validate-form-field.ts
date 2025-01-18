import React from "react";
import type { UseRemixFormReturn } from "remix-hook-form";
import { useFormState } from "react-hook-form";

export const useValidateFormField = (form: UseRemixFormReturn) => {
    const { control, resetField, setValue, trigger } = form; // this line should not break the app
    const { defaultValues, touchedFields, dirtyFields } = useFormState({ control })

    console.log("Default values:", defaultValues)
    console.log("Touched fields:", touchedFields)
    console.log("Dirty fields:", dirtyFields)

    const validateFormField = (
        field: string,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!defaultValues) {
            return
        }

        // current value is identical to default value
        if (event.target.value === defaultValues[field]) {
            console.log("IDENTICAL VALUES => resetting field1")

            resetField(field, { defaultValue: undefined });

            return;
        }

        // current value is different than default value
        console.log("DIFFERENT VALUES => set value, touch and dirty")

        setValue(field, event.target.value, {
            shouldTouch: true,
            shouldDirty: true,
        });

        trigger(field);
    };

    return { validateFormField };
}