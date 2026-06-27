import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { Todo } from "@/types/todo";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import DroppableColumn from "./DropableColumn";
import { DraggableTodo } from "./DraggableTodo";
import AddEditModal from "./AddEditModal";

const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  } catch {
    localStorage.removeItem("todos");
    return [];
  }
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newItem: Todo = {
      id: crypto.randomUUID(),
      text,
      status: "todo",
      isEditing: false,
    };
    setTodos([...todos, newItem]);
  };

  const handleEdit = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleSave = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
      )
    );
  };

  const handleInputChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: value } : todo))
    );
  };

  const toggleStatus = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "todo" ? "done" : "todo" }
          : todo
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const destination = over.id;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === activeId
          ? { ...todo, status: destination as "todo" | "done" }
          : todo
      )
    );
  };

  return (
    <div className="w-full max-w-full 2xl:w-screen  ">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-10">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* To Do Column */}
          <DroppableColumn id="todo">
            <div className="w-full bg-white border  border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-card">
              <div className="flex justify-between ">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  To Do
                </h2>
                <div className="mb-4 col-span-2">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Add todos
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
                {todos
                  .filter((todo) => todo.status === "todo")
                  .map((todo) => (
                    <DraggableTodo key={todo.id} id={todo.id}>
                      <li className="p-4 bg-gray-50 rounded-xl border flex justify-between dark:bg-muted">
                        {todo.isEditing ? (
                          <>
                            <input
                              className="border p-2 flex-1"
                              type="text"
                              onChange={(e) => handleInputChange(todo.id, e)}
                              value={todo.text}
                            />
                            <button
                              className="bg-blue-500 text-white px-4 ml-2"
                              onClick={() => handleSave(todo.id, todo.text)}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <div className="flex justify-between w-full">
                            <div>
                              <span>{todo.text}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="text-blue-500"
                                onClick={() => handleEdit(todo.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-green-500 hover:underline"
                                onClick={() => toggleStatus(todo.id)}
                              >
                                Mark Done
                              </button>
                              <button
                                className="text-red-500 hover:underline"
                                onClick={() => handleDelete(todo.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    </DraggableTodo>
                  ))}
              </ul>
            </div>
          </DroppableColumn>

          {/* Done Column */}
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-card">
            <DroppableColumn id="done">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Done
              </h2>
              <ul className="space-y-3">
                {todos
                  .filter((todo) => todo.status === "done")
                  .map((todo) => (
                    <DraggableTodo key={todo.id} id={todo.id}>
                      <li className="p-4 bg-gray-50 rounded-xl border flex justify-between dark:bg-muted">
                        <span className="line-through text-gray-400">
                          {todo.text}
                        </span>
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => toggleStatus(todo.id)}
                        >
                          Mark Todo
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDelete(todo.id)}
                        >
                          Delete
                        </button>
                      </li>
                    </DraggableTodo>
                  ))}
              </ul>
            </DroppableColumn>
          </div>
        </DndContext>
      </div>
      <AddEditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={(text) => {
          addTodo(text);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default TodoList;
