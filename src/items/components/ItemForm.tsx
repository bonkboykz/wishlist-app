import { Form, FormProps } from "src/core/components/Form";
import { LabeledTextField } from "src/core/components/LabeledTextField";
import { LabeledTextAreaField } from "src/core/components/LabeledTextAreaField";
import { z } from "zod";
export { FORM_ERROR } from "src/core/components/Form";

export function ItemForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="title"
        label="Title"
        placeholder="Title"
        className="w-full lg:max-w-md"
      />

      <LabeledTextAreaField
        name="description"
        label="Description"
        placeholder="Description"
        className="w-full lg:max-w-md"
      />
    </Form>
  );
}
