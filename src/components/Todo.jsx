import {useState, useEffect} from "react"

function Todo() {

    const [darkMode, setDarkMode] = useState(() => {

        const savedTheme = localStorage.getItem("theme")

        return savedTheme === "true"

    })
    const [input, setInput] = useState("")
    // used when backend not used
    // const [todos, setTodos] = useState(() => {
    //     const savedTodos = localStorage.getItem("todos")
    //     return savedTodos ? JSON.parse(savedTodos) : []
    // })
    const [todos, setTodos] = useState([])
    const [editId, setEditId] = useState(null)
    const [editInput, setEditInput] = useState("")
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")
    const [toast, setToast] = useState("")
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState("")

    const remainingTasks = todos.filter((todo) => !todo.completed).length

    useEffect(() => {
        localStorage.setItem("theme", darkMode)
    }, [darkMode])

    // used when backend not used
    // useEffect(() => {
    //     localStorage.setItem("todos", JSON.stringify(todos))
    // }, [todos])

    // useEffect(() => {
    //     fetch("${import.meta.env.VITE_API_URL}/todos")
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setTodos(data)
    //         })
    // }, [])

    async function fetchTodos() {

        try {

            setLoading(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/todos`
            )

            const data = await response.json()

            setTodos(data)

            setError("")

        } catch (error) {

            setError("Failed to fetch todos ❌")

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        async function fetchTodos() {

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/todos`
                )

                const data = await response.json()

                setTodos(data)
                setError("")

            } catch (e) {

                setError("Failed to fetch todos ❌")

            } finally {

                setLoading(false)

            }
        }

        fetchTodos()

    }, [])

    function toggleTheme() {
        setDarkMode(!darkMode)
    }

    function showToast(message) {

        setToast(message)

        setTimeout(() => {
            setToast("")
        }, 2000)
    }

    // function handleAddTodo() {
    //     if (input.trim() === "") return
    //     const newTodo = {
    //         id: Date.now(),
    //         text: input,
    //         completed: false
    //     }
    //     setTodos([...todos, newTodo])
    //     setInput("")
    //     showToast("✅ Todo Added")
    // }

    async function handleAddTodo() {

        try {
            if (input.trim() === "") return
            setActionLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: input
                })
            })
            const newTodo = await response.json()
            setTodos([...todos, newTodo])
            setInput("")
            showToast("✅ Todo Added")
        } catch (error) {
            console.log(error)
        } finally {
            setActionLoading(false)
        }

    }

    // function handleDeleteTodo(id) {
    //     const updatedTodos = todos.filter((todo) => todo._id !== id)
    //     setTodos(updatedTodos)
    //     showToast("🗑️ Todo Deleted")
    // }

    async function handleDeleteTodo(id) {
        await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
            method: "DELETE"
        })

        const updatedTodos = todos.filter(
            (todo) => todo._id !== id
        )

        setTodos(updatedTodos)

        showToast("🗑️ Todo Deleted")
    }

    // function handleToggleComplete(id) {
    //     const updatedTodos = todos.map((todo) => {
    //         if (todo._id === id) {
    //             return {
    //                 ...todo,
    //                 completed: !todo.completed
    //             }
    //         }
    //         return todo
    //     })
    //     setTodos(updatedTodos)
    //     showToast("🎉 Todo Status Updated")
    // }

    async function handleToggleComplete(id) {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/todos/${id}`,
            {
                method: "PATCH"
            }
        )
        const updatedTodo = await response.json()

        const updatedTodos = todos.map((todo) => {

            if (todo._id === id) {
                return updatedTodo
            }

            return todo
        })

        setTodos(updatedTodos)

        showToast("🎉 Todo Updated")
    }

    function handleEditTodo(todo) {
        setEditId(todo._id)
        setEditInput(todo.text)
    }

    function handleSaveEdit(id) {
        const updatedTodos = todos.map((todo) => {
            if (todo._id === id) {
                return {
                    ...todo,
                    text: editInput
                }
            }
            return todo
        })
        setTodos(updatedTodos)
        setEditId(null)
        setEditInput("")
        showToast("✏️ Todo Updated")
    }

    const filteredTodos = todos.filter((todo) => {

        const matchesSearch = todo.text
            .toLowerCase()
            .includes(search.toLowerCase())

        if (filter === "completed") {
            return todo.completed
        }
        if (filter === "pending") {
            return !todo.completed
        }
        return matchesSearch
    })

    return (
        <div className={`min-h-screen flex flex-col items-center pt-20 px-5 tracking-tight duration-200 ${darkMode
            ? "bg-[#0f172a] text-white"
            : "bg-gray-100 text-black"
        }`
        }
        >
            {
                toast && (

                    <div
                        className="
                fixed
                top-5
                right-5
                bg-green-500
                text-white
                px-6
                py-3
                rounded-xl
                shadow-2xl
                animate-bounce
                z-50
            "
                    >
                        {toast}
                    </div>

                )
            }

            {
                error && (

                    <div
                        className="
                bg-red-500
                text-white
                px-6
                py-4
                rounded-xl
                mb-8
                shadow-xl
            "
                    >
                        {error}
                    </div>

                )
            }

            <h1 className={`text-3xl md:text-5xl font-bold mb-10`}>
                Todo App ✅
            </h1>

            <button
                onClick={toggleTheme}
                className="
        mb-10
        px-6
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300
        hover:scale-105
        bg-purple-600
    "
            >
                {
                    darkMode
                        ? "☀️ Light Mode"
                        : "🌙 Dark Mode"
                }
            </button>

            {/* Input Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 w-full items-center justify-center">

                <input
                    type="text"
                    placeholder="Enter your todo..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={actionLoading}
                    className={`
                        px-4
                        py-3
                        rounded-xl
                        w-full
                        md:w-80
                        outline-none
                        ${darkMode ? "bg-white text-black" : "bg-gray-200 text-black"}
                        focus:ring-4
                        focus:ring-green-400/40
                        transition-all`}
                />

                <button
                    onClick={handleAddTodo}
                    className="
                    bg-green-500
                    px-6 py-3
                    rounded-xl
                    font-semibold
                    hover:scale-105
                    transition-all
                    duration-300
                    hover:shadow-lg
                    hover:shadow-green-500/50
                    "
                >
                    {
                        actionLoading
                            ? "Adding..."
                            : "Add"
                    }
                </button>

            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">

                <button
                    onClick={() => setFilter("all")}
                    className={`
            px-5 
            py-2 
            rounded-xl 
            transition-all 
            duration-300
            ${filter === "all"
                        ? "bg-blue-500"
                        : "bg-gray-600"}
        `}
                >
                    All
                </button>

                <button
                    onClick={() => setFilter("completed")}
                    className={`
            px-5 
            py-2 
            rounded-xl 
            transition-all 
            duration-300
            ${filter === "completed"
                        ? "bg-green-500"
                        : "bg-gray-600"}
            `}
                >
                    Completed
                </button>

                <button
                    onClick={() => setFilter("pending")}
                    className={`px-5 py-2 rounded-xl transition-all duration-300 ${filter === "pending"
                        ? "bg-yellow-500"
                        : "bg-gray-600"}
                     `}
                >
                    Pending
                </button>

            </div>

            <div className="mb-10">
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`px-5 py-3 rounded-xl w-full md:w-80 outline-none ${darkMode ? "bg-white text-black" : "bg-gray-200 text-black"}`}
                />
            </div>

            <div className="mb-8">

                <p className="text-xl text-gray-300">
                    Tasks Remaining:
                    <span className="font-bold text-green-400 ml-2">
                         {remainingTasks}
                    </span>
                </p>

            </div>

            {
                loading && (

                    <div className="mt-10">

                        <p className="text-2xl font-semibold animate-pulse">
                            Loading todos... ⏳
                        </p>

                    </div>

                )
            }

            {/* Todo List */}
            <div className="w-full max-w-2xl space-y-4">

                {
                    !loading && filteredTodos.length > 0 ? (
                        filteredTodos.map((todo) => (
                            <div
                                key={todo._id}
                                className={`
                                    ${darkMode ? "bg-[#1e293b]" : "bg-white"}
                                    p-5 rounded-2xl
                                    flex flex-col
                                    md:flex-row
                                    gap-5
                                    justify-between
                                    md:items-center
                                    shadow-xl
                                    hover:scale-[1.02]
                                    hover:translate-y-1
                                    transition-all
                                    duration-300

                                    `}
                            >

                                {
                                    editId === todo._id ? (
                                        <input
                                            type="text"
                                            value={editInput}
                                            onChange={(e) => setEditInput(e.target.value)}
                                            className="px-3 py-2 rounded-lg text-black outline-none bg-blue-200"
                                        />
                                    ) : (
                                        <p
                                            className={`text-lg transition-all duration-300 ${todo.completed ? "line-through text-gray-400 scale-95" : ""}`}
                                        >
                                            {todo.text}
                                        </p>
                                    )
                                }

                                <div className="flex flex-wrap gap-3 justify-center">

                                    <button
                                        onClick={() => handleToggleComplete(todo._id)}
                                        className="bg-green-500 px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300"
                                    >
                                        {
                                            todo.completed
                                                ? "Completed"
                                                : "Complete"
                                        }
                                    </button>

                                    <button
                                        onClick={() => handleDeleteTodo(todo._id)}
                                        className="bg-red-500 px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300"
                                    >
                                        Delete
                                    </button>

                                    {
                                        editId === todo._id ? (

                                            <button
                                                onClick={() => handleSaveEdit(todo._id)}
                                                className=" bg-blue-500 px-4 py-2vrounded-lg hover:scale-105 transition-all duration-300"
                                            >
                                                Save
                                            </button>

                                        ) : (

                                            <button
                                                onClick={() => handleEditTodo(todo)}
                                                className=" bg-yellow-500 px-4 py-2 rounded-lg hover:scale-105 transition-all duration-3000"
                                            >
                                                Edit
                                            </button>

                                        )
                                    }

                                </div>

                            </div>
                        ))) : (
                        <div className="text-center mt-10">

                            <p className="text-2xl text-gray-400">
                                No todos found 😴
                            </p>

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default Todo