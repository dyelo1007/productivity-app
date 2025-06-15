export type Todo = {
  id: number;
  text: string;
  status: "todo" | "done";
  isEditing: boolean;
};
