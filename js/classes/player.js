class Player{
    constructor({position, collisionblocks}){
        this.position = position
        
        this.velocity = {
            x: 0,
            y: 0
        };
        this.gravity = 0.08;
        this.horizontalAcceleration = 0;
        this.maxSpeed = 2; // Maximum horizontal speed
        this.deceleration = 0.99; // Deceleration factor
        this.onGround = false;
        this.walljump = true;
        this.collisionblocks = collisionblocks
        this.width = 16
        this.height = 16
        this.rotation = 0; // Rotation angle in radians
        this.camerabox = {
            position:{
                x:this.position.x,
                y:this.position.y
            },
            width:300,
            height:160
        }
    }
    draw(){
        c.save(); // Save the current state of the canvas
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2); // Move to the center of the ball
        c.rotate(this.rotation); // Rotate the canvas

        // Draw the ball
        c.fillStyle = 'red';
        c.beginPath();
        c.arc(0, 0, this.width / 2, 0, Math.PI * 2); // Draw a circle
        c.fill();

        // Draw a stripe or line on the ball
        c.beginPath();
        c.moveTo(0, -this.width / 2); // Start at the top of the ball
        c.lineTo(0, this.width / 2); // Draw a line to the bottom of the ball
        c.strokeStyle = 'white'; // Set the line color
        c.lineWidth = 2; // Set the line width
        c.stroke();

        c.restore(); // Restore the canvas state
    }
    update() {   
         
        this.updatecamerabox()
        this.acceleration_deceleration()    
        this.checkforhorizontalcollision()
        this.apply_gravity()
        this.checkforverticalcollision()
        this.checkforimagebordercollision()
        
        this.draw();
        this.backtomenu()
    }
    updatecamerabox(){
        this.camerabox = {
            position:{
                x:this.position.x-135,
                y:this.position.y-70
            },
            width:300,
            height:160
        }
    }
    camera_to_up({scaled_canvas,camera, canvas}){
        const camera_up_side = this.camerabox.position.y
        if(camera_up_side <= -this.velocity.y){
            return
        }
    
        if(camera_up_side <= Math.abs(camera.position.y) && this.velocity.y < 0){
            camera.position.y -= this.velocity.y
        }
    }
    camera_to_down({scaled_canvas,camera, canvas}){
        const camera_down_side = this.camerabox.position.y
        if(camera_down_side + this.camerabox.height >= pngHeight-this.velocity.y){
            return
        }
        if(camera_down_side + this.camerabox.height >= Math.abs(camera.position.y) + scaled_canvas.height && this.velocity.y > 0){
            camera.position.y -= this.velocity.y
        }
    }
    camera_to_right({scaled_canvas,camera, canvas}){
        const camera_right_side = this.camerabox.position.x + this.camerabox.width
        if(camera_right_side >= pngWidth-this.velocity.x){
            return
        }
        if(camera_right_side >= scaled_canvas.width + Math.abs(camera.position.x)  && this.velocity.x > 0){
            camera.position.x -= this.velocity.x
        }
    }
    camera_to_left({camera, canvas}){
        const camera_left_side = this.camerabox.position.x
        if(camera_left_side <= -this.velocity.x) return
        if(camera_left_side <= Math.abs(camera.position.x)  && this.velocity.x < 0){
            camera.position.x -= this.velocity.x
        }
    }
    apply_gravity(){
        // Apply gravity to the vertical velocity
        this.velocity.y += this.gravity;
        // Update position with the current velocity
        this.position.y += this.velocity.y;
    }
    acceleration_deceleration(){
        if (this.velocity.x !== 0) {
            this.rotation += this.velocity.x / 20; // Adjust rotation speed if necessary
        }
        // Horizontal movement
        if (this.horizontalAcceleration !== 0) {
            // Apply acceleration
            this.velocity.x += this.horizontalAcceleration;
            if (Math.abs(this.velocity.x) > this.maxSpeed) {
                // Clamp velocity to max speed
                this.velocity.x = this.maxSpeed * Math.sign(this.velocity.x);
            }
        } else {
            // Apply deceleration
            this.velocity.x *= this.deceleration;
            if (Math.abs(this.velocity.x) < 0.1) {
                // Stop completely if the speed is very low
                this.velocity.x = 0;
            }
        }
        this.position.x += this.velocity.x;
    }
    jump() {
        if (this.canJump) {
            this.velocity.y = -3.6; // Negative value for upward movement
            this.canJump = false; // Reset the jump flag
            this.onGround = false; // The player is no longer on the ground
        }
    }
    
    checkforverticalcollision() {
        let collisionDetected = false;

        for (let i = 0; i < this.collisionblocks.length; i++) {
            const collisionblock = this.collisionblocks[i];
            if (collision({
                object1: this,
                object2: collisionblock
            })) {
                collisionDetected = true;
                if (this.velocity.y > 0) {
                    this.position.y = collisionblock.position.y - this.height -0.01;
                    this.velocity.y = -this.velocity.y * 0.5; // Bounce effect
                    this.canJump = true; // Allow jumping again
                    this.walljump = true;
                    break
                }
                else if (this.velocity.y < 0) { // Collision from below
                    this.velocity.y = 0;
                    this.position.y = collisionblock.position.y + collisionblock.height + 0.01;
                    break
                }
            }
        }

        if (!collisionDetected) {
            this.onGround = false;
        }
    }

    checkforhorizontalcollision() {
        let collisionDetected = false;

        for (let i = 0; i < this.collisionblocks.length; i++) {
            const collisionblock = this.collisionblocks[i];
            if (collision({
                object1: this,
                object2: collisionblock
            })) {
                collisionDetected = true;
                if (this.velocity.x > 0) {
                    this.position.x = collisionblock.position.x - this.width -0.01;
                    this.velocity.x = -this.velocity.x * 0.4; // Bounce effect
                    if (this.walljump){
                        this.canJump = true;
                    }
                    this.walljump = false;
                    break
                }
                else if (this.velocity.x < 0) {
                    this.position.x = collisionblock.position.x + collisionblock.width + 0.01;
                    this.velocity.x = -this.velocity.x * 0.4;
                    if (this.walljump){
                        this.canJump = true;
                    }
                    this.walljump = false;
                    break
                }
            }
        }

        if (!collisionDetected) {
            this.onGround = false;
        }
    }
    checkforimagebordercollision(){
        if (this.width + this.position.x >= pngWidth){
            this.velocity.x = 0
            this.position.x = pngWidth - this.width
        }
        if (this.position.x <= 0) {
            this.velocity.x = 0;
            this.position.x = 0
        }
    }
    
    backtomenu() {
        const arrowSize = 30; // Size of the arrow 
        const padding = 5;
        // Fixed starting position of the arrow on the canvas
        const startX = padding;
        const startY = padding;
        c.fillStyle = 'white'; // Arrow color
    
        // Save the current context state (including transformations like translate)
        c.save();
    
        // Reset transformations to draw in fixed canvas coordinates
        c.setTransform(1, 0, 0, 1, 0, 0);
    
        // Draw the arrow
        c.beginPath();
        c.moveTo(startX + arrowSize * 0.5, startY); // Top point of the arrow
        c.lineTo(startX, startY + arrowSize * 0.5); // Middle point (tip of the arrow)
        c.lineTo(startX + arrowSize * 0.5, startY + arrowSize); // Bottom point of the arrow
        c.lineTo(startX + arrowSize * 0.3, startY + arrowSize * 0.5); // Back to middle point
        c.closePath();
        c.fill();
    
        // Optionally, draw the arrow's stem
        c.fillRect(startX + arrowSize * 0.5, startY + arrowSize * 0.3, arrowSize * 0.5, arrowSize * 0.4);
    
        // Restore the context state to revert to the previous transformations
        c.restore();
    }

}
