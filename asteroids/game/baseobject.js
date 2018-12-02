class BaseObject extends CircularCollider
{
    /*
        BaseObject -    Effective ABC for game objects (ship, rocks and bullets)
                        Manages position & velocity as well as collisions.
                        
                        Collisions are implemented through CircularCollider, so everything is a circle
                        and the BaseObject class is derived from a CircularCollider
                        
                        The ship and rock classes use lineLists to draw themselves (for explosions), so there is the
                        getLineList() function that will return a line list.
                        Bullets aren't drawn this way, so they don't implement anything for this
     */
    constructor()
    {
        super();
        
        this.active = false;
        this.velocity = new Vector2();
    }
    
    /*
        empty functions for derived classes to implement.
        I could add throw 'Undefined function' as the implementation for these functions if I wanted
        to ensure that they would have real implementations in the derived classes
     */
    init()
    {
    
    }
    
    update()
    {
    }
    
    draw()
    {
    
    }
    
    getLineList()
    {
    
    }
}
