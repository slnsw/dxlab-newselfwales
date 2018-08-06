export default (videoElement, camName) => {
	let devId;
	let constraints = {};

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
			window.stream.getTracks().forEach((track) => {
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
		/* eslint-disable no-param-reassign */
		videoElement.srcObject = stream;
	}

	function handleError(error) {
		console.error('Error: ', error);
	}

	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.enumerateDevices()
			.then(gotDevices)
			.then(getStream)
			.catch(handleError);
	} else {
		console.log("This browser doesn't support a camera");
	}
};

export const dataURItoBlob = (dataURI) => {
	let byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else byteString = unescape(dataURI.split(',')[1]);
	const mimeString = dataURI
		.split(',')[0]
		.split(':')[1]
		.split(';')[0];
	const ia = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], { type: mimeString });
};
