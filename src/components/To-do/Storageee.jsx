import "./todo.css";


const createTodoItem = (todo) => {
    const newTodoItems = [...todoItems, { todo, complete: false }];
    setTodoItems(newTodoItems);
    };
    return (
    <div className="app">
    <TodoInput createTodoItem={createTodoItem} />
    {todoItems.map((item, index) => (
    <TodoItem key={index} index={index} item={item} />
    ))}
    </div>
    );

export default Tasks;