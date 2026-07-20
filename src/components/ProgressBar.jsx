function ProgressBar({ completed, total }) {
  const percent = (completed / total) * 100;

  return (
    <div style={{ marginBottom: "25px" }}>
      <div
        style={{
          width: "100%",
          height: "18px",
          background: "#374151",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#22c55e",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >
        {completed} / {total} Complete
      </p>
    </div>
  );
}

export default ProgressBar;