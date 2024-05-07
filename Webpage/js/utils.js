function collision({
    object1,
    object2
}){
    return(
            object1.position.y + object1.height >= object2.position.y &&
            object1.position.y <= object2.position.y + object2.height &&
            object1.position.x <= object2.position.x + object2.width &&
            object1.position.x + object1.width >= object2.position.x)
    
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}
