import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type Request = {
  email?: string;
  pin?: number;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [otp, setRequestData] = React.useState<Request | null>();

  return (
    <div className={cn("grid gap-6 transition-all", className)} {...props}>
      {otp ? (
        <PinForm />
      ) : (
        <EmailForm setRequestData={setRequestData} request={otp} />
      )}
    </div>
  );
}

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "E-mail inválido",
  }),
});

type EmailFormProps = {
  request?: Request | null | undefined;
  setRequestData: React.Dispatch<
    React.SetStateAction<Request | null | undefined>
  >;
};

const EmailForm = ({ request, setRequestData }: EmailFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(body: z.infer<typeof FormSchema>) {
    setRequestData({
      ...request,
      email: body.email,
    });

    console.log(body);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="email"
                  placeholder="vitor@varsel.dev"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <p>Continuar</p>
          )}
        </Button>
      </form>
    </Form>
  );
};

const PinSchema = z.object({
  pin: z.string().min(6, {
    message: "Email must be at least 6 characters.",
  }),
});

const PinForm = () => {
  const [isAuthenticated, setAuthenticated] = React.useState<string>("idle");
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof PinSchema>>({
    resolver: zodResolver(PinSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(body: z.infer<typeof PinSchema>) {
    toast({
      title: "Autenticado com sucesso.",
    });

    setLoading(true);

    setTimeout(() => {
      setAuthenticated("fail");
      setLoading(false);
    }, 1000);
  }

  const returnColors = () => {
    switch (isAuthenticated) {
      case "idle":
        return "";
      case "fail":
        return "border-red-600";
      case "success":
        return "border-green-600";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem
              className={cn(
                "w-full flex flex-wrap justify-center",
                isAuthenticated == "fail" && " animate-shake"
              )}
            >
              <FormControl>
                <InputOTP disabled={loading} maxLength={10} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className={cn(
                        "border animate-in fade-in duration-75",
                        returnColors()
                      )}
                    />
                    <InputOTPSlot
                      index={1}
                      className={cn(
                        "border animate-in fade-in duration-100",
                        returnColors()
                      )}
                    />
                    <InputOTPSlot
                      index={2}
                      className={cn(
                        "border animate-in fade-in duration-200",
                        returnColors()
                      )}
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className={cn(
                        "border animate-in fade-in duration-300",
                        returnColors()
                      )}
                    />
                    <InputOTPSlot
                      index={4}
                      className={cn(
                        "border animate-in fade-in duration-500",
                        returnColors()
                      )}
                    />
                    <InputOTPSlot
                      index={5}
                      className={cn(
                        "border animate-in fade-in duration-700",
                        returnColors()
                      )}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Digite o one-time password que foi enviado ao seu e-mail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <p>Continuar</p>
          )}
        </Button>
      </form>
    </Form>
  );
};
