let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!isDrawing) return;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}
document.getElementById('predictButton').addEventListener('click', function() {
    // Get the canvas element
    let canvas = document.getElementById('canvas');

    // Convert the canvas content to a data URL (base64 encoded image)
    let imageData = canvas.toDataURL();

    // Send the image data to the server for prediction
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_data: imageData }),
    })
    .then(response => response.json())
    .then(data => {
        // Update the result element with the predicted digit
        document.getElementById('result').textContent = `Predicted Digit: ${data.predicted_digit}`;
    })
    .catch(error => console.error('Error:', error));
});

