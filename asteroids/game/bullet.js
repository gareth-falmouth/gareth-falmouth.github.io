class Bullet extends BaseObject
{
    /*
        Bullet -    ship bullets
                    Bullets are realised as rectangle rather than line lists and will be recycled once they have gone
                    off the edge of the screen.
     */
    constructor()
    {
        super();
    }
    
    init(position, direction)
    {
        this.active = true;
        
        var m = Matrix.CreateRotationZ(direction);
        this.velocity = m.TransformVector2(new Vector2(0,7));
        
        this.set(position,3)
    }
    
    update()
    {
        if(this.active == false)
        {
            return;
        }
        
        if( ((this.position.x + this.velocity.x) < 0)
            ||((this.position.x + this.velocity.x) > GAZCanvas.referenceScreenSize.w)
        )
        {
            this.active = false;
            return;
        }
        
        if( ((this.position.y + this.velocity.y) < 0)
            ||((this.position.y + this.velocity.y) > GAZCanvas.referenceScreenSize.h)
        )
        {
            this.active = false;
            return;
        }
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        super.update();
    }
    
    draw()
    {
        if(this.active == false)
        {
            return;
        }
        GAZCanvas.Rect(new Rect(this.position.x-2,this.position.y-2,4,4),'#ffffff');
        super.draw();
    }
}
