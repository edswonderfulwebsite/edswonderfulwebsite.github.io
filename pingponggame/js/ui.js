export function drawUI(ctx,players,round,canvas,messages){
    ctx.fillStyle='black';
    ctx.font='20px Arial';
    ctx.fillText(`Player 1: ${players[0].score}`,20,30);
    ctx.fillText(`Player 2: ${players[1].score}`,canvas.width-140,30);
    ctx.fillText(`Round: ${round}`,canvas.width/2-40,30);

    messages.forEach(msg=>{
        ctx.fillStyle=msg.color||'red';
        ctx.font='30px Arial';
        ctx.fillText(msg.text,canvas.width/2-msg.text.length*7,msg.y);
        msg.y-=1;msg.lifetime--; 
    });
    messages=messages.filter(m=>m.lifetime>0);
}
