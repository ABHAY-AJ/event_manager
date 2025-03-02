import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api/baseUrl";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "", tagline: "", schedule: "", description: "",
    moderator: "", category: "", sub_category: "", rigor_rank: "",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axios.post(`${baseUrl}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Event created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">Create Event</h2>
      <input type="text" name="name" placeholder="Event Name" onChange={handleChange} required className="border p-2 rounded w-full my-2" />
      <input type="text" name="tagline" placeholder="Tagline" onChange={handleChange} required className="border p-2 rounded w-full my-2" />
      <input type="datetime-local" name="schedule" onChange={handleChange} required className="border p-2 rounded w-full my-2" />
      <textarea name="description" placeholder="Description" onChange={handleChange} required className="border p-2 rounded w-full my-2"></textarea>
      <input type="text" name="moderator" placeholder="Moderator" onChange={handleChange} required className="border p-2 rounded w-full my-2" />
      <input type="text" name="category" placeholder="Category" onChange={handleChange} required className="border p-2 rounded w-full my-2" />
      <input type="text" name="sub_category" placeholder="Sub Category" onChange={handleChange} required className="border p-2 rounded w-full my-2" />
      <input type="number" name="rigor_rank" placeholder="Rigor Rank" onChange={handleChange} required className="border p-2 rounded w-full my-2" />
      <input type="file" name="image" onChange={handleFileChange} className="border p-2 rounded w-full my-2" />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{loading ? "Creating..." : "Create Event"}</button>
    </form>
  );
};

export default CreateEvent;
