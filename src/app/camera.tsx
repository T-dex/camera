'use client'
import { useRef, useEffect, useState } from 'react'
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';





const Camera = () => {
    let detector;

    const videoRef = useRef<any>(null);


    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [funInTheSun, setFunInTheSun] = useState<boolean>(false)
    const [faceData, setFaceData]= useState<any>()

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
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;


            const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
            const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
                runtime: "tfjs"
            }
            detector = await faceDetection.createDetector(model, detectorConfig)


            const faces = await detector.estimateFaces(video)
            setFaceData(faces)
            faces.length == 1 ? setFunInTheSun(true) : setFunInTheSun(false)
            console.log(faceData)
            return
        }
    }
    useEffect(() => {
        const check = setInterval(() => {
            detect()
        }, 1000)
        return () => {
            clearInterval(check);
        }

    }, [])



    return (
        <div>
            <video ref={videoRef} autoPlay={true}
                style={{ width: "480px", height: "640px"}} />
            <div>
                {funInTheSun ? (<h1 style={{ color: "green" }}>Human Detected </h1>) : (<h1 style={{ color: 'red' }}>No Human Detected</h1>)}
            </div>
        </div>
    )
}

export default Camera;