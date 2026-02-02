import { render, screen } from "@testing-library/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";

function FormWithField() {
  const form = useForm({
    defaultValues: { email: "" },
  });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe("Form (ui)", () => {
  it("renders form field with label and input", () => {
    render(<FormWithField />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("useFormField uses itemContext when inside FormField without FormItem", () => {
    function FormFieldOnlyLabel() {
      const form = useForm({ defaultValues: { email: "" } });
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="email"
            render={() => <FormLabel>EmailOnly</FormLabel>}
          />
        </Form>
      );
    }
    render(<FormFieldOnlyLabel />);
    expect(screen.getByText("EmailOnly")).toBeInTheDocument();
  });

  it("useFormField returns empty ids when used outside FormField", () => {
    function FormItemOnly() {
      const form = useForm({ defaultValues: {} });
      return (
        <Form {...form}>
          <FormItem>
            <FormLabel>NoField</FormLabel>
            <FormControl>
              <input />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Form>
      );
    }
    render(<FormItemOnly />);
    expect(screen.getByText("NoField")).toBeInTheDocument();
  });

  it("FormMessage shows error when field has error", async () => {
    function FormWithError() {
      const form = useForm({
        defaultValues: { email: "" },
        values: { email: "" },
      });
      React.useEffect(() => {
        form.setError("email", { message: "Invalid email" });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- set error once on mount
      }, []);
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      );
    }
    render(<FormWithError />);
    await screen.findByText("Invalid email");
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
