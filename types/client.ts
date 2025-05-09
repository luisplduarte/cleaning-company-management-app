import { z } from "zod";
import { createClientSchema } from "@/lib/validations/client";

export type ClientResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  town: string;
  zipCode: string;
};

export type ClientFormData = z.infer<typeof createClientSchema>;

export type ClientTableItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  town: string;
  zipCode: string;
};
