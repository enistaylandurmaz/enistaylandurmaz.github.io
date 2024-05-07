class enemy {
    constructor({position, speed, collisionblocks}) {
        this.position = position;
        this.speed = speed;
        this.collisionblocks = collisionblocks;
        this.direction = { x: 1, y: 0 };
        this.width = 16;
        this.height = 16;
        this.currentFrame = 0;
        this.frameCount = 4; // Total number of frames in the sprite sheet
        this.ticksPerFrame = 10; // Adjust for animation speed
        this.tickCount = 0;
    }

    update() {
        if (this.hasObstacleInFront()) {
            this.adjustPosition();
        }
        // Basic roaming logic: change direction at edges
        if (this.reachedEdge()) {
            this.direction.x *= -1; // Change direction
        }
        // Move the enemy
        this.position.x += this.direction.x * this.speed;
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
        this.draw()
    }

    draw() {
        const frameX = this.currentFrame * this.width;
        c.save();
        
        // Flip the sprite based on direction
        if (this.direction.x < 0) {
            c.scale(-1, 1);
            c.drawImage(enemySprite, frameX, 0, this.width, this.height, -this.position.x - this.width, this.position.y, this.width, this.height);
        } else {
            c.drawImage(enemySprite, frameX, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
        }
        
        c.restore();
    }
    reachedEdge() {
        let futureX
        if (this.direction.x > 0){
            futureX = this.position.x + this.direction.x * this.speed + this.width;
        }
        else {futureX = this.position.x + this.direction.x * this.speed - this.width}
        // Create a hypothetical future position object for the enemy
        const futureEnemyPosition = {
            position: {x: futureX, y: this.position.y},
            width: this.width,
            height: this.height
        };
    
        let hasSupport = false;
        // Iterate through all collision blocks to check for potential support
        this.collisionblocks.forEach(block => {
            // Use the collision function to check if the future position of the enemy intersects with any block
            if (collision({object1: futureEnemyPosition, object2: block})) {
                // Check if the block is directly beneath the enemy for support
                if (futureEnemyPosition.position.y + futureEnemyPosition.height <= block.position.y + this.speed) {
                    hasSupport = true;
                }
            }
        });
    
        // If there's no support, the enemy has reached the edge
        return !hasSupport;
    }
    hasObstacleInFront() {
        // Calculate the future X position of the enemy
        const futureX = this.position.x + this.direction.x * this.speed;
    
        // Calculate the center Y position of the enemy
        const centerY = this.position.y + this.height / 2;
    
        // Iterate through all collision blocks to check for a collision directly in front of the enemy at the same Y-level
        for (const block of this.collisionblocks) {
            // Check if the block is at the same Y-level as the enemy
            const blockCenterY = block.position.y + block.height / 2;
            if (Math.abs(centerY - blockCenterY) < this.height / 2) {
                // Calculate the distance between the enemy and the block in the X-axis
                const distanceX = Math.abs((futureX + this.width / 2) - (block.position.x + block.width / 2));
                // If the block is within the enemy's horizontal range
                // It's considered in front of the enemy
                if (distanceX < this.width / 2) {
                    return true; // Obstacle detected
                }
            }
        }
        return false; // No obstacle found
    }
    
    adjustPosition() {
        for (const collisionblock of this.collisionblocks) {
            if (collision({ object1: this, object2: collisionblock })) {
                // Adjust the position and change direction based on the speed
                if (this.position.x > 0) {
                    // Collision on the right side, move to the left side of the collided block and change direction to move towards the left
                    this.position.x = collisionblock.position.x - this.width - 0.01;
                    this.direction.x = -1;
                } else if (this.position.x < 0) {
                    // Collision on the left side, move to the right side of the collided block and change direction to move towards the right
                    this.position.x = collisionblock.position.x + collisionblock.width + 0.01;
                    this.direction.x = 1;
                }
                break; // Exit the loop after adjusting position for one collision
            }
        }
    }
}