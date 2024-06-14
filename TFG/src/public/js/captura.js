document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const botonCapturar = document.getElementById('botonCapturar');
    const context = canvas.getContext('2d');

    //Acceder a la cámara
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error('Error al acceder a la cámara: ', err));

    //Capturar la imagen
    botonCapturar.addEventListener('click', () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        console.log('Imagen capturada:', dataURL);

        // Enviar la imagen al servidor
        fetch('/guardar-imagen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataURL })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Imagen guardada:', data);
            alert('Imagen guardada exitosamente en la galería.');
        })
        .catch(err => console.error('Error al guardar la imagen:', err));
    });
});
