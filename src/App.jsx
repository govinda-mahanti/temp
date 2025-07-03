import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const streamRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const startRecording = async () => {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment',
      },
      audio: true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const vw = videoRef.current.videoWidth || 1280;
      const vh = videoRef.current.videoHeight || 720;

      // Portrait canvas (rotated landscape video will fit here)
      canvas.width = 720;
      canvas.height = 1280;

      const drawFrame = () => {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move origin to center, rotate canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-90 * Math.PI / 180);

        // Draw the landscape video rotated into the portrait canvas
        const drawWidth = vh;
        const drawHeight = vw;

        ctx.drawImage(
          videoRef.current,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        );

        ctx.restore();
        animationFrameIdRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();

      const canvasStream = canvas.captureStream(30);
      const audioTrack = stream.getAudioTracks()[0];
      canvasStream.addTrack(audioTrack);

      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(canvasStream, { mimeType: 'video/webm' });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        cancelAnimationFrame(animationFrameIdRef.current);
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Portrait Video Recorder (Fixed)</h2>
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
      <canvas
        ref={canvasRef}
        style={{
          width: '360px',
          height: '640px',
          borderRadius: '10px',
          backgroundColor: '#000',
        }}
      />
      <div style={{ marginTop: '12px' }}>
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
      {videoURL && (
        <div style={{ marginTop: '16px' }}>
          <video
            src={videoURL}
            controls
            style={{ width: '360px', height: '640px', borderRadius: '10px' }}
          />
          <br />
          <a href={videoURL} download="portrait-video.webm">Download Video</a>
        </div>
      )}
    </div>
  );
}

export default App;
