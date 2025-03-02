import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api/baseUrl";

const Home = () => {
  const [events, setEvents] = useState([]);
  const API_URL = `${baseUrl}?type=latest&limit=5&page=1`;

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setEvents(events.filter(event => event._id !== id));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div>
        <div>
        <Link to="/all" className="bg-blue-500 text-white px-4 py-2 rounded mr-1">See All Events</Link>
        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">Create Event</Link>
        </div>
        
      <h2 className="text-xl font-bold my-4">Latest Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id} className="border p-4 my-2 rounded shadow">
            <Link to={`/event/${event._id}`} className="text-blue-500 font-semibold">{event.name}</Link>
            <p>{event.description}</p>
            <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
