const INPUT_NOT_PRESSED = 'not_pressed';
const INPUT_PRESSED = 'pressed';
const INPUT_HELD = 'held';
const INPUT_RELEASED = 'released';

class InputClass
{
    /*
        This is my wrapper for resolution-independent input functionality.
        
        It assumes GAZCanvas is defined (gazcanvas.js)
        
        Usage:
            Provides user input (keyboard & mouse) with resolution dependent mouse positions based on GAZCanvas
            (see GAZCanvas).
            
            Input devices will return INPUT_NOT_PRESSED, INPUT_PRESSED, INPUT_HELD & INPUT_RELEASED
            
            Mouse will return off screen when pointer is outside of GAZCanvas space
            
            call Input.upate() per frame
            
            Input.getKeystate(key) where key is defined in input_keycode.js
        
        see:
        
     */
    
    constructor()
    {
        this.mouseLogicalPos = new Vector2();
        this.mouseAbsolutePos = new Vector2();
    
        this.currentKeyState = new Array(256);
        this.oldKeyState = new Array(256);
        this.rawKeyState = new Array(256);
        
        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = INPUT_NOT_PRESSED;
            this.oldKeyState[i] = this.currentKeyState[i];
            this.rawKeyState[i] = '';
        }
        
        this.mouseRawState = '';
        this.currentMouseState = INPUT_NOT_PRESSED;
        this.oldMouseState = this.currentMouseState;
    }
    
    // Callbacks for EventListeners
    
    onMouseMove(event)
    {
        Input.mouseLogicalPos = Input.getMousePos(event);
    }
    
    onMouseDown(event)
    {
        Input.mouseDown = true;
        Input.mouseLogicalPos = Input.getMousePos(event);
    
        Input.mouseRawState = 'down';
    }
    
    onMouseUp(event)
    {
        Input.mouseDown = false;
        Input.mouseLogicalPos = Input.getMousePos(event);
    
        Input.mouseRawState = 'up';
    }
    
    onKeyDown(event)
    {
        Input.rawKeyState[event.keyCode] = 'down';
    }
    
    onKeyUp(event)
    {
        Input.rawKeyState[event.keyCode] = 'up';
    }
    
    getMousePos(event)
    {
        let rawMousePos = new Vector2(event.pageX, event.pageY);
    
        this.mouseAbsolutePos.set(rawMousePos);
    
        let screenRect = new Rect();
        screenRect.set(0,0,GAZCanvas.referenceScreenSize.w,GAZCanvas.referenceScreenSize.h);
        screenRect = GAZCanvas.toScreenSpace(screenRect);
    
        if(screenRect.isInMe(rawMousePos) === true)
        {
            // convert screen space to renderspace
            rawMousePos.x -= screenRect.x;
            rawMousePos.y -= screenRect.y;
        
            rawMousePos.x /= screenRect.w;
            rawMousePos.y /= screenRect.h;
        
            rawMousePos.x *= GAZCanvas.referenceScreenSize.w;
            rawMousePos.y *= GAZCanvas.referenceScreenSize.h;
        
            return rawMousePos;
        }
        return undefined;
    }
    
    getKeystate(key)
    {
        return this.currentKeyState[key];
    }
    
    update()
    {
        if(this.mouseLogicalPos === undefined)
        {
            this.mouseDown = false;
            this.oldMouseEvent = false;
            
            this.currentMouseState = INPUT_NOT_PRESSED;
            this.oldMouseState = this.currentMouseState;
        }
        else
        {
            this.oldMouseEvent = this.mouseDown;
            this.oldMouseState = this.currentMouseState;
            
            this.currentMouseState = this._processState(this.currentMouseState, this.mouseRawState);
            this.mouseRawState = '';
        }
        
        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = this._processState(this.currentKeyState[i], this.rawKeyState[i]);
            this.rawKeyState[i] = '';
        }
    }
    
    _processState(thing, state)
    {
        switch(thing)
        {
            case INPUT_PRESSED:
            {
                if (state === 'up')
                {
                    return INPUT_RELEASED;
                }
                else
                {
                    return INPUT_HELD;
                }
            }
            break;
    
            case INPUT_HELD:
            {
                if (state === 'up')
                {
                    return INPUT_RELEASED;
                }
        
                return INPUT_HELD;
            }
            break;
            
            case INPUT_RELEASED:
            {
                if (state === 'down')
                {
                    return INPUT_PRESSED;
                }
        
                return INPUT_NOT_PRESSED;
            }
            break;
    
            case INPUT_NOT_PRESSED:
            {
                if (state === 'down')
                {
                    return INPUT_PRESSED;
                }
            }
            break;
        }
        
        return INPUT_NOT_PRESSED;
    }
}

Input = new InputClass();

window.addEventListener('mousemove',Input.onMouseMove);
window.addEventListener('mouseup',Input.onMouseUp);
window.addEventListener('mousedown',Input.onMouseDown);

window.addEventListener('keydown',Input.onKeyDown);
window.addEventListener('keyup',Input.onKeyUp);


window.addEventListener('touchstart',Input.onMouseDown);
window.addEventListener('touchmove',Input.onMouseMove);
window.addEventListener('touchend',Input.onMouseDown);