"use client";

import { useToast } from "@/hooks/useToast";
import React, { HTMLAttributes, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createItemAction } from "../_actions/createItem.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/Alert";
import { Terminal } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const CreateItemForm = () => {
  const { toast } = useToast();
  const [formState, onCreateAction] = useFormState(createItemAction, {
    state: "default",
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.state === "success") {
      toast({
        title: "Item Added",
        description: "Your Item has been added",
      });
      if (formRef.current) formRef.current.reset();
    }
  }, [formState.state, toast]);

  return (
    <div>
      <h2 className="text-2xl text-center font-medium  mb-8 capitalize">
        Create Item
      </h2>

      <form
        ref={formRef}
        action={onCreateAction}
        className="flex flex-col gap-4"
      >
        <Label htmlFor="item-name">Item Name</Label>
        <Input
          data-testid="item-name"
          name="name"
          id="item-name"
          autoFocus
          hasError={formState.state === "error"}
          type="text"
        />
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          data-testid="quantity"
          name="quantity"
          type="number"
          id="quantity"
          autoFocus
        ></Input>

        {formState.state === "error" && <Error error={formState.error} />}

        <SubmitButton idleText="Add Item" submittingText="Adding Item..." />
      </form>
    </div>
  );
};

function Error({ error }: { error?: string }) {
  return error ? <span className="text-red-400 text-sm">{error}</span> : null;
}

function SubmitButton({
  idleText,
  submittingText,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  idleText: string;
  submittingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      className={cn(
        "disabled:bg-gray-400 disabled:cursor-default",
        props.className
      )}
      disabled={pending}
    >
      {pending ? submittingText : idleText}
    </Button>
  );
}

export default CreateItemForm;
