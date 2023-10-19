const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 16 : 9 비율
canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
