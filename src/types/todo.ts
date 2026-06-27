export type Todo = {
  id: string;
  text: string;
  status: "todo" | "done";
  isEditing: boolean;
};
