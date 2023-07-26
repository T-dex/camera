'use client'
import { useRef, useEffect, useState } from 'react'
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import { NodeNextRequest } from 'next/dist/server/base-http/node';
//webgl blows it the fuck up




const Camera = () => {
    let detector;

    const videoRef = useRef<any>(null);
    // const webCamRef = useRef<any>(null);
    const canvasRef = useRef<any>(null)

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [funInTheSun, setFunInTheSun] = useState<boolean>(false)

    useEffect(() => {
        const enableVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setMediaStream(stream)
            } catch (err) {
                console.error("Errror accessing web cam", err)
            }
        }
        enableVideoStream()
    }, [])

    useEffect(() => {
        if (videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream
        }
    }, [videoRef, mediaStream])

    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => {
                    track.stop()
                })
            }
        }
    }, [mediaStream])


    const detect = async () => {
        if (
            typeof (videoRef.current != undefined) &&
            videoRef.current !== null &&
            videoRef.current.readyState === 4
        ) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
            const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
                runtime: "tfjs"
            }
            detector = await faceDetection.createDetector(model, detectorConfig)


            const faces = await detector.estimateFaces(video, { flipHorizontal: false })
            console.log(faces.length)
            faces.length == 1 ? setFunInTheSun(true) : setFunInTheSun(false)
        }
    }

    const runFaceMesh = async () => {
        setInterval(() => {
            detect()
        }, 1000)
    }
    // detect()
    runFaceMesh();


    return (
        <div>
            <video ref={videoRef} autoPlay={true}
                style={{ width: 640, height: 480 }} />
            <div>
                {funInTheSun ? (<h1 style={{ color: "green" }}>There is a human Present</h1>) : (<h1 style={{ color: 'red' }}>There is no human present</h1>)}
            </div>
        </div>
    )
}

export default Camera;