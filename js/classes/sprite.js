class sprite {
    constructor({position, imageSrc, width, height, textContent, displayTextPosition, textStyle, color, maxwidth, lineHeight}) {
        this.position = position;
        this.image = new Image();
        this.width = width;
        this.height = height;
        this.image.src = imageSrc;
        // Text attributes
        this.textContent = textContent || null;
        this.displayTextPosition = displayTextPosition || null;
        this.textStyle = textStyle || '20px Arial';
        this.color = color || 'black';
        this.textOpacity = 0;
        this.maxwidth = maxwidth;
        this.lineHeight = lineHeight;
        //collision attributes
        this.collisionDetected = false;
        this.lastCollisionTime = 0;
        this.collisionCooldown = 500;
    }

    draw() {
        if (!this.image) return;
        c.drawImage(this.image, this.position.x, this.position.y);
    }

    update() {
        this.checkimagecollisions()
        this.draw();
        
    }
    updateTextOpacity(targetOpacity, deltaTime) {
        // Adjust the rate to control the speed of the fade-in effect
        const fadeRate = 0.5;
        if (this.textOpacity < targetOpacity) {
            this.textOpacity += fadeRate * deltaTime;
            if (this.textOpacity > targetOpacity) {
                this.textOpacity = targetOpacity;
            }
        }
    }
    checkimagecollisions() {
        chests.forEach(chest => {
            if (collision({ object1: player, object2: chest }) && !chest.opened) {
                chest.image.src = './img/opened_chest.png'; 
                chest.opened = true;
                chest.keyCollected = true; // Mark the key as collected
            }
    
            if (chest.keyCollected) {
                // Smoothly move the key towards the player
                let followSpeed = 0.005; // Adjust this value to control the follow speed
                chest.keySprite.position.x = lerp(chest.keySprite.position.x, player.position.x-16, followSpeed);
                chest.keySprite.position.y = lerp(chest.keySprite.position.y, player.position.y-16, followSpeed);
            }
        });

        doors.forEach(door => {
            if (!door.opened && collision({ object1: player, object2: door })) {
                chests.forEach(chest => {
                    if (chest.keyCollected) {
                        door.image.src = './img/opened_door.png'; // Change to your open door image
                        door.opened = true;
                        chest.keyCollected = false; // Player loses the key
                    }
                    else {
                        player.velocity.x = 0;
                        player.position.x = door.position.x-16;
                        
                    }
                });
            }
        });

        signs.forEach(sign => {
            if (collision({ object1: player, object2: sign })) {
                sign.textOpacity = Math.min(sign.textOpacity + 0.0005, 1);
            } else {
                sign.textOpacity = Math.max(sign.textOpacity - 0.0002, 0);
            }
    
            if (sign.displayTextPosition && sign.textOpacity > 0) {
                c.save();
                c.globalAlpha = sign.textOpacity;
                c.font = sign.textStyle || '20px Arial';
                c.fillStyle = sign.color || 'white';
            
                wrapText(c, sign.textContent, sign.displayTextPosition.x, sign.displayTextPosition.y, sign.maxwidth, sign.lineHeight);
            
                c.restore();
            }
        });

        enemies.forEach(enemy => {
            if (collision({object1: player, object2: enemy})) {
                const currentTime = Date.now();
                // Check if collision cooldown has passed
                if (currentTime - this.lastCollisionTime > this.collisionCooldown) {
                    // Set the flag to true to indicate collision detection
                    this.collisionDetected = true;
                    this.lastCollisionTime = currentTime;
        
                    // Collision detected, push player based on enemy's direction
                    if (enemy.direction.x > 0) {
                        // Push player to the right
                        player.velocity.x += 0.5; // Adjust the push strength as needed
                    } else if (enemy.direction.x < 0) {
                        // Push player to the left
                        player.velocity.x -= 0.5; // Adjust the push strength as needed
                    }
                }
            }
        });

        // Reset the collision flag after the cooldown
        if (this.collisionDetected && Date.now() - this.lastCollisionTime > this.collisionCooldown) {
            this.collisionDetected = false;
        }
    }
    
}


