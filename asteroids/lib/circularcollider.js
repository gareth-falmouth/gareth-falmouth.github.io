class CircularCollider
{
    /*
        Circular collider - circle based collision detection
     */
    constructor()
    {
        this.position = new Vector2();
        this.radius = 0;
    }
    
    set(position, radius)
    {
        this.setPosition(position);
        this.radius = radius;
    }
    
    setPosition(position)
    {
        this.position.set(position);
    }
    
    /*
        collides(CircularCollider) tests collider for overlap (intersection)
     */
    collides(collider)
    {
        return this.position.distance(collider.position) < (this.radius+collider.radius);
    }
}