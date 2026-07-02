import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    Age: '',
    Gender: '',
    BMI: '',
    Smoking: '',
    GeneticRisk: '',
    PhysicalActivity: '',
    AlcoholIntake: '',
    CancerHistory: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    try {
      const inputArray = [
        Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [
            key,
            Math.round(parseFloat(value) * 100) / 100
          ])
        )
      ];

      const res = await axios.post('http://127.0.0.1:5000/predict', {
        data: inputArray
      });

      setPrediction(res.data.prediction[0]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please check your inputs and try again.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/background-image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          padding: 30,
          maxWidth: 500,
          width: '90%',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}
      >
        <h2 style={{ textAlign: 'center' }}>🧬 Cancer Prediction</h2>

        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              {key === 'Gender'
                ? 'Gender (0 = Female, 1 = Male)'
                : key === 'Smoking'
                ? 'Smoking (0 = No, 1 = Yes)'
                : key === 'GeneticRisk'
                ? 'Genetic Risk (0–2)'
                : key === 'CancerHistory'
                ? 'Cancer History (0 = No, 1 = Yes)'
                : key}:
            </label>
            <input
              name={key}
              value={formData[key]}
              onChange={handleChange}
              type="number"
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            />
          </div>
        ))}

        <button
          onClick={handlePredict}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px'
          }}
        >
          Predict
        </button>

        {prediction !== null && (
          <h3 style={{ marginTop: 20, textAlign: 'center' }}>
            🔍 Prediction:{' '}
            <span style={{ color: prediction === 1 ? 'red' : 'green' }}>
              {prediction === 1 ? 'Cancer Detected' : 'No Cancer Detected'}
            </span>
          </h3>
        )}

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;
