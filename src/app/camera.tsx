// 'use client'
// import React, { useRef, useState, useEffect } from 'react'
// import * as tf from "@tensorflow/tfjs"
// import * as facemesh from "@tensorflow-models/facemesh"
// import '@tensorflow/tfjs-backend-cpu';

// //webgl blows it the fuck up
// import Webcam from 'react-webcam';


// const Camera = () => {

//     const videoRef = useRef<any>(null);
//     // const webCamRef = useRef<any>(null);
//     const canvasRef = useRef<any>(null)

//     const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

//     useEffect(() => {
//         const enableVideoStream = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 setMediaStream(stream)
//             } catch (err) {
//                 console.error("Errror accessing web cam", err)
//             }
//         }
//         enableVideoStream()
//     }, [])

//     useEffect(() => {
//         if (videoRef.current && mediaStream) {
//             videoRef.current.srcObject = mediaStream
//         }
//     }, [videoRef, mediaStream])

//     useEffect(() => {
//         return () => {
//             if (mediaStream) {
//                 mediaStream.getTracks().forEach((track) => {
//                     track.stop()
//                 })
//             }
//         }
//     }, [mediaStream])

//     const runFaceMesh = async () => {
//         const net = await facemesh.load({
//             maxFaces: 1
//         });
//         detect(net)

//     }

//     runFaceMesh();

//     const detect = async (net: facemesh.FaceMesh) => {
//         console.log(videoRef)
//         if (
//             typeof (videoRef.current.video != undefined) &&
//             videoRef.current !== null &&
//             videoRef.current.video.readyState === 4
//         ) {

//             const video = videoRef.current;
//             const videoWidth = videoRef.current.videoWidth;
//             const videoHeight = videoRef.current.videoHeight;

//             canvasRef.current.width = videoWidth;
//             canvasRef.current.height = videoHeight;
//             console.log(video)

//             const face = await net.estimateFaces(video);
//             console.log(face)

//         }
//     }



//     return (
//         <div>
//             <Webcam ref={videoRef} autoPlay={true}
//                 style={{ width: 640, height: 480 }} />
//             {/* <video ref={videoRef} autoPlay={true}
//                 style={{ width: 640, height: 480 }} /> */}
//             <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
//         </div>
//     )
// }

// export default Camera;