import { Paddle } from './paddle.js';
import { lerp,randomRange } from './utils.js';

export class Player{
    constructor(x,z,keys=null,aiLevel=0){
        this.paddle=new Paddle(x,z);this.keys=keys;this.score=0;this.aiLevel=aiLevel;
        this.reaction=0;
    }
    update(ball,canvas,keys){
        if(this.keys){
            if(keys[this.keys.left])this.paddle.move(-5,0,canvas);
            if(keys[this.keys.right])this.paddle.move(5,0,canvas);
            if(keys[this.keys.up])this.paddle.move(0,-5,canvas);
            if(keys[this.keys.down])this.paddle.move(0,5,canvas);
        }else{
            let error=0;
            switch(this.aiLevel){case 1:error=30;break;case 2:error=15;break;case 3:error=5;break;}
            this.reaction+=1;
            if(this.reaction%3===0){
                const targetX=lerp(this.paddle.x,ball.x+(Math.random()-0.5)*error,0.05);
                const targetZ=lerp(this.paddle.z,ball.y+(Math.random()-0.5)*error,0.05);
                this.paddle.x=targetX;this.paddle.z=targetZ;
            }
        }
    }
    draw(ctx,sprite){this.paddle.draw(ctx,sprite);}
}
