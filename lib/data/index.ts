import { DocumentData } from "firebase/firestore";

export type BaseDocument = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} & DocumentData;
