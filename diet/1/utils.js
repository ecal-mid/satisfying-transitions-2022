function mouseInTriangle(tx, ty, x1, y1, x2, y2, x3, y3) {
  let point = [tx, ty];
  let area = getArea([x1, y1], [x2, y2], [x3, y3]);
  let areaA = getArea([x1, y1], [x2, y2], point);
  let areaB = getArea(point, [x2, y2], [x3, y3]);
  let areaC = getArea([x1, y1], point, [x3, y3]);
  return abs(areaA + areaB + areaC - area) < 0.001;
}

function getArea(a, b, c) {
  return abs(
    (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2
  );
}

function screenToWorld(x, y, { pixelDensity = devicePixelRatio } = {}) {
  //   if (drawingContext instanceof CanvasRenderingContext2D)
  const matrix = drawingContext.getTransform();
  const imatrix = matrix.invertSelf();

  x *= pixelDensity;
  y *= pixelDensity;

  return {
    x: x * imatrix.a + y * imatrix.c + imatrix.e,
    y: x * imatrix.b + y * imatrix.d + imatrix.f,
  };
}
