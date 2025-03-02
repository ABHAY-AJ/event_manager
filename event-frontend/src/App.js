import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import AllEvents from "./pages/AllEvents";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center my-4">Event Management</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<AllEvents />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/create" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
