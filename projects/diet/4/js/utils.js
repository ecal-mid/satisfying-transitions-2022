
function screenToWorld(
    ctxOrMatrix,
    x,
    y,
    { pixelDensity = devicePixelRatio } = {}
) {
    // if (ctxOrMatrix instanceof CanvasRenderingContext2D)
    ctxOrMatrix = ctxOrMatrix.getTransform()

    const imatrix = ctxOrMatrix.invertSelf()

    x *= pixelDensity
    y *= pixelDensity

    return {
        x: x * imatrix.a + y * imatrix.c + imatrix.e,
        y: x * imatrix.b + y * imatrix.d + imatrix.f,
    }
}