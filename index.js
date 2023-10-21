const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 16 : 9 비율
canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
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
        ctx.fillStyle = 'rgba(255, 0, 0, 0)';
        ctx.fillRect(this.position.x, this.position.y, Boundary.width, Boundary.height);
    }
}

const boundaries = [];

const offset = {
    x: -735,
    y: -630
}
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y,
                }
            }));
        }
    })
});

const image = new Image();
image.src = './img/Pellet Town.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

class Sprite {
    constructor({position, velocity, image, frames = { max: 1 } }) {
        this.position = position;
        this.velocity = velocity;
        this.image = image;
        this.frames = frames;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
    }

    draw() {
        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        ); // 배경보다 크기가 작아서 playerImage가 먼저 그려지는 것 방지
    }
}
const player = new Sprite({
    position: {
        // x: canvas.width / 2 - (playerImage.width / 4) / 2, // 캐릭터 하나: playerImage / 4, 캐릭터 하나의 반: 캐릭터 하나 / 2
        // y: canvas.height / 2 - playerImage.height / 2,
        // 이미지가 로드되지 않았을 수도 있으므로 원래 이미지에서 크기를 가져옴
        x: canvas.width / 2 - (192 / 4) / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
    }
})
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image
});

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    }
}

const movables = [background, ...boundaries];

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}
function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    player.draw();
    boundaries.forEach(boundary => boundary.draw());

    let moving = true;
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.y += 3);
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })) {
                console.log('collision');
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.x += 3);
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                console.log('collision');
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.y -= 3);
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })) {
                console.log('collision');
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.x -= 3);
        }
    }
}

animate();

let lastKey = '';   // 첫번째 키를 누른 상태로 두번째 키를 눌렀을 때 동작을 처리하기 위함
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "w": {
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        }
        case "a": {
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        }
        case "s": {
            keys.s.pressed = true;
            lastKey = 's';
            break;
        }
        case "d": {
            keys.d.pressed = true;
            lastKey = 'd';
            break;
        }
        default: {
            break;
        }
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case "w": {
            keys.w.pressed = false;
            break;
        }
        case "a": {
            keys.a.pressed = false;
            break;
        }
        case "s": {
            keys.s.pressed = false;
            break;
        }
        case "d": {
            keys.d.pressed = false;
            break;
        }
        default: {
            break;
        }
    }
})
