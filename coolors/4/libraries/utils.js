function screenToWorld(
  x,
  y,
  { pixelDensity = devicePixelRatio } = {}
) {
  const ctxOrMatrix = drawingContext.getTransform();
  const imatrix = ctxOrMatrix.invertSelf();

  x *= pixelDensity();
  y *= pixelDensity();

  return {
    x: x * imatrix.a + y * imatrix.c + imatrix.e,
    y: x * imatrix.b + y * imatrix.d + imatrix.f,
  };
}
