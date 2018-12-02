/*
    StateMachine -  class for standard state machine with init(), update(), draw() & exit() functions
                    Uses StatemachineState as base class for all states
 */
class StateMachineState
{
    constructor()
    {
        this.frameCount = 0;
    }
    
    init()
    {
        this.frameCount = 0;
    }
    
    update()
    {
        this.frameCount++;
    }
    
    draw()
    {
    
    }
    
    exit()
    {
    
    }
}
class StateMachine
{
    constructor()
    {
        this.states = {}
        this.currentState ="";
        this.desiredState ="";
    }
    
    /*
        addState(string name, StateMachineState state)
        
        Add new state to this.states{}, state machine dictionary
        
        Will fail if name in use already
     */
    addState(name, state)
    {
        this.states[name] = state;
    }
    
    /*
        setState(string name)
        
        Request state change at next Statemachine.Update() call
        
        Will fail if name is not in this.states,  i.e. undefined state
     */
    
    setState(name)
    {
        this.desiredState = name;
    }
    
    /*
        update() -  Do logical update on state machine
                    Will do state transition if desired state has been set
    */
    update()
    {
        if(this.desiredState !== "")
        {
            if(this.currentState !== "")
            {
                this.states[this.currentState].exit();
            }
            
            this.currentState = this.desiredState;
            this.desiredState = "";

            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].init();
            }
        }
    
        if(this.currentState !== "")
        {
            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].update();
            }
        }
    }
    
    /*
        draw()
        
        Draw current state
     */
    
    draw()
    {
        if(this.currentState !== "")
        {
            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].draw();
            }
        }
    }
}