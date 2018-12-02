class Matrix
{
    /*
        Matrix - Standard math Matrix 4x4 class and associated methods
        
        This is a webgl matrix wrapper with metrix defined as Float32Array()
        
        Matrix functions are defined following XNA/Monogame nomenclature
        i.e. static functions that return matrix objects
        
        TransformVector2, TransformVector3 & TransformVector4 will transform vectors
     */
    constructor()
    {
        this.m = new Float32Array(16);

        this.m[0] = this.m[5] = this.m[10] = this.m[15] = 1;
    }

    static CreateTranslation(x, y, z)
    {
        var m = new Matrix();

        m.m[12] = x;
        m.m[13] = y;
        m.m[14] = z;

        return m;
    }

    static CreateScale(x, y, z)
    {
        var m = new Matrix();

        m.m[0] = x;
        m.m[5] = y;
        m.m[10] = z;

        return m;
    }

    static CreateRotationX(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[5] = cos; m.m[6] = sin;
        m.m[9] = -sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationY(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = -sin;
        m.m[8] = sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationZ(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = sin;
        m.m[4] = -sin; m.m[5] = cos;

        return m;
    }

    TransformVector2(v0)
    {
        var result = new Vector2();

        result.x = (v0.x * this.m[0]) + (v0.y * this.m[4]) + this.m[12];
        result.y = (v0.x * this.m[1]) + (v0.y * this.m[5])+ this.m[13];

        return result;
    }

    TransformVector3(v0)
    {
        var result = new Vector3();

        result.x = (v0.x * m.m[0]) + (v0.y * m.m[4]) + (v0.z * m.m[8]);
        result.y = (v0.x * m.m[1]) + (v0.y * m.m[5]) + (v0.z * m.m[9]);
        result.z = (v0.x * m.m[2]) + (v0.y * m.m[6]) + (v0.z * m.m[10]);

        return result;
    }

    TransformVector4(v0)
    {
        var result = new Vector4();

        result.x = (v0.x * m.m[0]) + (v0.y * m.m[4]) + (v0.z * m.m[8]) + (v0.w *m.m[12]);
        result.y = (v0.x * m.m[1]) + (v0.y * m.m[5]) + (v0.z * m.m[9]) + (v0.w *m.m[13]);
        result.z = (v0.x * m.m[2]) + (v0.y * m.m[6]) + (v0.z * m.m[10]) + (v0.w *m.m[14]);
        result.w = (v0.x * m.m[3]) + (v0.y * m.m[7]) + (v0.z * m.m[11]) + (v0.w *m.m[15]);

        return result;
    }

    static Multiply(src, rMat)
    {
        var result = new Matrix();

        result.m[0] = src.m[0] * rMat.m[0] + src.m[1] * rMat.m[4] + src.m[2] * rMat.m[8] + src.m[3] * rMat.m[12];
        result.m[1] = src.m[0] * rMat.m[1] + src.m[1] * rMat.m[5] + src.m[2] * rMat.m[9] + src.m[3] * rMat.m[13];
        result.m[2] = src.m[0] * rMat.m[2] + src.m[1] * rMat.m[6] + src.m[2] * rMat.m[10] + src.m[3] * rMat.m[14];
        result.m[3] = src.m[0] * rMat.m[3] + src.m[1] * rMat.m[7] + src.m[2] * rMat.m[11] + src.m[3] * rMat.m[15];

        result.m[4] = src.m[4] * rMat.m[0] + src.m[5] * rMat.m[4] + src.m[6] * rMat.m[8] + src.m[7] * rMat.m[12];
        result.m[5] = src.m[4] * rMat.m[1] + src.m[5] * rMat.m[5] + src.m[6] * rMat.m[9] + src.m[7] * rMat.m[13];
        result.m[6] = src.m[4] * rMat.m[2] + src.m[5] * rMat.m[6] + src.m[6] * rMat.m[10] + src.m[7] * rMat.m[14];
        result.m[7] = src.m[4] * rMat.m[3] + src.m[5] * rMat.m[7] + src.m[6] * rMat.m[11] + src.m[7] * rMat.m[15];

        result.m[8] = src.m[8] * rMat.m[0] + src.m[9] * rMat.m[4] + src.m[10] * rMat.m[8] + src.m[11] * rMat.m[12];
        result.m[9] = src.m[8] * rMat.m[1] + src.m[9] * rMat.m[5] + src.m[10] * rMat.m[9] + src.m[11] * rMat.m[13];
        result.m[10] = src.m[8] * rMat.m[2] + src.m[9] * rMat.m[6] + src.m[10] * rMat.m[10] + src.m[11] * rMat.m[14];
        result.m[11] = src.m[8] * rMat.m[3] + src.m[9] * rMat.m[7] + src.m[10] * rMat.m[11] + src.m[11] * rMat.m[15];

        result.m[12] = src.m[12] * rMat.m[0] + src.m[13] * rMat.m[4] + src.m[14] * rMat.m[8] + src.m[15] * rMat.m[12];
        result.m[13] = src.m[12] * rMat.m[1] + src.m[13] * rMat.m[5] + src.m[14] * rMat.m[9] + src.m[15] * rMat.m[13];
        result.m[14] = src.m[12] * rMat.m[2] + src.m[13] * rMat.m[6] + src.m[14] * rMat.m[10] + src.m[15] * rMat.m[14];
        result.m[15] = src.m[12] * rMat.m[3] + src.m[13] * rMat.m[7] + src.m[14] * rMat.m[11] + src.m[15] * rMat.m[15];

        return result;
    }

    static CreateLookAt(Eye, At, Up)
    {
        var m = new Matrix();

        var zaxis = Vector3.Normal(Eye - At);
        var xaxis = Vector3.Normal(Vector3.Cross(Up, zaxis));
        var yaxis = Vector3.Cross(zaxis, xaxis);

        m.m[0] = xaxis.x; m.m[1] = yaxis.x; m.m[2] = zaxis.x; m.m[3] = 0;
        m.m[4] = xaxis.y; m.m[5] = yaxis.y; m.m[6] = zaxis.y; m.m[7] = 0;
        m.m[8] = xaxis.z; m.m[9] = yaxis.z; m.m[10] = zaxis.z; m.m[11] = 0;
        m.m[12] = -Vector3.Dot(xaxis, Eye); m.m[13] = -Vector3.Dot(yaxis, Eye); m.m[14] = -Vector3.Dot(zaxis, Eye); m.m[15] = 1.0;

        return m;
    }


    static CreatePerspectiveFieldOfView(fov, aspectratio, nearPlane, farPlane)
    {
        var m = new Matrix();

        var f = 1.0 / Math.tan(fov / 2.0);

        m.m[0]  = f / aspectratio;   m.m[1]  = 0.0;  m.m[2]  = 0.0;                                              m.m[3]  =  0.0;
        m.m[4]  = 0.0;               m.m[5]  = f;    m.m[6]  = 0.0;                                              m.m[7]  =  0.0;
        m.m[8]  = 0.0;               m.m[9]  = 0.0;  m.m[10] = -(farPlane / (farPlane-nearPlane));                m.m[11] = -1.0;
        m.m[12] = 0.0;               m.m[13] = 0.0;  m.m[14] = -(nearPlane * farPlane) / (farPlane-nearPlane);  m.m[15] =  0.0;

        return m;
    }

    static CreateOrthoOffCenter(left, right, bottom, top, nearPlane, farPlane)
    {
        var m = new Matrix();

        m.m[0] = 2 / (right - left);
        m.m[1] = 0;
        m.m[2] = 0;
        m.m[3] = 0;

        m.m[4] = 0;
        m.m[5] = 2 / (top - bottom);
        m.m[6] = 0;
        m.m[7] = 0;

        m.m[8] = 0;
        m.m[9] = 0;
        m.m[10] = 1 / (farPlane - nearPlane);
        m.m[11] = nearPlane / (farPlane - nearPlane);

        m.m[12] = -1;
        m.m[13] = 1;
        m.m[14] = 0;
        m.m[15] = 1;

        return m;
    }
}