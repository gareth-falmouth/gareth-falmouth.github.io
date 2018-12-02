/*
    ExplosionManager & ExplosionPrim
    
    ExplosionManager -  This class handles all the explosions from rocks and ships.
                        On Death, an object is added to the manager with add(GameObject), this will use the getLineList()
                        to extract all the drawing lines from that object. Each line creates an ExplosionPrim that will
                        handle the line's explosion.
                        
                        The update() & draw() functions will manage all the ExplosionPrims currently active in the 
                        system.
                        
    ExplosionPrim   -   This class handles the lifetime of each line in the ExplosionManager.
                        On initialisation, a line is converted into an EP, with a position that is the centre of the line
                        and two vectors (v0 &v1) that are the ends of the line.
                        
                        Update() will spin the line and move it away from the centre of its parent object. There's a 
                        lifetime counter, so the prims will decay and eventually die over time.
      
 */

class ExplosionPrim extends BaseObject
{
    constructor()
    {
        super();
        this.v0 = new Vector2();
        this.v1 = new Vector2();
        this.lifespan = 0;
        this.tick = 0;
    }
    
    init(centre, v0,v1)
    {
        this.v0 = v0;
        this.v1 = v1;
        
        //work out mid point of source line 
        this.position.x = this.v0.x +(this.v1.x - this.v0.x) / 2.0;
        this.position.y = this.v0.y +(this.v1.y - this.v0.y) / 2.0;
    
        //remap v0 & v1 to be offsets from line mid point so they will rotate nicely
        this.v0.x -= this.position.x;
        this.v0.y -= this.position.y;
    
        this.v1.x -= this.position.x;
        this.v1.y -= this.position.y;
    
        this.velocity.x = this.position.x - centre.x;
        this.velocity.y = this.position.y - centre.y;
        this.velocity.normalize();
        
        //apply random movement speed, lifespan and rotation to prim
        let speed = 0.5 + Math.random()*2;
        this.velocity.x *= speed;
        this.velocity.y *= speed;
        
        this.lifespan = (3*60) +5*(Math.random()*60);
        this.tick = 0;
        this.active = true;
    
        this.rotation = 0;
        this.rotationStep = 5 + Math.random()*20;
        this.rotationStep = (this.rotationStep-12);
    }
    
    update()
    {
        if(this.active === false)    return;
        
        //move object in world
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        this.tick++;
        
        this.active = this.tick < this.lifespan;
    
        //test to see if prim is off-screen and kill if so 
        if((this.position.x + this.velocity.x) < 0)
        {
            this.active = false;
        }
    
        if((this.position.x + this.velocity.x) > GAZCanvas.referenceScreenSize.w)
        {
            this.active = false;
        }
    
        if((this.position.y + this.velocity.y) < 0)
        {
            this.active = false;
        }
    
        if((this.position.y + this.velocity.y) > GAZCanvas.referenceScreenSize.h)
        {
            this.active = false;
        }
        
        this.rotation += this.rotationStep;
    }
    
    draw()
    {
        //multiply v0 & v1 by position & rotation to put in world space
        let a = 1.0 - this.tick/this.lifespan;
        let m = Matrix.Multiply( Matrix.CreateRotationZ((this.rotation*Math.PI)/180),Matrix.CreateTranslation(this.position.x,this.position.y,0) );
        let v0 = m.TransformVector2(this.v0);
        let v1 = m.TransformVector2(this.v1);
    
        //draw line & set colour values to mimic lifespan from 1.0 -> 0.0 over time
        let aa = (1.0 - (this.tick/this.lifespan))*255;
        let col = 'rgb(' +Math.floor(aa)+','+Math.floor(aa)+','+Math.floor(aa)+')';
        GAZCanvas.Line(v0,v1,col,3);
    }
}
class ExplosionManager
{
    constructor()
    {
        this.objectList = [];
    }
    
    clear()
    {
        this.objectList = [];
    }
    
    /*
        add(BaseObject src) -   Add a base object to the Explosion Manager
                                
                                For each vert pair in the line list, add a new ExplosionPrim with the src's position to
                                calculate escape vectors nicely
     */
    add(src)
    {
        let i=0;
        
        let vertList = src.getLineList();
        
        for(i=0;i<vertList.length/2;i++)
        {
            let obj = new ExplosionPrim();
            obj.init(src.position,vertList[(i*2)+0],vertList[(i*2)+1]);
            this.objectList.push(obj);
        }
    }
    
    update()
    {
        let i=0;
        let newlist = [];
        
        /*
            Go through all the prims in the object list and update. if a prim is 'dead' (active === false) then remove
            it from the active list.
         */
    
        for(i=0; i<this.objectList.length;i++)
        {
            this.objectList[i].update();
            
            if(this.objectList[i].active === true)
            {
                newlist.push(this.objectList[i]);
            }
        }
    
        this.objectList = newlist;
    
    }
    
    draw()
    {
        this.objectList.forEach(function(element)
        {
            element.draw();
        });
    }
}
