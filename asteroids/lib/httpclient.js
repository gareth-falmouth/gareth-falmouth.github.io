class HttpClient
{
    /*
        This is my wrapper for asynchronous http GET & POST functionality.
        
        
        Usage:
            declare an instance of HttpClient and use get and POST functions with appropriate callbacks
            for completion
        
        see:
        
     */
    
    constructor()
    {
    
    }
    
    /*
        get(string aUrl, function aCallback)
        
        Manage HTTP get to remote server
            aUrl        - full URL as string
            aCallback   - callback function for successful completion
     */
    get(aUrl, aCallback)
    {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function()
        {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        }
        
        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
    
    
    /*
        post(string aUrl,string params,  function aCallback)
        
        Manage HTTP post to remote server
            aUrl        - full URL as string
            params      - parameters to send in POST
            aCallback   - callback function for successful completion
     */
    post(aUrl, params, aCallback)
    {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function()
        {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        }
        
        anHttpRequest.open( "POST", aUrl, true );
        anHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        anHttpRequest.send( params );
    }
}