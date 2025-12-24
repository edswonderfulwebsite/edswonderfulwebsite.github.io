import { Game } from './game.js';

const canvas=document.getElementById('gameCanvas');
canvas.width=800;canvas.height=600;
const ctx=canvas.getContext('2d');

const assets={
    paddle:new Image(),
    ball:new Image(),
    table:new Image()
};
assets.paddle.src='assets/paddle_placeholder.png';
assets.ball.src='assets/ball_placeholder.png';
assets.table.src='assets/table_placeholder.png';

const game=new Game(ctx,canvas,assets);

function loop(){game.update();game.render();requestAnimationFrame(loop);}
loop();
