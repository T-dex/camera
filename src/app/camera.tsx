'use client'
import { useRef, useEffect, useState, MutableRefObject } from 'react';
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';


const Camera = () => {
    let detector;

    const videoRef = useRef<any>(null);
    const c1 = useRef<HTMLCanvasElement>(null); 



    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [funInTheSun, setFunInTheSun] = useState<boolean>(false)
    const [faceData, setFaceData]= useState<any>()
    
    useEffect(() => {
        const enableVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // videoRef.current.src=window.URL.createObjectURL(stream
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
            videoRef.current.play()
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
    
    const detect = async (context: CanvasRenderingContext2D |null|  undefined) => {
        if(!c1.current)return;
        // paintToCanvas()
        const paint= setInterval(()=>{
            context?.drawImage(videoRef.current,0,0)
            },1000)
    
        if (
            typeof (videoRef.current != undefined) &&
            videoRef.current !== null &&
            videoRef.current.readyState === 4
        ) {
            const video = videoRef.current;
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;
            
            video.current=c1.current.captureStream(1)

            c1.current.height=videoHeight;
            c1.current.width=videoWidth;

            const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
            const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
                runtime: "tfjs",
                maxFaces: 1
            }
            detector = await faceDetection.createDetector(model, detectorConfig)


            const faces = await detector.estimateFaces(c1.current)
            faces.length == 1 ? setFunInTheSun(true) : setFunInTheSun(false)
            return ()=>{
                clearInterval(paint)
            }
        }
    }

    
    useEffect(() => {
        const canvas = c1.current
        const context= canvas?.getContext('2d')

        const check = setInterval(() => detect(context), 1000)
        return () => {
            clearInterval(check);
        }
    }, [])



    return (
        <div>
            <video ref={videoRef} autoPlay={true}
                style={{ width: "480px", height: "640px", display:"none"}} muted/>
            
            <div>
                <canvas id="vidDisplay" ref={c1} style={ {display:"none"}}/>
                </div>
                <div>
                {funInTheSun ? (<h1 style={{ color: "green" }}>You are being Monitored. Do not resist </h1>) : (<h1 style={{ color: 'red' }}>Please step in front of the camera to be monitored</h1>)}
            </div>
        </div>
    )
}

export default Camera;