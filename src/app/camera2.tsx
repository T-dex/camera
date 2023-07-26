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
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;


            const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
            const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
                runtime: "tfjs"
            }
            detector = await faceDetection.createDetector(model, detectorConfig)


            const faces = await detector.estimateFaces(video, { flipHorizontal: false })
            console.log(faces)
            faces.length == 1 ? setFunInTheSun(true) : setFunInTheSun(false)
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
                style={{ width: 1, height: 1 }} />
            <div>
                {funInTheSun ? (<h1 style={{ color: "green" }}>There is Human Present</h1>) : (<h1 style={{ color: 'red' }}>There no Human</h1>)}
            </div>
        </div>
    )
}

export default Camera;