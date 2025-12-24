export class Paddle{
    constructor(x,z,width=60,height=20){this.x=x;this.z=z;this.width=width;this.height=height;}
    move(dx,dz,canvas){
        this.x+=dx;this.z+=dz;
        this.x=Math.max(this.width/2,Math.min(canvas.width-this.width/2,this.x));
        this.z=Math.max(this.height/2,Math.min(canvas.height-this.height/2,this.z));
    }
    draw(ctx,sprite){ctx.drawImage(sprite,this.x-this.width/2,this.z-this.height/2,this.width,this.height);}
}
