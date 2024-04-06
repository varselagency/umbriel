import { Triangle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { UserAuthForm } from "./components/user-auth-form";

export default function SignIn() {
  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        to="#"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Suporte
      </Link>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex gap-2 items-center text-lg font-medium">
          <Triangle className="size-5 fill-foreground" />
          Varsel Agency
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Seja referência de qualidade. Algumas pessoas não estão
              acostumadas com um ambiente onde a excelência é esperada.&rdquo;
            </p>
            <footer className="text-sm">Steve Jobs</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-3 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Seja bem-vindo(a)
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os campos abaixo para continuar
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao continuar você concocorda com as nossas politicas de{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacidade & Segurança
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
