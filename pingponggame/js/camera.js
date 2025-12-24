import { lerp } from './utils.js';

export class Camera{
    constructor(x,y,scale=1){this.x=x;this.y=y;this.scale=scale;this.shakeX=0;this.shakeY=0;}
    update(ball){
        this.x=lerp(this.x,ball.x,0.05);
        this.y=lerp(this.y,ball.y,0.05);
        const distance=Math.abs(ball.y-300);
        this.scale=lerp(this.scale,1+distance/1000,0.05);

        // Camera shake on fast ball
        if(Math.abs(ball.vy)>6){this.shakeX=(Math.random()-0.5)*5;this.shakeY=(Math.random()-0.5)*5;}
        else{this.shakeX=lerp(this.shakeX,0,0.1);this.shakeY=lerp(this.shakeY,0,0.1);}
    }
    apply(ctx,canvas){
        ctx.translate(canvas.width/2-this.x+this.shakeX,canvas.height/2-this.y+this.shakeY);
        ctx.scale(this.scale,this.scale);
    }
}
