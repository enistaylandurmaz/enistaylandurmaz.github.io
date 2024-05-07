function startGame() {
    // Hide non-game sections
    document.querySelectorAll('.container, .content, header, footer').forEach(element => {
        element.style.display = 'none';
    });

    // Show the canvas
    const canvas = document.querySelector('canvas');
    canvas.style.display = 'block';
    startButton.style.display = 'none';
    // Set body overflow to hidden
    document.body.style.overflow = 'hidden';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();
}

function endGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Cancel the current animation frame
    }
    // Show non-game sections
    document.querySelectorAll('.container, .content, header, footer').forEach(element => {
        element.style.display = '';
    });

    // Hide the canvas
    const canvas = document.querySelector('canvas');
    canvas.style.display = 'none';

    // Restore body overflow
    document.body.style.overflow = '';
    startButton.style.display = '';

}