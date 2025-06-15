import { useState } from "react";
import type { ChangeEvent } from "react";
import type { Todo } from "@/types/todo";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import DroppableColumn from "./DropableColumn";
import { DraggableTodo } from "./DraggableTodo";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showModal, setShowModal] = useState(false);

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const newItem: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      status: "todo",
      isEditing: false,
    };
    setShowModal(false);
    setTodos([...todos, newItem]);
    setNewTodo("");
  };

  const openModel = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleSave = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
      )
    );
  };

  const handleInputChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: value } : todo))
    );
  };
  const toggleStatus = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "todo" ? "done" : "todo" }
          : todo
      )
    );
  };

  //dnd
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const destination = over.id; // "todo" or "done"

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === activeId
          ? { ...todo, status: destination as "todo" | "done" }
          : todo
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* To Do Column */}
        <DroppableColumn id="todo">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-[#1e1e1e]">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">To Do</h2>
              <div className="mb-4 col-span-2">
                {showModal ? (
                  <>
                    <div className="fixed inset-0 bg-white/50 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 ">
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8 relative  dark:bg-[#1e1e1e]">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-50">
                          Add New Task
                        </h2>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-50">
                            Task Title
                          </label>
                          <input
                            type="text"
                            placeholder="Add a new ToDo"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setNewTodo(e.target.value)}
                          />
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            onClick={closeModal}
                            className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addTodo}
                            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                          >
                            Save
                          </button>
                        </div>

                        <button
                          onClick={closeModal}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={openModel}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Add todos
                  </button>
                )}
              </div>
            </div>
            <ul className="space-y-3">
              {todos
                .filter((todo) => todo.status === "todo")
                .map((todo) => (
                  <DraggableTodo key={todo.id} id={todo.id}>
                    <li
                      key={todo.id}
                      className="p-4 bg-gray-50 rounded-xl border flex justify-between dark:bg-[#2a2a2a]"
                    >
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
                        <>
                          <div className="flex justify-between w-full ">
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
                        </>
                      )}
                    </li>
                  </DraggableTodo>
                ))}
            </ul>
          </div>
        </DroppableColumn>

        {/* Done Column */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-[#1e1e1e]">
          <DroppableColumn id="done">
            <h2 className="text-xl font-semibold mb-4">Done</h2>
            <ul className="space-y-3">
              {todos
                .filter((todo) => todo.status === "done")
                .map((todo) => (
                  <DraggableTodo key={todo.id} id={todo.id}>
                    <li
                      key={todo.id}
                      className="p-4 bg-gray-50 rounded-xl border flex justify-between dark:bg-[#2a2a2a] "
                    >
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
                      </button>{" "}
                    </li>
                  </DraggableTodo>
                ))}
            </ul>
          </DroppableColumn>
        </div>
      </DndContext>
    </div>
  );
};

export default TodoList;
