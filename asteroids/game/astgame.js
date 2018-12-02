/**
 * AstGame
 *          Main global class for Asteroids Game
 *
 *          Implemented as global object AstGameInst (like a singleton)
 */
 
class AstGame
{
    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();
        this.ship = new Ship();
        this.explosionManager = new ExplosionManager();
        
        //Array of current rocks
        
        this.rockList = [];
        
        //array of current bullets
        this.bulletList = [];
        
        this.score = 0;
        this.ships = 0;
        
        this.shotInterlockTime = 30;
    }
    
    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600,900);
        
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.addState(GameState_Attract.label(), new GameState_Attract());
        this.stateMachine.addState(GameState_StartGame.label(), new GameState_StartGame());
        this.stateMachine.addState(GameState_CreateWave.label(), new GameState_CreateWave());
        this.stateMachine.addState(GameState_PlaceShip.label(), new GameState_PlaceShip());
        this.stateMachine.addState(GameState_Play.label(), new GameState_Play());
        this.stateMachine.addState(GameState_EndOfWave.label(), new GameState_EndOfWave());
        this.stateMachine.addState(GameState_GameOver.label(), new GameState_GameOver());
    
        this.stateMachine.setState(GameState_Attract.label());
    }
    
    createRocks()
    {
        /*
            populate the rocklist with an initial set of big rocks at the beginning of a level
         */
        
        this.rockList = [];
        let rock = new Rock();
        rock.init(new Vector2(100, 0), 'big', new Vector2(0, -1));
        this.rockList.push(rock);
    
        rock = new Rock();
        rock.init(new Vector2(500, 0), 'big', new Vector2(0, 1));
        this.rockList.push(rock);
    
        rock = new Rock();
        rock.init(new Vector2(1000, 0), 'big', new Vector2(0, -1));
        this.rockList.push(rock);
    
        rock = new Rock();
        rock.init(new Vector2(1500, 0), 'big', new Vector2(0, 1));
        this.rockList.push(rock);
    }
    
    resetScore()
    {
        this.score = 0;
        this.ships = 3;
    }
    
    placeShip()
    {
        this.ship.init();
        this.ship.active = true;
        this.ship.setInvincible();
    }
    
    explodeRock(rock)
    {
        this.explosionManager.add(rock);
        rock.active = false;
        
        if(rock.size ==='big')
        {
            let i;
            for(i=0;i<7;i++)
            {
                let newRock = new Rock();
                this.rockList.push(newRock);
                newRock.initFromRock(rock);
            }
            
            this.score+=10;
        }
    
        if(rock.size ==='med')
        {
            let i;
            for(i=0;i<5;i++)
            {
                let newRock = new Rock();
                this.rockList.push(newRock);
                newRock.initFromRock(rock);
            }
    
            this.score+=50;
        }
    
        if(rock.size ==='sml')
        {
            this.score+=100;
        }
    }

    update()
    {
        /*
            do collisions
            First, collision test all the rocks against all the bullets.
            If a rock collides with a bullet, explode the rock and make the bullet in active so it doesn't hit multiple
            rocks.
            
            explodeRock will create more rocks and add them to the end of the rocklist. JavaScript, unlike C# or STL
            allows you to extend arrays whilst iterating through them.
            
            Second, collide what's left of the active rocks against the ship. Rocks will only be considered if they are
            'active'.
         */
    
        for(let i=0; i<this.rockList.length;i++)
        {
            if(this.rockList[i].active === true)
            {
                // has hit bullet?
                let bullet=0;
                for(bullet=0;bullet<this.bulletList.length;bullet++)
                {
                    if( (this.bulletList[bullet].active === true)
                      &&(this.rockList[i].active === true)
                    )
                    {
                        if(this.bulletList[bullet].collides(this.rockList[i]) === true)
                        {
                            this.explodeRock(this.rockList[i]);
                            this.bulletList[bullet].active = false;
                        }
                    }
                }
            }
    
            if( (this.rockList[i].active === true)
                &&(this.ship.active === true)
                &&(this.ship.isInvincible() === false)
            )
            {
                if(this.ship.collides(this.rockList[i]) === true)
                {
                    this.explodeRock(this.rockList[i]);
                    
                    this.explosionManager.add(this.ship);
                    this.ship.active = false;
                    this.ships--;
                }
            }
        }
        
        //do updates
        
        if(this.ship.active === true)
        {
            this.ship.update();
        }
        
        this.bulletList.forEach(function(element)
        {
            element.update();
        });
    
        this.rockList.forEach(function(element)
        {
            element.update();
        });
        
        /*
            Update the rock and bullet lists.
            
            To do this, go through the current list and copy items to the newlist if they are active.
            Then assign the newlist back to the src bullet or rock list
         */
    
        let newlist = [];
        
        for(let i=0; i<this.bulletList.length;i++)
        {
            if(this.bulletList[i].active === true)
            {
                newlist.push(this.bulletList[i]);
            }
        }
        
        this.bulletList = newlist;
    
        newlist = [];
    
        for(let i=0; i<this.rockList.length;i++)
        {
            if(this.rockList[i].active === true)
            {
                newlist.push(this.rockList[i]);
            }
        }
    
        this.rockList = newlist;
    
        //update explosions
        this.explosionManager.update();
    }

    draw()
    {
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');
    
        this.explosionManager.draw();
    
        if(this.ship.active === true)
        {
            this.ship.draw();
        }
        
        this.rockList.forEach(function(element)
        {
            element.draw();
        });
    
        this.bulletList.forEach(function(element)
        {
            element.draw();
        });
        
        if(this.stateMachine.currentState !== GameState_Attract.label())
        {
            GAZCanvas.Text(30, this.score.toLocaleString('en-gb'),new Vector2(200,30),'#ffffff','right','Archivo Black');
            GAZCanvas.Text(30, "A:"+this.ships,new Vector2(200,60),'#ffffff','right','Archivo Black');
        }
    }

    /*
        Run() - Game for asteroids
     */
    
    
    Run()
    {
        //do oneTimeInit once
        
        AstGameInst.oneTimeInit();
        
        setInterval(function()
        {
            //on each frame ...
            
            /*
                GAZCanvas.update() -    this does the reactive canvas functionality
                                        and needs to be called at the beginning of each
                                        update()
             */
            GAZCanvas.update();
            
            /*
                Input.update() -    Update system inputs (mouse, keyboard).
                                    Needs to be called each frame
             */
            Input.update();
            
            AstGameInst.frameCount+= 1;
            
            //do state machine update
            AstGameInst.stateMachine.update();
            
            //clear screen for drawing
            let letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            //do state machine draw
            AstGameInst.stateMachine.draw();
    
            //draw the letterbox over the screen to hide any overdraw
            GAZCanvas.drawLetterbox(letterboxColour);
        },17);
    }
}

AstGameInst = new AstGame();