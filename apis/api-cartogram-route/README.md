几何样式(GeometryStyle)的数据结构定义
```yaml
type: geometryStyle
geometry_type: Point | LineString | Polygon
stroke: true | false
stroke_width: 3
stroke_color: "#293473"
fill: true | false
fill_color: "#192378"
```


地图要素(Feature)的数据结构定义

### Point
```yaml
type: Feature
geometry_style: GeometryStyle # 可以覆盖layer的默认样式
geometry:
  type: Point
  coordinates: [x1, y1]
properties:
  layerId: layerid1,
```

### LineString
```yaml
type: Feature
geometry_style: GeometryStyle # 可以覆盖layer的默认样式
geometry:
  type: LineString
  coordinates: [[x1, y1], [x2, y2], ...]
properties:
  layerId: layerid2,
```

### Polygon
```yaml
type: Feature
geometry_style: GeometryStyle # 可以覆盖layer的默认样式
geometry:
  type: Polygon
  coordinates: [[[x1, y1], [x2, y2], ..., [x1, y1]]]
properties:
  layerId: layerid3,
```


地图图层(Layer)的数据结构定义
```yaml
type: Layer
geometry_type: Point | LineString | Polygon
geometry_style: GeometryStyle
features:
  - feature1: Feature
  - feature2: Feature
```


地图(Cartogram)的数据结构定义
```yaml
type: Cartogram
layers:
  - layer1: Layer
  - layer2: Layer
  - Layer3: Layer
```


地图集(CartogramCollection)的数据结构定义
```yaml
type: CartogramCollection
cartograms:
  - cartogram1: Cartogram
  - cartogram2: Cartogram
```
