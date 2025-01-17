import { Welcome } from "../welcome/welcome";
import { useRemixForm, getValidatedFormData, RemixFormProvider } from "remix-hook-form";
import { Form } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import type { ActionFunctionArgs } from "react-router";
import { Link } from "react-router";
import { useValidateFormField } from "~/hooks/use-validate-form-field";

const schema = zod.object({
  intent: zod.literal("post"),
  field1: zod.string().min(1),
  field2: zod.string().min(1),
});

type FormData = zod.infer<typeof schema>;

const resolver = zodResolver(schema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<FormData>(request.clone(), resolver);

  if (errors) {
    return { errors, defaultValues };
  }

  console.log("Route action completed successfully with hono-posted data:", data)

  return { data };
};

export default function Home() {
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  const { register, handleSubmit, formState: { errors } } = form

  // @ts-ignore: typing in the hook are correct but mismatch here because we are using the RemixFormProvider
  const { testFormHook } = useValidateFormField(form)

  return (
    <>
      <Welcome />

      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[500px] w-full space-y-6 px-4 border border-gray-300 p-5 mb-5">
          <ul className="list-disc"><span className="font-medium">This reference repo uses:</span>
          <li className="ml-5"><Link className="text-blue-700 hover:underline" to="https://github.com/remix-run/react-router">React Router 7</Link> with React 19</li>
            <li className="ml-5"><Link className="text-blue-700 hover:underline" to="https://github.com/rphlmr/react-router-hono-server">react-router-hono-server</Link></li>
            <li className="ml-5"><Link className="text-blue-700 hover:underline" to="https://github.com/forge42dev/remix-hook-form">remix-hook-form</Link></li>
          </ul>

        </div>

        <div className="max-w-[500px] w-full space-y-6 px-4 border border-gray-300 p-5 mb-5">
          <ul className="list-decimal"><span className="font-medium">This remix-hook-form:</span>
            <li className="ml-5">Should successfully complete the route action using hono-posted data.</li>
            <li className="ml-5">Field 1 should use the useValidateFormField hook for custom onChange validation. Dirty and touched should be reset if value is 123.</li>
          </ul>

          <RemixFormProvider {...form}>
            <Form onSubmit={handleSubmit} method="POST">
              <input type="hidden" {...register("intent")} value="post" />

              {/* FIELD 1 */}
              <div>
                <label>
                  Field 1
                  <input {...register("field1")} onChange={(e) => testFormHook("field1", e)} className="ml-2 mb-3 border border-neutral-500" />
                </label>
                {errors.field1 && <p>{errors.field1.message}</p>}
              </div>

              {/* FIELD 2 */}
              <div>
              <label>
              Field 2                
                <input {...register("field2")} className="ml-2 mb-3 border border-neutral-500"/>
                </label>
                {errors.field2 && <p>{errors.field2.message}</p>}
              </div>

              <button className="bg-zinc-200 hover:bg-zinc-300 px-4 py-2 border border-zinc-300" type="submit">Submit</button>
            </Form>
          </RemixFormProvider>
        </div>
      </div>
    </>
  )
}
