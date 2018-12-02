/*
    Rock -  Asteroids class
    
            This class implements individual rocks and they are managed in AstGame as an array of Rocks
            
            The xx_LineData arrays below are used to store the line lists for each rocksize. They are effectively
            global data. They are populated when the game first starts to create line lists for the three rock sizes.
            These lists are used to draw the different sized rocks so that they look identical.
 */
let bigRock_LineData = [];
let medRock_LineData = [];
let smlRock_LineData = [];

class Rock extends BaseObject
{
    constructor()
    {
        super();
        
        if(bigRock_LineData.length === 0)
        {
            /*
                If the rock geometry has not been set up yet, set it up.
                This is lazy construction, but easier to manage than adding a static oneTimeInit() method to the class
             */
            let rockAngle = 0;
    
            let i;
            let segCount = 20;
    
    
            for (i = 0; i < segCount; i++)
            {
                let m = Matrix.CreateRotationZ( (Math.PI*2*i)/segCount);
                bigRock_LineData.push(m.TransformVector2(new Vector2(0, (this.getMinSize('big') + (Math.random() * 20)))));
            }
    
            segCount = 16;
            for (i = 0; i < segCount; i++)
            {
                let m = Matrix.CreateRotationZ( (Math.PI*2*i)/segCount);
                medRock_LineData.push(m.TransformVector2(new Vector2(0, (this.getMinSize('med') + (Math.random() *  10)))));
            }
    
            segCount = 8;
            for (i = 0; i < segCount; i++)
            {
                let m = Matrix.CreateRotationZ( (Math.PI*2*i)/segCount);
                smlRock_LineData.push(m.TransformVector2(new Vector2(0, (this.getMinSize('sml') + (Math.random() *  5)))));
            }
        }
        
        this.size = '';
        this.angle = 0;
    }
    
    getMinSize(size)
    {
        if(size === 'big')
        {
            return 60;
        }
        
        if(size ==='med')
        {
            return 20;
        }
        
        if(size === 'sml')
        {
            return 10;
        }
    }
    
    init(position, size, direction)
    {
        this.active = true;
        
        this.position.set(position);
        this.velocity.set(direction);
        this.size = size;
        this.angle = Math.random() * (Math.PI * 2);
    
        
        if(this.size === 'big')
        {
            this.set(this.position,80);
        }
    
        if(this.size === 'med')
        {
            this.set(this.position,30);
        }
    
        if(this.size === 'sml')
        {
            this.set(this.position,15);
        }
    }
    
    /*
        getRandomPointInRock() -    When a rock is hit and explodes, creating all the new rocks on the same point as the
                                    current rock's position looks naff. Taking random points within the current rock's
                                    area looks a lot nicer.
     */
    getRandomPointInRock()
    {
        let pos = Matrix.CreateRotationZ(Math.random()*Math.PI*2).TransformVector2(new Vector2(0, 10+ Math.random() * (this.getMinSize(this.size)-10)));
        pos.x += this.position.x;
        pos.y += this.position.y;
        
        return pos;
    }
    
    /*
        initFromRock(rock) -    This is called when a rock is exploded and will generate the correct 'child' rock from
                                the exploding parent
     */
    initFromRock(rock)
    {
        let maxSpeed = 1;
        if(rock.size === 'big')
        {
            this.size = 'med';
            maxSpeed = 1.5;
        }
    
        if(rock.size === 'med')
        {
            this.size = 'sml';
            maxSpeed = 3;
        }
        
        this.init(rock.getRandomPointInRock(),this.size,rock.velocity);
    
        let angle = Math.random() * Math.PI*2;
        this.velocity = Matrix.CreateRotationZ(angle).TransformVector2(new Vector2((Math.random()+0.25)*maxSpeed,0));
    }
    
    
    update()
    {
        if(this.active === false)    return;
        
        this.angle += 0.01;
    
        if((this.position.x + this.velocity.x) < 0)
        {
            this.position.x += GAZCanvas.referenceScreenSize.w;
        }
    
        if((this.position.x + this.velocity.x) > GAZCanvas.referenceScreenSize.w)
        {
            this.position.x -= GAZCanvas.referenceScreenSize.w;
        }
    
        if((this.position.y + this.velocity.y) < 0)
        {
            this.position.y += GAZCanvas.referenceScreenSize.h;
        }
        
        if((this.position.y + this.velocity.y) > GAZCanvas.referenceScreenSize.h)
        {
            this.position.y -= GAZCanvas.referenceScreenSize.h;
        }
    
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        super.update();
    }
    
    draw()
    {
        if(this.active === false)    return;
    
        let points = this.getLineList();
        let i;
        for ( i = 0; i < points.length; i+=2)
        {
            GAZCanvas.Line(points[i], points[(i + 1)], '#ffffff',3);
        }
        
        super.draw();
    }
    
    /*
        getLineList() - This function takes the reference linedata for a rock and transforms it by the rock's position &
                        rotation to put the data into the correct world space.
                        The points[] returned is a collection of lines (A,B), (B,C), (C,A) which is used by the line
                        drawing code. The player ship uses a similar approach
     */
    getLineList()
    {
        let m = Matrix.Multiply(Matrix.CreateRotationZ(this.angle),Matrix.CreateTranslation(this.position.x,this.position.y,0));
        let points = [];
        let i;
        
        if(this.size === 'big')
        {
            for (i = 0; i < bigRock_LineData.length; i++)
            {
                points.push(m.TransformVector2(bigRock_LineData[i]));
                points.push(m.TransformVector2(bigRock_LineData[(i+1)%bigRock_LineData.length]));
            }
        }
    
        if(this.size === 'med')
        {
            for (i = 0; i < medRock_LineData.length; i++)
            {
                points.push(m.TransformVector2(medRock_LineData[i]));
                points.push(m.TransformVector2(medRock_LineData[(i+1)%medRock_LineData.length]));
            }
        }
    
        if(this.size === 'sml')
        {
            for (i = 0; i < smlRock_LineData.length; i++)
            {
                points.push(m.TransformVector2(smlRock_LineData[i]));
                points.push(m.TransformVector2(smlRock_LineData[(i+1)%smlRock_LineData.length]));
            }
        }
        
        return points;
    }
}
