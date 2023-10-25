const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImage
})

let draggle;
let emby;
let renderedSprites;
let battleAnimationId;
let queue;

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block';
    document.querySelector('#dialogBox').style.display = 'none';
    document.querySelector('#enemyHealth .spriteHealth').style.width = '100%';
    document.querySelector('#playerHealth .spriteHealth').style.width = '100%';
    document.querySelector('.attacks').replaceChildren();

    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = [];

    emby.attacks.forEach((attack) => {
        const button = document.createElement('button');
        button.innerHTML = attack.name;
        document.querySelector('.attacks').append(button);
    })

    document.querySelectorAll('.attacks button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            });

            if (draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint();
                });
                queue.push(() => {
                    // fade back to black
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId);
                            animate();
                            document.querySelector('#userInterface').style.display = 'none';
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                            })

                            battle.initiated = false;
                        }
                    })
                })
            }

            // enemy attacks right here
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                });

                if (emby.health <= 0) {
                    queue.push(() => {
                        emby.faint();
                    });

                    queue.push(() => {
                        // fade back to black
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId);
                                animate();
                                document.querySelector('#userInterface').style.display = 'none';
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                })

                                battle.initiated = false;
                            }
                        })
                    })
                }
            });
        });

        btn.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            document.querySelector('.attackType h1').innerHTML = selectedAttack.type;
            document.querySelector('.attackType h1').style.color = selectedAttack.color;
        });
    });
}
function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach(sprite => {
        sprite.draw();
    })
}

initBattle();
animateBattle();

document.querySelector('#dialogBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        e.currentTarget.style.display = 'none';
    }
})
