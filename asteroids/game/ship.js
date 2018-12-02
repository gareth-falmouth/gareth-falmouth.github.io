/**
 * Ship -   Player ship
 */

class Ship extends BaseObject
{
    constructor()
    {
        super();
        
        this.position = new Vector2(GAZCanvas.referenceScreenSize.w / 2, GAZCanvas.referenceScreenSize.h / 2);
        this.velocity = new Vector2(0, 0);
        this.angle = 0;
        
        this.lastShotTime = 0;
        this.invincibleTicker = 0;
        this.displayThrust = false;
        
        this.transform = new Matrix();
        
        //define the ship model as an array of points
        this.shipModel = [new Vector2(0, 20)
            , new Vector2(10, -10)
            , new Vector2(0, -5)
            , new Vector2(-10, -10)];
    }
    
    init()
    {
        super.init();
    
        this.position = new Vector2(GAZCanvas.referenceScreenSize.w / 2, GAZCanvas.referenceScreenSize.h / 2);
        this.velocity = new Vector2(0, 0);
        this.angle = 0;
        this.lastShotTime = 0;
        this.invincibleTicker = 0;
        this.displayThrust = false;
    }
    
    update()
    {
        if (Input.getKeystate(KEYCODE_left_arrow) !== INPUT_NOT_PRESSED)
        {
            this.angle -= 0.1;
        }
        
        if (Input.getKeystate(KEYCODE_right_arrow) !== INPUT_NOT_PRESSED)
        {
            this.angle += 0.1;
        }
        
        
        if (Input.getKeystate(KEYCODE_z) !== INPUT_NOT_PRESSED)
        {
            //handle shooting with cooldown timer (shotInterlockTime)
            if (AstGameInst.frameCount - this.lastShotTime > AstGameInst.shotInterlockTime)
            {
                //mshot will handle multiple shots
                let mshot = 1;
                let i;
                for (i = 0; i < mshot; i++)
                {
                    let b = new Bullet();
                    
                    AstGameInst.bulletList.push(b);
                    
                    let a = this.angle + (i - (mshot / 2)) * 0.1;
                    
                    let m = Matrix.CreateRotationZ(a);
                    
                    let bulletPos = m.TransformVector2(new Vector2(0, 20));
                    bulletPos.x += this.position.x;
                    bulletPos.y += this.position.y;
                    
                    b.init(bulletPos, a);
                }
                
                this.lastShotTime = AstGameInst.frameCount;
            }
        }
        
        let thrust = new Vector2(0, 0);
        let thrusting = false;
        
        
        if (Input.getKeystate(KEYCODE_up_arrow) != 'not_pressed')
        {
            let m = Matrix.CreateRotationZ(this.angle);
            thrust = m.TransformVector2(new Vector2(0, 0.25));
            
            thrusting = true;
        }
        else
        {
            thrusting = false;
        }
        
        /*
            Handle player movement.
            The player has drag applied to it in order to slowly slow it down and the velocity is capped so it doesn't
            go too fast and so that it will come to a stop
         */
        this.velocity.x += thrust.x;
        this.velocity.y += thrust.y;
        
        let drag = new Vector2();
        drag.x = this.velocity.x / -100.0;
        drag.y = this.velocity.y / -100.0;
        
        this.velocity.x += drag.x;
        this.velocity.y += drag.y;
        
        if (this.velocity.length() > 3)
        {
            this.velocity.normalize();
            this.velocity.x *= 3;
            this.velocity.y *= 3;
        }
        else
        {
            if (this.velocity.length() < 0.2)
            {
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }
        
        //wrap the ship around the screen, so if it goes off one edge, it will come back on the other
        if ((this.position.x + this.velocity.x) < 0)
        {
            this.position.x += GAZCanvas.referenceScreenSize.w;
        }
        
        if ((this.position.x + this.velocity.x) > GAZCanvas.referenceScreenSize.w)
        {
            this.position.x -= GAZCanvas.referenceScreenSize.w;
        }
        
        if ((this.position.y + this.velocity.y) < 0)
        {
            this.position.y += GAZCanvas.referenceScreenSize.h;
        }
        
        if ((this.position.y + this.velocity.y) > GAZCanvas.referenceScreenSize.h)
        {
            this.position.y -= GAZCanvas.referenceScreenSize.h;
        }
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        /*
            The ship has a thruster that will flicker on and off while the ship is thrusting. This is done with the
            framecount%5. Doing the === 1 will only turn the thrust on 1/5th of the time
         */
        this.displayThrust = ((thrusting === true) && (AstGameInst.frameCount % 5) === 1);
        
        if (this.isInvincible() === true)
        {
            this.invincibleTicker--;
        }
    
        this.transform = Matrix.Multiply(Matrix.CreateRotationZ(this.angle), Matrix.CreateTranslation(this.position.x, this.position.y, 0));
        
        super.update();
    }
    
    isInvincible()
    {
        return this.invincibleTicker > 0;
    }
    
    draw()
    {
        let drawShip = true;
        
        if (this.invincibleTicker > 0)
        {
            //framecount %30 > 15 will draw the ship for half the time
            drawShip = (AstGameInst.frameCount % 30) > 15;
        }
        
        if (drawShip == true)
        {
            //draw the ship, this works in the same way as the rocks
            let points = this.getLineList();
            let i;
            
            for (i = 0; i < points.length; i+=2)
            {
                GAZCanvas.Line(points[i], points[(i + 1)], '#ffffff',3);
            }
            
            if (this.displayThrust == true)
            {
                //thrust 'diamond' out of the back of the ship
                let thrustLines = [new Vector2(0, -7)
                    , new Vector2(5, -11)
                    , new Vector2(0, -20)
                    , new Vector2(-5, -11)];
                
                
                for (i = 0; i < 4; i++)
                {
                    thrustLines[i] = this.transform.TransformVector2(thrustLines[i]);
                }
                
                let index = [0, 1, 1, 2, 2, 3, 3, 0];
                
                for (i = 0; i < index.length; i += 2)
                {
                    GAZCanvas.Line(thrustLines[index[i]], thrustLines[index[i + 1]], '#ffffff', 3);
                }
            }
        }
        super.draw();
    }
    
    setInvincible()
    {
        this.invincibleTicker = 180;
    }
    
    getLineList()
    {
        let points = [];
        let i;
    
        for (i = 0; i < this.shipModel.length; i++)
        {
            points.push(this.transform.TransformVector2(this.shipModel[i]));
            points.push(this.transform.TransformVector2(this.shipModel[(i+1)%this.shipModel.length]));
        }
        
        return points;
    }
}