import { Component } from 'react';

import ExampleApp from '../components/examples/ExampleApp';

// import path from 'path';

import './photobooth.css';

class Home extends Component {
    componentDidMount() {
        const WPAPI = require('wpapi');
        const wp = new WPAPI({
            endpoint: 'https://local.dxlab.sl.nsw.gov.au/selfie/wp-json',
            username: 'upload',
            password: 'djYU05v5gy0T',
        });

        const camName = 'HD Pro Webcam C920';
        const takeBut = document.getElementById('snap');
        const retakeBut = document.getElementById('retake');
        const useBut = document.getElementById('sendSelfie');
        const selfieEl = document.getElementById('canvas');
        let stage1 = document.getElementById('stage1');
        let stage2 = document.getElementById('stage2');
        let stage3 = document.getElementById('stage3');
        let devId;
        const video = document.getElementById('video');
        let constraints = {};

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .enumerateDevices()
                .then(gotDevices)
                .then(getStream)
                .catch(handleError);

            function gotDevices(deviceInfos) {
                for (let i = 0; i !== deviceInfos.length; ++i) {
                    const deviceInfo = deviceInfos[i];
                    if (
                        deviceInfo.kind === 'videoinput' &&
                        deviceInfo.label.substring(0, 18) === camName
                    ) {
                        devId = deviceInfo.deviceId;
                    }
                }
            }

            function getStream() {
                if (window.stream) {
                    window.stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                }
                constraints = {
                    video: {
                        deviceId: { exact: devId }, // videoSelect.value
                        width: 1080,
                        height: 1080,
                    },
                };
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then(gotStream)
                    .catch(handleError);
            }

            function gotStream(stream) {
                window.stream = stream; // make stream available to console
                video.srcObject = stream;
            }

            function handleError(error) {
                console.error('Error: ', error);
            }

            function takeSelfie() {
                blinkIt();
                context.drawImage(video, 0, 0, 1080, 1080);
                stage1.style.display = 'none';
                stage2.style.display = 'block';
                const dataURL = canvas.toDataURL('image/png');
                const blob = dataURItoBlob(dataURL);
            }

            function uploadSelfie() {
                wp
                    .media()
                    .file(blob, 'selfie.png')
                    .create({
                        title: 'test selfie',
                        alt_text: 'test selfie',
                        caption: 'test selfie',
                        description: 'test selfie',
                    })
                    .then(function(response) {
                        var newImageId = response.id;
                    });
            }

            function checkKeyPressed(e) {
                if (e.keyCode == '76') {
                    takeSelfie();
                }
            }

            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');

            window.addEventListener('keydown', checkKeyPressed, false);
            takeBut.addEventListener('click', takeSelfie);
        } else {
            console.log("browser doesn't support camera");
        }
    }

    render() {
        return (
            <ExampleApp>
                <h1 id="title">Take a selfie</h1>
                <div id="stage1">
                    <video id="video" width="1080" height="1080" autoPlay />
                    <br />
                    <button id="snap">take selfie</button>
                </div>
                <div id="stage2">
                    <canvas id="canvas" width="1080" height="1080" />
                    <br />
                    <button id="retake">re-take</button>
                    <button id="sendSelfie">use this</button>
                </div>
                <div id="stage3">
                    <p>Thank you</p>
                </div>
            </ExampleApp>
        );
    }
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

let blink;

function blinkIt() {
    document.body.style.background = '#e6007e';
    blink = setInterval(blinkOff, 75);
}

function blinkOff() {
    document.body.style.background = '#080808';
    clearInterval(blink);
}

function goHome() {
    window.location = './';
}

export default Home;
