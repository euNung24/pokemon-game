const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 16 : 9 비율
canvas.width = 1024;
canvas.height = 576;
canvas.parentElement.style.height = canvas.height + 'px';

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const offset = {
    x: -735,
    y: -630
}

const boundaries = [];
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

const battleZones = [];
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battleZones.push(new Boundary({
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

const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

const player = new Sprite({
    position: {
        // x: canvas.width / 2 - (playerImage.width / 4) / 2, // 캐릭터 하나: playerImage / 4, 캐릭터 하나의 반: 캐릭터 하나 / 2
        // y: canvas.height / 2 - playerImage.height / 2,
        // 이미지가 로드되지 않았을 수도 있으므로 원래 이미지에서 크기를 가져옴
        x: canvas.width / 2 - (192 / 4) / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 20,
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage,
    }
})
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
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

const movables = [background, ...boundaries, foreground, ...battleZones];

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

const battle = {
    initiated: false,
};
function animate() {
    const animationId = window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach(boundary => boundary.draw());
    battleZones.forEach(battleZone => battleZone.draw());
    player.draw();
    foreground.draw();

    let moving = true;
    player.animate = false;

    if (battle.initiated) {
        return;
    }

    // activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea = (
                    Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width)
                    - Math.max(player.position.x, battleZone.position.x)
                ) * (
                    Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
                    -Math.max(player.position.y, battleZone.position.y)
                );
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
            })
                && overlappingArea > (player.width * player.height) / 2
                && Math.random() < 0.01 //  배틀존에서 다닐 때 랜덤으로 배틀하기 위함
            ) {
                // deactivate current animation loop
                window.cancelAnimationFrame(animationId);

                audio.Map.stop();
                audio.initBattle.play();
                audio.battle.play();

                battle.initiated = true;
                // flash 효과
                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    // 검은 배경으로 마무리
                    onComplete: () => {
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            duration: 0.4,
                            // battle 배경으로 바꾼 후 검은 배경 효과 제거
                            onComplete() {
                                // activate a new animation loop
                                initBattle();
                                animateBattle();
                                gsap.to("#overlappingDiv", {
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })

                    }
                });
                break;
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: {
                    ...player,
                    position: {
                        x: player.position.x,
                        y: player.position.y + 40,
                    },
                    height: player.height - 40
                },
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
        player.animate = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: {
                    ...player,
                    position: {
                        x: player.position.x,
                        y: player.position.y + 40,
                    },
                    height: player.height - 40
                },
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.x += 3);
        }
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: {
                    ...player,
                    position: {
                        x: player.position.x,
                        y: player.position.y + 40,
                    },
                    height: player.height - 40

                },
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.y -= 3);
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: {
                    ...player,
                    position: {
                        x: player.position.x,
                        y: player.position.y + 40,
                    },
                    height: player.height - 40
                },
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.x -= 3);
        }
    }
}

// animate();

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

let clicked = false;
window.addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play();
        clicked = true;
    }
})
