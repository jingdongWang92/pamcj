import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/layers-2x.png';
import 'leaflet/dist/images/layers.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import '../index.css';


import React from 'react';
import PropTypes from 'prop-types';
import Page from '@jcmap/component-app-shell';
import L from 'leaflet';
import './Leaflet.ImageTransform';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import URI from '@jcnetwork/util-uri';
import { getCoord } from '@turf/invariant';
import styled from 'styled-components';
import { Observable, Subject } from 'rxjs';
import turf from './tiny_turf';
import rotateIcon from './icons/rotate.png';
import rotateIconRetina from './icons/rotate-2x.png';
import scaleIcon from './icons/scale.png';
import scaleIconRetina from './icons/scale-2x.png';
import translateIcon from './icons/translate.png';
import translateIconRetina from './icons/translate-2x.png';


L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.0.3/dist/images/';
const GAODE_SATELLITE_MAP = '//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
const GAODE_TILE_MAP = '//maptile.tools.staging.jcbel.com/amap/{s}?x={x}&y={y}&z={z}';


export default class CartogramDraw extends React.Component {
  static propTypes = {
    fetchCartogramGeoreference: PropTypes.func.isRequired,
    cartogram: PropTypes.object,
    adjustCartogramGeoreferenceSuccess: PropTypes.func.isRequired,
    updateCartogramGeoreference: PropTypes.func.isRequired,
  }


  componentDidMount() {
    const uri = new URI();
    const hashes = uri.hash(true);
    const cartogram_id = hashes.cartogram_id || hashes.cartogram;
    this.props.fetchCartogramGeoreference(cartogram_id);

    const zoomOptions = {
      maxNativeZoom: 18,
      maxZoom: 20,
      minZoom: 3,
    };
    const gsm = L.tileLayer(GAODE_SATELLITE_MAP, {
      ...zoomOptions,
      subdomains: '1234',
    });
    const gtm = L.tileLayer(GAODE_TILE_MAP, {
      ...zoomOptions,
      subdomains: '1234',
    });

    const map = this.leafletMap = L.map(this.mapContainerElem, {
      zoom: 21,
      attributionControl: false,
      layers: [gtm],
    });

    L.control.layers({
      高德卫星图: gsm,
      高德瓦块图: gtm,
    }).addTo(this.leafletMap);

    const cartogram$ = this.cartogram$ = new Subject();

    const cartogramGeoreference$ = this.cartogramGeoreference$ = new Subject();

    const initialNorthWestPoint$ = cartogramGeoreference$
      .map(cartogramGeoreference => cartogramGeoreference.north_west || cartogramGeoreference.northWest);

    const initialSouthWestPoint$ = cartogramGeoreference$
      .map(cartogramGeoreference => cartogramGeoreference.south_west || cartogramGeoreference.southWest);

    const initialSouthEastPoint$ = cartogramGeoreference$
      .map(cartogramGeoreference => cartogramGeoreference.south_east || cartogramGeoreference.southEast);

    const initialNorthEastPoint$ = cartogramGeoreference$
      .map(cartogramGeoreference => cartogramGeoreference.north_east || cartogramGeoreference.northEast);

    const initialAnchorPoints$ = Observable
      .zip(
        initialNorthWestPoint$,
        initialSouthWestPoint$,
        initialSouthEastPoint$,
        initialNorthEastPoint$,
      );

    const initialTranslateButtonPoint$ = initialAnchorPoints$
      .map(points => turf.center(turf.geometryCollection(points)))
      .share()

    const translateButtonCreate$ = initialTranslateButtonPoint$
      .map(pointToLatlng)
      .map(latlng => {
        return L.marker(
          latlng,
          {
            draggable: true,
            icon: L.icon({
              iconUrl: translateIcon,
              iconRetinaUrl: translateIconRetina,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowSize: [41, 41]
            }),
          }
        );
      })
      .do(marker => marker.addTo(map))
      .share()

    const translateButtonDragMovePoint$ = translateButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'drag', null, evt => evt.latlng))
      .map(latlngToPoint)
      .share();

    const translateButtonDragStartPoint$ = translateButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'dragstart', null, () => marker.getLatLng()))
      .map(latlngToPoint)
      .share();

    const translateButtonDragEndPoint$ = translateButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'dragend', null, () => marker.getLatLng()))
      .map(latlngToPoint)
      .share();

    const translateMove$ = translateButtonDragMovePoint$
      .windowToggle(
        translateButtonDragStartPoint$,
        () => translateButtonDragEndPoint$,
      )
      .share()

    const translatingDistance$ = translateMove$
      .withLatestFrom(
        initialTranslateButtonPoint$,
        (to$, from) => to$.map(to => turf.distance(from, to)),
      )
      .switch()
      .share()

    const translatingDirection$ = translateMove$
      .withLatestFrom(
        initialTranslateButtonPoint$,
        (to$, from) => to$.map(to => turf.bearing(from, to)),
      )
      .switch()
      .share()

    const translatedDistance$ = translateButtonDragEndPoint$
      .withLatestFrom(
        initialTranslateButtonPoint$,
        (to, from) => turf.distance(from, to),
      )
      .share()

    const translatedDirection$ = translateButtonDragEndPoint$
      .withLatestFrom(
        initialTranslateButtonPoint$,
        (to, from) => turf.bearing(from, to),
      )
      .share()


    /*************************************/
    /***********    缩放    ***************/
    /*************************************/

    const initialScaleButtonPoint$ = Observable
      .zip(
        initialNorthWestPoint$,
        initialNorthEastPoint$,
        (northWest, northEast) => turf.center(turf.geometryCollection([northWest, northEast])),
      )
      .share();

    const scaleButtonCreate$ = initialScaleButtonPoint$
      .map(pointToLatlng)
      .map(latlng => {
        return L.marker(
          latlng,
          {
            draggable: true,
            icon: L.icon({
              iconUrl: scaleIcon,
              iconRetinaUrl: scaleIconRetina,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowSize: [41, 41]
            }),
          }
        );
      })
      .do(marker => marker.addTo(map))
      .share()

    const scaleButtonDragStartPoint$ = scaleButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'dragstart', null, () => marker.getLatLng()))
      .map(latlngToPoint)
      .share();

    const scaleButtonDragEndPoint$ = scaleButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'dragend', null, () => marker.getLatLng()))
      .map(latlngToPoint)
      .share();

    const scaleButtonDragMovePoint$ = scaleButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'drag', null, evt => evt.latlng))
      .map(latlngToPoint)
      .windowToggle(
        scaleButtonDragStartPoint$,
        () => scaleButtonDragEndPoint$,
      )
      .share();

    const scaleDragStartDistanceToCenter$ = initialScaleButtonPoint$
      .withLatestFrom(
        initialTranslateButtonPoint$,
        (to, from) => turf.distance(from, to),
      )
      .share()

    const scaleDragMoveDistanceToCenter$ = scaleButtonDragMovePoint$
      .withLatestFrom(
        translateButtonCreate$,
        (to$, marker) => {
          const from = latlngToPoint(marker.getLatLng());
          return to$.map(to => turf.distance(from, to));
        },
      )
      .share()

    const scaleDragEndDistanceToCenter$ = scaleButtonDragEndPoint$
      .withLatestFrom(
        translateButtonCreate$,
        (to, marker) => {
          const from = latlngToPoint(marker.getLatLng());
          return turf.distance(from, to);
        },
      )
      .share()

    const scalingFactor$ = scaleDragMoveDistanceToCenter$
      .withLatestFrom(
        scaleDragStartDistanceToCenter$,
        (currentDistance$, startDistance) => {
          return currentDistance$.map(distance => distance / startDistance);
        },
      )
      .switch()
      .share()

    const scaledFactor$ = scaleDragEndDistanceToCenter$
      .withLatestFrom(
        scaleDragStartDistanceToCenter$,
        (currentDistance, startDistance) => currentDistance / startDistance,
      )
      .share()


    /*************************************/
    /***********    旋转    ***************/
    /*************************************/

    const initialRotateButtonPoint$ = initialSouthEastPoint$;

    const rotateButtonCreate$ = initialRotateButtonPoint$
      .map(pointToLatlng)
      .map(latlng => {
        return L.marker(
          latlng,
          {
            draggable: true,
            icon: L.icon({
              iconUrl: rotateIcon,
              iconRetinaUrl: rotateIconRetina,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowSize: [41, 41]
            }),
          }
        );
      })
      .do(marker => marker.addTo(map))
      .share()

    const rotateButtonDragStartPoint$ = rotateButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'dragstart', null, () => marker.getLatLng()))
      .map(latlngToPoint)
      .share();

    const rotateButtonDragEndPoint$ = rotateButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'dragend', null, () => marker.getLatLng()))
      .map(latlngToPoint)
      .share();

    const rotateButtonDragMovePoint$ = rotateButtonCreate$
      .switchMap(marker => Observable.fromEvent(marker, 'drag', null, evt => evt.latlng))
      .map(latlngToPoint)
      .windowToggle(
        rotateButtonDragStartPoint$,
        () => rotateButtonDragEndPoint$,
      )
      .share();

    const rotateDragStartAngle$ = initialRotateButtonPoint$
      .withLatestFrom(
        initialTranslateButtonPoint$,
        (to, from) => turf.bearing(from, to),
      )
      .share()

    const rotateDragMoveAngle$ = rotateButtonDragMovePoint$
      .withLatestFrom(
        translateButtonCreate$,
        (to$, marker) => {
          const from =  latlngToPoint(marker.getLatLng());
          return to$.map(to => turf.bearing(from, to));
        },
      )
      .share()

    const rotateDragEndAngle$ = rotateButtonDragEndPoint$
      .withLatestFrom(
        translateButtonCreate$,
        (to, marker) => {
          const from = latlngToPoint(marker.getLatLng());
          return turf.bearing(from, to);
        },
      )
      .share()

    const rotatingAngle$ = rotateDragMoveAngle$
      .withLatestFrom(
        rotateDragStartAngle$,
        (currentAngle$, startAngle) => currentAngle$.map(currentAngle => currentAngle - startAngle),
      )
      .switch()

    const rotatedAngle$ = rotateDragEndAngle$
      .withLatestFrom(
        rotateDragStartAngle$,
        (endAngle, startAngle) => endAngle - startAngle,
      )

    const transformingAnchorPoints = Observable
      .combineLatest(
        initialTranslateButtonPoint$,
        translatingDistance$.startWith(0),
        translatingDirection$.startWith(0),
        scalingFactor$.startWith(1),
        rotatingAngle$.startWith(0),
      )
      .withLatestFrom(
        initialAnchorPoints$,
        ([pivot, distance, direction, factor, angle], points) => {
          const rotatedPoints = points.map(point => turf.transformRotate(point, angle, {pivot}))
          const translatedPoints = turf.transformTranslate(
            turf.geometryCollection(rotatedPoints),
            distance,
            direction,
          );
          const scaledPoints = turf.transformScale(translatedPoints, factor);
          return turf.getGeom(scaledPoints).geometries;
        },
      )

    const transformedAnchorPoints = Observable
      .combineLatest(
        initialTranslateButtonPoint$,
        translatedDistance$.startWith(0),
        translatedDirection$.startWith(0),
        scaledFactor$.startWith(1),
        rotatedAngle$.startWith(0),
      )
      .withLatestFrom(
        initialAnchorPoints$,
        ([pivot, distance, direction, factor, angle], points) => {
          const rotatedPoints = points.map(point => turf.transformRotate(point, angle, {pivot}))
          const translatedPoints = turf.transformTranslate(
            turf.geometryCollection(rotatedPoints),
            distance,
            direction,
          );
          const scaledPoints = turf.transformScale(translatedPoints, factor);
          return turf.getGeom(scaledPoints).geometries;
        },
      )

    const translateButtonUpdate$ = transformingAnchorPoints
      .map(points => turf.center(turf.geometryCollection(points)))
      .map(pointToLatlng)
      .withLatestFrom(translateButtonCreate$)
      .do(([point, marker]) => {
        marker.setLatLng(point);
      })

    const scaleButtonUpdate$ = transformingAnchorPoints
      .map(([nw, sw, se, ne]) => turf.center(turf.geometryCollection([nw, ne])))
      .map(pointToLatlng)
      .withLatestFrom(scaleButtonCreate$)
      .do(([point, marker]) => {
        marker.setLatLng(point);
      })

    const rotateButtonUpdate$ = transformingAnchorPoints
      .map(([nw, sw, se, ne]) => se)
      .map(pointToLatlng)
      .withLatestFrom(rotateButtonCreate$)
      .do(([point, marker]) => {
        marker.setLatLng(point);
      })

    const transformingAnchorLatLngs = transformingAnchorPoints
      .map(points => points.map(pointToLatlng))


    /*************************************/
    /***********    更新底图    ***********/
    /*************************************/

    const initialAnchorLatLngs$ = initialAnchorPoints$
      .map(points => points.map(pointToLatlng));

    const diagramLayerCreate$ = Observable
      .zip(
        cartogram$,
        initialAnchorLatLngs$,
      )
      .do(([cartogram, anchorLatLngs]) => {
        map.fitBounds([anchorLatLngs[0], anchorLatLngs[2]]);
      })
      .map(([cartogram, anchorLatLngs]) => {
        const image = `/apis/storage/${cartogram.diagram}`;
        const options = {
          opacity: 0.3,
        };

        return L.imageTransform(image, anchorLatLngs, options);
      })
      .do(layer => {
        layer.addTo(map)
      })
      .share()

    const diagramLayerUpdate$ = transformingAnchorLatLngs
      .withLatestFrom(diagramLayerCreate$)
      .do(([anchors, layer]) => {
        layer.setAnchors(anchors);
      })


    /*************************************/
    /***********    更新数据    ***********/
    /*************************************/

    const cartogramGeoreferenceUpdate$ = transformedAnchorPoints
      .withLatestFrom(cartogramGeoreference$)
      .do(([points, cartogramGeoreference]) => {
        const newCartogramGeoreference = {
          ...this.props.cartogramGeoreference,
          northWest: points[0],
          southWest: points[1],
          southEast: points[2],
          northEast: points[3],

          north_west: points[0],
          south_west: points[1],
          south_east: points[2],
          north_east: points[3],
        };
        this.props.adjustCartogramGeoreferenceSuccess(newCartogramGeoreference);
      })

    this.loop = Observable
      .merge(
        translateButtonUpdate$,
        scaleButtonUpdate$,
        rotateButtonUpdate$,
        diagramLayerUpdate$,
        cartogramGeoreferenceUpdate$,
      )
      .subscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.cartogram && nextProps.cartogram) {
      const { cartogram, cartogramGeoreference } = nextProps;

      this.cartogram$.next(cartogram);
      this.cartogramGeoreference$.next(cartogramGeoreference);
    }
  }

  componentWillUnmount() {
    this.loop.unsubscribe();
  }

  render() {
    const { cartogramGeoreference, updateCartogramGeoreference, isSubmitting } = this.props;

    return (
      <Page>
        <AppContainer>
          <Card
            bordered={false}
            title={<span style={{ fontSize: '30px' }}>地图映射校准</span>}
            extra={[
              <Button
                key="save"
                type="primary"
                size="large"
                loading={isSubmitting}
                onClick={() => updateCartogramGeoreference(cartogramGeoreference)}
                disabled={!cartogramGeoreference}
              >
                保存
              </Button>,
              <Button
                key="go_back"
                type="primary"
                size="large"
                href="/cartogram/list"
                style={{marginLeft: '10px'}}>
                返回地图列表
              </Button>
            ]}
          />

          <MapContainer innerRef={elem => this.mapContainerElem = elem} />
        </AppContainer>
      </Page>
    );
  }
}

const AppContainer = styled.div.attrs({
  className: 'app-container',
})`
  display: flex;
  flex-direction: column;
`;

const MapContainer = styled.div`
  flex: 1;
`;

function latlngToPoint(latlng) {
  return {
    type: 'Point',
    coordinates: [latlng.lng, latlng.lat],
  };
}

function pointToLatlng(point) {
  return L.GeoJSON.coordsToLatLng(getCoord(point));
}
