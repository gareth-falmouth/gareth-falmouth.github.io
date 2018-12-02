class Vector2
{
    /*
        Vector2 - Standard Vector2 class
     */
    constructor(x,y)
    {
        this.x = 0;
        this.y = 0;

        if(x != undefined)
        {
            this.x = x;
        }

        if(y != undefined)
        {
            this.y = y;
        }
    }

    set(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
    }
    
    clone()
    {
        return new Vector2(this.x,this.y);
    }

    normalize()
    {
        var length = this.length();

        this.x/= length;
        this.y/= length;
    }

    distance(v0)
    {
        return Math.sqrt(Math.pow(this.x-v0.x,2) + Math.pow(this.y-v0.y,2));
    }
    length()
    {
        return Math.sqrt((this.x*this.x) + (this.y*this.y));
    }

    static normal(vec)
    {
        var result = new Vector2(refIn);

        result.normalize();

        return result;
    }

    static Dot(v0,v1)
    {
        return (v0.x * v1.x) + (v0.y * v1.y);
    }
    
    toString()
    {
        return ""+this.x.toFixed(2)+ ":" + this.y.toFixed(2);
    }
}