// 1. dasturni yuklab olasiz
// 2. npm install qilasiz (dastur yuklanishi uchun kerakli kutubxonalar)
// 3. npm install muvaffaqiyatli bo'lgandan so'ng terminalni ochib npm start deb yozib enter tugmasini bosasiz
// 4. dastur browserda yuklanadi hamda kamera uchun dostup so'ridi , dostup bersangiz dastur ishga tushadi
import React, { useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as faceMesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";
function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Yuz chegaralarini aniqlash funksiyasi
  const runFaceMesh = async () => {
    const net = await faceMesh.load(faceMesh.SupportedPackages.mediapipeFacemesh);
    console.log(net,"net")
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
       const videoWidth = webcamRef.current.video.videoWidth;
       const videoHeight = webcamRef.current.video.videoHeight;
      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces({input:video});
      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  };
  useEffect(()=>{runFaceMesh()}, []);
  return (
    <div className="App">
        <Webcam ref={webcamRef} className={"detect-style"}/>
        <canvas ref={canvasRef} className={"detect-style"}/>
    </div>
  );
}

export default App;
