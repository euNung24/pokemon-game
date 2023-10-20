const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 16 : 9 비율
canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/Pellet Town.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

class Sprite {
    constructor({position, velocity, image}) {
        this.position = position;
        this.velocity = velocity;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({
    position: {
        x: -735,
        y: -600
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
function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    ctx.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - (playerImage.width / 4) / 2, // 캐릭터 하나: playerImage / 4, 캐릭터 하나의 반: 캐릭터 하나 / 2
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height
    ); // 배경보다 크기가 작아서 playerImage가 먼저 그려지는 것 방지

    if (keys.w.pressed && lastKey === 'w') {
        background.position.y += 3;
    } else if (keys.a.pressed && lastKey === 'a') {
        background.position.x += 3;
    } else if (keys.s.pressed && lastKey === 's') {
        background.position.y -= 3;
    } else if (keys.d.pressed && lastKey === 'd') {
        background.position.x -= 3;
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
