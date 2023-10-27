import { type PropsWithChildren } from "react";
import { type NextPage } from "next";
import { type AppProps } from "next/app";

export type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    Layout: (props: PropsWithChildren) => JSX.Element;
  };
};

export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};
