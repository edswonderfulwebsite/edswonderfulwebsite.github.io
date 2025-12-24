export class Particle{
    constructor(x,y,vx,vy,lifetime,color){
        this.x=x;this.y=y;this.vx=vx;this.vy=vy;
        this.lifetime=lifetime;this.age=0;this.color=color;
    }
    update(){this.x+=this.vx;this.y+=this.vy;this.age++;}
    draw(ctx){ctx.fillStyle=this.color;ctx.fillRect(this.x,this.y,2,2);}
    isDead(){return this.age>=this.lifetime;}
}

export class ParticleSystem{
    constructor(){this.particles=[];}
    spawn(x,y,count,color){for(let i=0;i<count;i++){this.particles.push(new Particle(x,y,(Math.random()-0.5)*4,(Math.random()-0.5)*4,30,color));}}
    update(){this.particles=this.particles.filter(p=>{p.update();return!p.isDead();});}
    draw(ctx){this.particles.forEach(p=>p.draw(ctx));}
}
