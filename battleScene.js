const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImage
})

const draggle = new Monster(monsters.Draggle);
const emby = new Monster(monsters.Emby);

emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.innerHTML = attack.name;
    document.querySelector('.attacks').append(button);
})

const renderedSprites = [draggle, emby];

function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach(sprite => {
        sprite.draw();
    })
}

animateBattle();

const queue = [];

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
            return;
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
            }
        });
    });

    btn.addEventListener('mouseenter', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        document.querySelector('.attackType h1').innerHTML = selectedAttack.type;
        document.querySelector('.attackType h1').style.color = selectedAttack.color;
    });
});

document.querySelector('#dialogBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        e.currentTarget.style.display = 'none';
    }
})
