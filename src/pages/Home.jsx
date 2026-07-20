function Home() {
  return (
    <div className="dashboard">
      <h2>Good evening</h2>

      <p className="subtitle">
        Ready for your next adventure?
      </p>

      <div className="card">
        <h3>🌤 Weather</h3>
        <p>Loading weather...</p>
      </div>

      <div className="card">
        <h3>📅 Next Trip</h3>
        <p>No trip planned.</p>
      </div>

      <div className="card">
        <h3>⚠️ Outstanding Tasks</h3>
        <p>You're all caught up!</p>
      </div>

      <div className="card">
        <h3>📝 Recent Notes</h3>
        <p>No notes yet.</p>
      </div>
    </div>
  );
}

export default Home;