import { useState } from "react";
import axios from "axios";

export default function DrawingAI() {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateSteps = async () => {
    setLoading(true);

    const res = await axios.post("http://localhost:5000/api/users/draw", {
      prompt,
    });


    console.log(res,'============res============');
    

    setSteps(res.data.steps);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎨 AI Drawing Tutor</h2>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Draw a tiger"
        style={{ width: "300px", padding: 10 }}
      />

      <button onClick={generateSteps} style={{ marginLeft: 10 }}>
        Generate
      </button>

      {loading && <p>Loading...</p>}

      <ol>
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}