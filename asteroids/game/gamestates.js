//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_Test extends StateMachineState
{
    static label()
    {
        return "GameState_Test";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update()
    }
    
    draw()
    {
        super.draw()
    
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');
        GAZCanvas.Text(32,"Hello: "+AstGameInst.frameCount,new Vector2(50,50),'#ffffff','left');
    
        if(Input.mouseLogicalPos !== undefined)
        {
            var modelRect = new Rect();
            modelRect.set(Input.mouseLogicalPos.x-5,Input.mouseLogicalPos.y-5,10,10);
            GAZCanvas.Rect(modelRect,"0x0000ff");
        
            var p = new Vector2();
            p.Set(Input.mouseLogicalPos);
            p.y -= 10;
            GAZCanvas.Text(12, Input.mouseLogicalPos.toString(), p, "#ffffff", 'left');
        }
    
        GAZCanvas.Text(32,"A: "+Input.getKeystate(65),new Vector2(50,150),'#ffffff','left');
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************

class GameState_Attract extends StateMachineState
{
    static label()
    {
        return "GameState_Attract";
    }
    
    constructor()
    {
        super();
        this.testRect = new Rect(800-200,450-100,400,200);
    }
    
    init()
    {
        super.init();
        AstGameInst.ship.init();
        AstGameInst.ship.active = false;
    
        AstGameInst.createRocks();
        AstGameInst.resetScore();
        AstGameInst.explosionManager.clear();
    }
    
    update()
    {
        super.update();
        
        if(Input.getKeystate(KEYCODE_space_bar) == 'pressed')
        {
            AstGameInst.stateMachine.setState(GameState_StartGame.label());
        }
        else
        {
            AstGameInst.update();
        }
        
    }
    
    draw()
    {
        super.draw()
    
        AstGameInst.draw();
        
        GAZCanvas.Rect(this.testRect,'rgb(255,255,255)');
        GAZCanvas.Rect(new Rect(this.testRect.x+5, this.testRect.y+5, this.testRect.w-10,this.testRect.h-10),'rgb(0,0,0)');

        GAZCanvas.Text(160, "ASTEROIDS",new Vector2(1600/2,100),'#ffffff','center','Archivo Black');
    
        GAZCanvas.Text(30, "LEFT - rotate left",new Vector2(800,395),'#ffffff','center','Archivo Black');
        GAZCanvas.Text(30, "RIGHT - rotate right",new Vector2(800,430),'#ffffff','center','Archivo Black');
        GAZCanvas.Text(30, "UP - thrust",new Vector2(800,465),'#ffffff','center','Archivo Black');
        GAZCanvas.Text(30, "Z - shoot",new Vector2(800,500),'#ffffff','center','Archivo Black');
        
        if(AstGameInst.frameCount%30 > 15)
        {
            GAZCanvas.Text(40, "Press SPACE to play",new Vector2(1600/2,875),'#ffffff','center','Archivo Black');
        }
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************

class GameState_StartGame extends StateMachineState
{
    static label()
    {
        return "GameState_StartGame";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update();
        AstGameInst.stateMachine.setState(GameState_CreateWave.label());
    }
    
    draw()
    {
        super.draw();
        AstGameInst.draw();
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************

class GameState_CreateWave extends StateMachineState
{
    static label()
    {
        return "GameState_CreateWave";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init();
        AstGameInst.createRocks();
    }
    
    update()
    {
        super.update();
        
        if(AstGameInst.ship.active === false)
        {
            AstGameInst.stateMachine.setState(GameState_PlaceShip.label());
        }
        else
        {
            AstGameInst.stateMachine.setState(GameState_Play.label());
        }
        
    }
    
    draw()
    {
        super.draw();
        AstGameInst.draw();
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************

class GameState_PlaceShip extends StateMachineState
{
    static label()
    {
        return "GameState_PlaceShip";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update();
        
        if(this.frameCount > 60)
        {
            AstGameInst.placeShip();
            AstGameInst.stateMachine.setState(GameState_Play.label());
            AstGameInst.ship.setInvincible();
        }
    
        AstGameInst.update();
    }
    
    draw()
    {
        super.draw();
        AstGameInst.draw();
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************

class GameState_Play extends StateMachineState
{
    static label()
    {
        return "GameState_Play";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update();
    
        AstGameInst.update();
    
        if(AstGameInst.rockList.length === 0)
        {
            AstGameInst.stateMachine.setState(GameState_EndOfWave.label());
        }
        else
        {
            if(AstGameInst.ship.active === false)
            {
                if(AstGameInst.ships > 0)
                {
                    AstGameInst.stateMachine.setState(GameState_PlaceShip.label());
                }
            else
                {
                    AstGameInst.stateMachine.setState(GameState_GameOver.label());
                }
            }
        }
    }
    
    draw()
    {
        super.draw();
        AstGameInst.draw();
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************

class GameState_EndOfWave extends StateMachineState
{
    static label()
    {
        return "GameState_EndOfWave";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init();
        AstGameInst.createRocks();
    }
    
    update()
    {
        super.update();
        AstGameInst.stateMachine.setState(GameState_Play.label());
        AstGameInst.update();
    }
    
    draw()
    {
        super.draw();
        AstGameInst.draw();
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************

class GameState_GameOver extends StateMachineState
{
    static label()
    {
        return "GameState_GameOver";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update();
    
        if(this.frameCount > (8*30) )
        {
            AstGameInst.stateMachine.setState(GameState_Attract.label());
        }
    else
        {
            AstGameInst.update();
        }
    }
    
    draw()
    {
        super.draw();
        AstGameInst.draw();
    
        if(this.frameCount > (2*30))
        {
            GAZCanvas.Text(160,"GAME", new Vector2(800,300),'#ffffff','center','Archivo Black');
            GAZCanvas.Text(160,"OVER", new Vector2(800,450),'#ffffff','center','Archivo Black');
        }
    }
}
//*********************************************************************************************************************
//
//*********************************************************************************************************************
