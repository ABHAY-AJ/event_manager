import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api/baseUrl";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    schedule: "",
    description: "",
    moderator: "",
    category: "",
    sub_category: "",
    rigor_rank: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${baseUrl}?id=${id}`)
      .then(res => {
        setEvent(res.data);
        setFormData({
          name: res.data.name,
          tagline: res.data.tagline,
          schedule: new Date(res.data.schedule).toISOString().slice(0, 16),
          description: res.data.description,
          moderator: res.data.moderator,
          category: res.data.category,
          sub_category: res.data.sub_category,
          rigor_rank: res.data.rigor_rank,
          image: null,
        });
      })
      .catch(err => console.error("Error fetching event details:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataObj.append(key, formData[key]);
        }
      });

      await axios.put(`${baseUrl}/${id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Event updated successfully!");
      setIsEditing(false);
      navigate(0); // Refresh page to show updated details
    } catch (error) {
      console.error("Error updating event:", error);
    }
    setLoading(false);
  };

  if (!event) return <p className="text-center text-xl">Loading event details...</p>;

  return (
    <div className="max-w-3xl mx-auto border p-6 rounded shadow-lg bg-white mt-6">
      {!isEditing ? (
        <>
          <h2 className="text-3xl font-bold text-gray-800">{event.name}</h2>
          <p className="text-gray-600 italic">{event.tagline}</p>

          <p className="mt-3"><strong>Scheduled On:</strong> {new Date(event.schedule).toLocaleString()}</p>
          <p><strong>Moderator:</strong> {event.moderator}</p>

          <p className="mt-3"><strong>Description:</strong> {event.description}</p>

          <p className="mt-3"><strong>Category:</strong> {event.category} / {event.sub_category}</p>
          <p><strong>Rigor Rank:</strong> {event.rigor_rank}</p>

          {event.files?.image && (
            <img 
              src={event.files.image} 
              alt="Event" 
              className="w-full mt-4 rounded-lg shadow-md"
            />
          )}

          <h3 className="mt-6 text-xl font-semibold">Attendees:</h3>
          {event.attendees && event.attendees.length > 0 ? (
            <ul className="list-disc pl-6">
              {event.attendees.map((attendee, index) => (
                <li key={index} className="text-gray-700">{attendee}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No attendees yet.</p>
          )}

          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsEditing(true)}
          >
            Edit Event
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>

          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Event Name" />
          <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Tagline" />
          <input type="datetime-local" name="schedule" value={formData.schedule} onChange={handleChange} className="border p-2 w-full mt-2" />
          <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Description"></textarea>
          <input type="text" name="moderator" value={formData.moderator} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Moderator" />
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Category" />
          <input type="text" name="sub_category" value={formData.sub_category} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Sub Category" />
          <input type="number" name="rigor_rank" value={formData.rigor_rank} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Rigor Rank" />

          <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 w-full mt-2" />

          <div className="mt-4">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventDetails;
