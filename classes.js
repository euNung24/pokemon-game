class Sprite {
    constructor({
                    position,
                    velocity,
                    image,
                    frames = {
                        max: 1,
                        hold: 10
                    },
                    sprites,
                    animate,
                    isEnemy = false,
    }) {
        this.position = position;
        this.velocity = velocity;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0 };
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.moving = false;
        this.sprites = sprites;
        this.animate = animate;
        this.opacity = 1;
        this.health = 100;
        this.isEnemy = isEnemy
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        ctx.restore();
        if (!this.animate) {
            return;
        }
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++;
            } else {
                this.frames.val = 0;
            }
        }
    }

    attack({ attack, recipient }) {
        const tl = gsap.timeline();
        this.health -= attack.damage;

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        let healthBar = '#enemyHealth .spriteHealth';
        if (this.isEnemy) healthBar = '#playerHealth .spriteHealth'

        tl.to(this.position, {
            x: this.position.x - movementDistance
        }).to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
                // Enemy actually gets hit
                gsap.to(healthBar, {
                    width: this.health + '%',
                })

                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08,
                });

                gsap.to(recipient, {
                    opacity: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08,
                })
            }
        }).to(this.position, {
            x: this.position.x
        })
    }
}

class Boundary {
    static width = 48; // background 이미지 - 12픽셀 크기를 400%로 import 했음
    static height = 48;
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(this.position.x, this.position.y, Boundary.width, Boundary.height);
    }
}
