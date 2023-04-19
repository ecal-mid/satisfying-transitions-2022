function checkTriangleCollision(centrex, centrey, radius, v1, v2, v3) {
  const { x: v1x, y: v1y } = v1;
  const { x: v2x, y: v2y } = v2;
  const { x: v3x, y: v3y } = v3;

  // ;
  // ; TEST 1: Vertex within circle
  // ;
  let c1x = centrex - v1x;
  let c1y = centrey - v1y;

  let radiusSqr = radius * radius;
  let c1sqr = c1x * c1x + c1y * c1y - radiusSqr;

  if (c1sqr <= 0) return true;

  let c2x = centrex - v2x;
  let c2y = centrey - v2y;
  let c2sqr = c2x * c2x + c2y * c2y - radiusSqr;

  if (c2sqr <= 0) return true;

  let c3x = centrex - v3x;
  let c3y = centrey - v3y;

  // &c3sqr = radiusSqr                     // reference to radiusSqr
  let c3sqr = c3x * c3x + c3y * c3y - radiusSqr;

  if (c3sqr <= 0) return true;

  // ;
  // ; TEST 2: Circle centre within triangle
  // ;

  // ;
  // ; Calculate edges
  // ;
  let e1x = v2x - v1x;
  let e1y = v2y - v1y;

  let e2x = v3x - v2x;
  let e2y = v3y - v2y;

  let e3x = v1x - v3x;
  let e3y = v1y - v3y;

  if (
    Math.sign(
      (e1y * c1x - e1x * c1y) |
        (e2y * c2x - e2x * c2y) |
        (e3y * c3x - e3x * c3y)
    ) >= 0
  )
    return true;

  // ;
  // ; TEST 3: Circle intersects edge
  // ;
  let k = c1x * e1x + c1y * e1y;

  if (k > 0) {
    len = e1x * e1x + e1y * e1y; // ; squared len

    if (k < len) {
      if (c1sqr * len <= k * k) return true;
    }
  }

  // Second edge
  k = c2x * e2x + c2y * e2y;

  if (k > 0) {
    len = e2x * e2x + e2y * e2y;

    if (k < len) {
      if (c2sqr * len <= k * k) return true;
    }
  }

  // ; Third edge
  k = c3x * e3x + c3y * e3y;

  if (k > 0) {
    len = e3x * e3x + e3y * e3y;

    if (k < len) {
      if (c3sqr * len <= k * k) return true;
    }
  }

  // ; We're done, no intersection
  return false;
}

function orthogonalProjection1(a, b, p) {
  // find nearest point along a LINE

  d1 = p5.Vector.sub(b, a).normalize();
  d2 = p5.Vector.sub(p, a);

  d1.mult(d2.dot(d1));

  return p5.Vector.add(a, d1);
}

function orthogonalProjection2(a, b, p) {
  // find nearest point alont a SEGMENT

  d1 = p5.Vector.sub(b, a);
  d2 = p5.Vector.sub(p, a);
  l1 = d1.mag();

  dotp = constrain(d2.dot(d1.normalize()), 0, l1);

  return p5.Vector.add(a, d1.mult(dotp));
}
