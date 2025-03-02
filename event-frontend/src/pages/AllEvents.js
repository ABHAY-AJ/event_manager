import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { baseUrl } from "../api/baseUrl";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${baseUrl}/all`)
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-xl">Loading events...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Events</h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="border p-4 rounded shadow-lg bg-white">
              {event.files?.image && (
                <img src={event.files.image} alt={event.name} className="w-full h-40 object-cover rounded-md" />
              )}
              <h3 className="text-xl font-semibold mt-3">{event.name}</h3>
              <p className="text-gray-600">{event.tagline}</p>
              <p className="text-sm text-gray-500">📅 {new Date(event.schedule).toLocaleString()}</p>
              <p className="text-sm text-gray-500">👤 Moderator: {event.moderator}</p>

              <Link 
                to={`/event/${event._id}`} 
                className="block text-center mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
