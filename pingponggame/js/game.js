import { Ball } from './ball.js';
import { Player } from './player.js';
import { Camera } from './camera.js';
import { ParticleSystem } from './effects.js';
import { AudioManager } from './audio.js';
import { drawUI } from './ui.js';

export class Game{
    constructor(ctx,canvas,assets){
        this.ctx=ctx;this.canvas=canvas;this.assets=assets;
        this.keys={};
        window.addEventListener('keydown',e=>this.keys[e.key]=true);
        window.addEventListener('keyup',e=>this.keys[e.key]=false);

        this.audio=new AudioManager();
        this.effects=new ParticleSystem();

        this.ball=new Ball(canvas.width/2,canvas.height/2);
        this.players=[new Player(canvas.width/2,100,{up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}),
                      new Player(canvas.width/2,500,null,2)];
        this.round=1;
        this.camera=new Camera(canvas.width/2,canvas.height/2);
        this.messages=[];
    }

    update(){
        this.players.forEach(p=>p.update(this.ball,this.canvas,this.keys));
        this.ball.update(this.players,this.canvas,this.effects,this.audio);
        this.effects.update();
        this.camera.update(this.ball);

        // Score check
        if(this.ball.y<0){this.players[1].score++;this.ball.reset(1,this.canvas);this.messages.push({text:"Player 2 Scores!",y:300,lifetime:60,color:'blue'});this.audio.playScore();}
        if(this.ball.y>this.canvas.height){this.players[0].score++;this.ball.reset(0,this.canvas);this.messages.push({text:"Player 1 Scores!",y:300,lifetime:60,color:'green'});this.audio.playScore();}
    }

    render(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.save();
        this.camera.apply(this.ctx,this.canvas);

        this.ctx.drawImage(this.assets.table,0,0,this.canvas.width,this.canvas.height);
        this.players.forEach(p=>p.draw(this.ctx,this.assets.paddle));
        this.ball.draw(this.ctx,this.assets.ball);
        this.effects.draw(this.ctx);

        this.ctx.restore();
        drawUI(this.ctx,this.players,this.round,this.canvas,this.messages);
    }
}
