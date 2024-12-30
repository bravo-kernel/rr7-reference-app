import { Welcome } from "../welcome/welcome";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { Form } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import type { ActionFunctionArgs } from "react-router";

const schema = zod.object({
  name1: zod.string().min(1),
  name2: zod.string().min(1),
});

type FormData = zod.infer<typeof schema>;

const resolver = zodResolver(schema);

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Entered action")

  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return { errors, defaultValues };
  }

  console.log("Validated data:", data)

  // Do something with the data
  return { data };
};

export default function Home() {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  return(
    <>
      <Welcome />

      <Form onSubmit={handleSubmit} method="POST">
        <div>
          <label>
            Name 1:
            <input className="border border-neutral-500" type="text" {...register("name1")} />
            {errors.name1 && <p>{errors.name1.message}</p>}
          </label>
        </div>
      

        <div>
          <label>
            Name 2:
            <input className="border border-neutral-500" type="text" {...register("name2")} />
            {errors.name2 && <p>{errors.name2.message}</p>}
          </label>
        </div>
        
        <button type="submit">Submit</button>
    </Form>
  </>
  ) 
}
