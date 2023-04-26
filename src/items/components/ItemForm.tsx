import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { Form, FormProps } from "src/core/components/Form";
import { LabeledTextField } from "src/core/components/LabeledTextField";
import { LabeledTextAreaField } from "src/core/components/LabeledTextAreaField";
import { z } from "zod";
import { useController, useForm, useFormContext } from "react-hook-form";
import { Fragment, useState } from "react";
export { FORM_ERROR } from "src/core/components/Form";

const CURRENCIES = ["KZT", "RUB", "USD", "EUR"];

const CurrencySelector = () => {
  const {
    field: { onChange, value },
  } = useController({
    name: "currency",
    defaultValue: "KZT",
  });

  const [query, setQuery] = useState("");

  const filteredCurrency =
    query === ""
      ? CURRENCIES
      : CURRENCIES.filter((currency) => {
          return currency.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="w-full lg:w-72">
      <Combobox
        value={value}
        onChange={(selectedValue) => {
          onChange(selectedValue);
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              defaultValue=""
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredCurrency.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredCurrency.map((currency) => (
                  <Combobox.Option
                    key={currency}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={currency}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {currency}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

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

      <LabeledTextField name="bought" label="Bought?" type="checkbox" />

      <LabeledTextField name="price" label="Price" type="number" />

      <div>
        <CurrencySelector />
      </div>
    </Form>
  );
}
