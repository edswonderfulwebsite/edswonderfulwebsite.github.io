import { clamp } from './utils.js';

export class Ball{
    constructor(x,y,radius=10){
        this.x=x;this.y=y;this.vx=4;this.vy=-4;
        this.spin=0;this.radius=radius;this.speedMultiplier=1;
    }
    update(players,canvas,effects,audio){
        this.x+=this.vx*this.speedMultiplier+this.spin;
        this.y+=this.vy*this.speedMultiplier;

        // Wall bounce
        if(this.x-this.radius<0||this.x+this.radius>canvas.width){this.vx*=-1;this.spin*=-1;}

        // Paddle collision
        players.forEach(player=>{
            const dx=this.x-player.paddle.x;
            const dz=this.y-player.paddle.z;
            if(Math.abs(dx)<player.paddle.width/2 && Math.abs(dz)<player.paddle.height/2){
                this.vy*=-1;
                const hitY=dx/(player.paddle.width/2);
                const hitZ=dz/(player.paddle.height/2);
                this.spin=hitY*3;
                this.vx+=hitZ*1.5;
                this.speedMultiplier=Math.min(this.speedMultiplier*1.05,1.8);

                effects.spawn(this.x,this.y,10,"orange");
                if(Math.abs(hitY)>0.7){audio.playSmash();}else{audio.playHit();}
            }
        });

        // Clamp speed
        this.vx=clamp(this.vx,-10,10);
        this.vy=clamp(this.vy,-10,10);
    }
    reset(servingPlayer,canvas){this.x=canvas.width/2;this.y=canvas.height/2;this.vx=4*(Math.random()<0.5?1:-1);this.vy=(servingPlayer===0?-4:4);this.spin=0;this.speedMultiplier=1;}
    draw(ctx,sprite){
        ctx.drawImage(sprite,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
    }
}
