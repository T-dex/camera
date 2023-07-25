'use client'
import React, { useRef, useState, useEffect } from 'react'
import * as tf from "@tensorflow/tfjs"
import * as facemesh from "@tensorflow-models/facemesh"
import '@tensorflow/tfjs-backend-cpu';


const Camera = () => {

    const videoRef = useRef<any>(null);
    const canvasRef = useRef<any>(null)

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

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

    const runFaceMesh = async () => {
        const net = await facemesh.load();

        setInterval(() => {
            detect(net)
        }, 10000)
    }

    runFaceMesh();

    const detect = async (net: facemesh.FaceMesh) => {
        if (
            videoRef.current.video != "undefined" &&
            videoRef.current !== null
        ) {
            const video = videoRef.current.video;
            const videoWidth = videoRef.current.clientwidth;
            const videoHeight = videoRef.current.clientHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const face = await net.estimateFaces(video);
            console.log(face)
        }
    }



    return (
        <div>
            <video ref={videoRef} autoPlay={true}
                style={{ width: 640, height: 480 }} />
            <canvas ref={canvasRef} />
        </div>
    )
}

export default Camera;