/*
    TexturePage - Texture Page image and associated metadata
    
    MetaData is stored in TexturePageMetaData and is expected to be a .js file / src code
 */

class TexturePageMetaData
{
    constructor()
    {
        this.lookup = {};
    }
}

class TexturePage
{
    constructor(filename, metadata)
    {
        this.image = new Image();
        this.image.src = filename;
        this.metadata = metadata;
    }
    
    /*
        DrawSprite(string name, vector2 pos)
        
        Draw a sprite named 'name' from the metadata at position
     */
    
    DrawSprite(name, pos)
    {
        this.DrawSpriteInfo(CrappyBirdInst.texturePage.metadata.lookup[name], pos);
    }
    
    /*
        DrawSpriteInfo(Rect uvRect, Vector2 pos)
        
        Use uVRect info to draw sprite
     */
    
    DrawSpriteInfo(uvRect, pos)
    {
        GAZCanvas.Sprite(CrappyBirdInst.texturePage.image, new Rect(pos.x, pos.y, uvRect.w, uvRect.h), uvRect);
    }
}