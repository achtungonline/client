export default function ScaledCanvasContext(context, scale) {
    return {
        rect: (x,y,w,h) => context.rect(scale*x, scale*y, scale*w, scale*h),
        clearRect: (x,y,w,h) => context.clearRect(scale*x, scale*y, scale*w, scale*h),
        fillRect: (x,y,w,h) => context.fillRect(scale*x, scale*y, scale*w, scale*h),
        arc: (x,y,r,a,b,c) => context.arc(scale*x, scale*y, scale*r, a, b, c),
        drawImage: (i,x,y,w,h) => context.drawImage(i, scale*x, scale*y, scale*w, scale*h),
        fillText: (t,x,y) => context.fillText(t, scale*x, scale*y),
        moveTo: (x,y) => context.moveTo(scale*x, scale*y),
        lineTo: (x,y) => context.lineTo(scale*x, scale*y),
        translate: (x,y) => context.translate(scale*x, scale*y)
    };
};