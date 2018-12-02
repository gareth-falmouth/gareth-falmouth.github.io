class Vector3
{
    /*
        Vector3 - Standard Vector3 class
     */
    
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    Set(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }

    Normalize()
    {
        var length = Length();

        this.x/= length;
        this.y/= length;
        this.z/= length;
    }

    Length()
    {
        return Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z*this.z));
    }

    static Normal(vec)
    {
        var result = new Vector3(refIn);

        result.Normalize();

        return result;
    }

    static Cross(v0,v1)
    {
        var result = new Vector3();

        result.x = v0.y * v1.z - v0.z * v1.y;
        result.y = v0.z * v1.x - v0.x * v1.z;
        result.z = v0.x * v1.y - v0.y * v1.x;

        return result;
    }

    static Dot(v0,v1)
    {
        return (v0.x * v1.x) + (v0.y * v1.y) + (v0.z * v1.z);
    }
}