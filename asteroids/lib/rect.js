/**
 * Created by gareth on 04/06/2018.
 */

class Rect
{
    /*
        Rect - 2D rectangle of x,y,width & height
     */
    constructor(x,y,w,h)
    {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;

        if(x != undefined)
        {
            this.x = x;
        }

        if(y != undefined)
        {
            this.y = y;
        }

        if(w != undefined)
        {
            this.w = w;
        }

        if(h != undefined)
        {
            this.h = h;
        }
    }
    
    set(x,y,w,h)
    {
        if(x != undefined)
        {
            this.x = x;
        }
        
        if(y != undefined)
        {
            this.y = y;
        }
        
        if(w != undefined)
        {
            this.w = w;
        }
        
        if(h != undefined)
        {
            this.h = h;
        }
    }
    
    /*
        isInMe(Vector2 inVal)
        
        is Vector2 inVal inside rectangle
    */
    isInMe(inVal)
    {
        if(inVal !== undefined)
        {
            if( (inVal.x >= this.x) && (inVal.x < (this.x + this.w)) && (inVal.y >= this.y) && (inVal.y < (this.y + this.h)) )
            {
                return true;
            }
        }
        
        return false;
    }
    
    getCentre()
    {
        return new Vector2(this.x+(this.w/2),this.y+(this.h/2));
    }
}
