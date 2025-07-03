import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [mediaFile, setMediaFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <div className="card">
        <label className="block font-medium mb-2">
          Capture Photo or Video:
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          capture="environment"
          onChange={handleMediaChange}
        />
        {previewURL && (
          <>
            {mediaFile?.type?.startsWith('image/') ? (
              <img
                src={previewURL}
                alt="Captured"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '10px',
                  marginTop: '16px',
                }}
              />
            ) : (
              <video
                src={previewURL}
                controls
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '10px',
                  marginTop: '16px',
                }}
              />
            )}
          </>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
