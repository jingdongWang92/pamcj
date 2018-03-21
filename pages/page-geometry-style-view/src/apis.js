export function fetchGeometryStyle(geometryStyleId) {
  return {
    method: 'get',
    endpoint: `/apis/geometry-styles/${geometryStyleId}`,
  };
}


export function updateGeometryStyle(geometryStyle) {
  return {
    method: 'put',
    endpoint: `/apis/geometry-styles/${geometryStyle.id}`,
    payload: geometryStyle,
  };
}
