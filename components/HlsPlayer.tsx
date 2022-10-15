import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

export default function HlsPlayer(props) {
    const videoRef = useRef(null)

    useEffect(() => {
        const video = videoRef.current

        if (props.src != undefined) {
            if (Hls.isSupported()) {
                const hls = new Hls()
                hls.loadSource(props.src)
                hls.attachMedia(video)
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = props.src
            }
        }
    }, [props.src, videoRef])

    return (
        <video
            className={props.className}
            controls={props.controls}
            data-hint={props.dataHint}
            crossOrigin={props.crossOrigin}
            height={props.height}
            muted={props.muted}
            playsInline={props.playsInline}
            preload={props.preload}
            width={props.width}
            ref={videoRef}
        >
            {props.children}
        </video>
    )

}