import { useEffect, useState } from "react";
import "./App.css";
import { Card, Col, Row, Modal } from "antd";
import axios from "axios";

function App() {
  const API = "https://679904c4be2191d708b1b454.mockapi.io/table/users/Todolist";
  const [data, setData] = useState([]);
  const [user, setUser] = useState({
    title: "",
    descraption: "",
    status: false,
  });
  const [editUserId, setEditUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(API);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeUser = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateField = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {
    try {
      if (editUserId) {
        await axios.put(`${API}/${editUserId}`, user);
        setEditUserId(null);
      } else {
        await axios.post(API, user);
      }
      setUser({ title: "", descraption: "", status: false });
      fetchData();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const editUser = (user) => {
    setUser({ title: user.title, descraption: user.descraption, status: user.status });
    setEditUserId(user.id);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditUserId(null);
    setUser({ title: "", descraption: "", status: false });
  };

  const changeStatus = async (id, currentStatus) => {
    try {
      await axios.put(`${API}/${id}`, { status: !currentStatus });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredData = data
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => {
      if (statusFilter === "all") return true;
      return item.status === (statusFilter === "true");
    })
    .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="filter-container" style={{ maxWidth: "550px", margin: "auto" }}>
        <input
          type="search"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
          <option value="all">All</option>
          <option value="true">DONE</option>
          <option value="false">NOT DONE</option>
        </select>

        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} style={{ width: "100%", marginBottom: "10px" }}>
          Sort by ID ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>

        <button onClick={openModal} style={{ width: "100%" }}>Add Task</button>
      </div>

      {filteredData.length === 0 ? (
        <h1 style={{ textAlign: "center", marginTop: "20px", color:"red", fontSize:"50px", fontFamily:"fantasy", letterSpacing:"30px", marginLeft:"5%" }}>NOT FOUND</h1>
      ) : (
        <div className="main" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "auto", gap: "10px" }}>
          {filteredData.map((e) => (
            <Card
              key={e.id}
              title={e.title}
              style={{ backgroundColor: "pink", height: "auto", width: "300px" }}
            >
              <p>{e.descraption}</p>
              <p>Status: {e.status ? "DONE" : "NOT DONE"}</p>
              <input
                type="checkbox"
                checked={e.status}
                onChange={() => changeStatus(e.id, e.status)}
              />
              <button className="add-button" onClick={() => removeUser(e.id)}>
                Delete
              </button>
              <button className="edit-button" onClick={() => editUser(e)}>
                Edit
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal title={editUserId ? "Edit Task" : "Add Task"} open={isModalOpen} onCancel={closeModal} onOk={saveUser}>
        <input
          type="text"
          name="title"
          value={user.title}
          onChange={updateField}
          placeholder="Enter title"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="text"
          name="descraption"
          value={user.descraption}
          onChange={updateField}
          placeholder="Enter description"
          style={{ width: "100%" }}
        />
      </Modal>
    </>
  );
}

export default App;
