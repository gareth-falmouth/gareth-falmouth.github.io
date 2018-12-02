class Size
{
    /*
        Size - Size class (width, height)
     */
    constructor(inW, inH)
    {
        if (inW !== undefined)
        {
            this.w = inW;
            this.h = inH;
        }
        else
        {
            this.w = this.h = 0;
        }
    }
}
