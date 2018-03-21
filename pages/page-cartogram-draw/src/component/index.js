import 'leaflet/dist/leaflet.css';


import React from 'react';
import PropTypes from 'prop-types';
import AppShell from '@jcmap/component-app-shell';
import L from 'leaflet';
import '../leaflet-plugins/Leaflet.ImageTransform';
import '../leaflet-plugins/Leaflet.DraggableCircleMarker';
import '../leaflet-plugins/Leaflet.Layer';
import '../leaflet-plugins/Leaflet.SVG';
import '../leaflet-plugins/Leaflet.Custom';
import '../leaflet-plugins/Leaflet.Control.Layer.Custom';
import '../leaflet-plugins/Leaflet.Control.MousePosition';
import FeatureEditor from './FeatureEditor';
import URI from '@jcnetwork/util-uri';
import MapStateSwitcher from './MapStateSwitcher';
import PersistFeatureButtonGroup from './PersistFeatureButtonGroup';
import * as turf from '../tiny_turf';
import {
  MODE_EDIT,
  MODE_EDIT_ADJUST,
  MODE_DRAW,
  MODE_DRAW_SURFACE_RECTANGLE,
  MODE_DRAW_POINT,
  MODE_DRAW_CURVE,
  MODE_DRAW_SURFACE_FREEHAND,
  INTERACTIVE_VERTEX_MARKER_RADIUS,
} from '../constants';
import * as utils from '../utils';
import Divider from 'antd/es/divider';
import DrawingModeSwitcher from './DrawingModeSwitcher';
// import EdittingModeSwitcher from './EdittingModeSwitcher';
import styled from 'styled-components';
import { Observable, Subject } from 'rxjs';
import invariant from 'invariant';
import uuid from 'uuid';

// Position = [lontitude, latitude] or [easting, northing] or [x, y]

/**
 * BUG: https://github.com/Leaflet/Leaflet/issues/4968
 */
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
/* End of fix */
const GAODE_TILE_MAP = '//maptile.tools.staging.jcbel.com/amap/{s}?x={x}&y={y}&z={z}';
const GAODE_SATELLITE_MAP = '//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';


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


export default class CartogramDraw extends React.Component {
  static propTypes = {
    cartogram: PropTypes.object,
    layers: PropTypes.array.isRequired,
    features: PropTypes.array.isRequired,
    selectedFeature: PropTypes.object,
    removeFeatureSuccess: PropTypes.func.isRequired,
    persistFeature: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
  }


  layerGroupStore = new Map();
  elemStore = new Map()


  static childContextTypes = {
    cartogram: PropTypes.object,
    layers: PropTypes.array,
    updateFeature: PropTypes.func.isRequired,
    removeFeature: PropTypes.func.isRequired,
    mapState: PropTypes.string.isRequired,
    drawingLayer: PropTypes.object,
    switchMapState: PropTypes.func.isRequired,
    persistFeature: PropTypes.func.isRequired,
    selectedFeature: PropTypes.object,
  }


  getChildContext() {
    return {
      cartogram: this.props.cartogram,
      layers: this.props.layers,
      updateFeature: this.updateFeature,
      removeFeature: this.removeFeature,
      mapState: this.props.mapState,
      drawingLayer: this.props.drawingLayer,
      switchMapState: this.switchMapState,
      persistFeature: this.props.persistFeature,
      selectedFeature: this.props.selectedFeature,
    };
  }


  componentDidMount() {
    const hashParams = (new URI()).hash(true);
    const cartogramId = hashParams.cartogram_id || hashParams.cartogram;
    this.props.loadData(cartogramId);
    const map = this.leafletMap = L.map(this.mapContainerElem, {
      center: [0, 0],
      zoom: 18,
      maxZoom: 24,
      layers: [gtm],
      attributionControl: false,
      closePopupOnClick: false,
      boxZoom: false,
    });
    // 鼠标位置显示控件
    L.control.mousePosition({ numDigits: 7 }).addTo(map);


    /*** RxJS ***/
    const clickOnMap$ = Observable
      .fromEvent(map, 'click')
      .share()

    const mousedownOnMap$ = Observable
      .fromEvent(map, 'mousedown')
      .share()

    const mouseupOnMap$ = Observable
      .fromEvent(map, 'mouseup')
      .share()

    const mousemoveOnMap$ = Observable
      .fromEvent(map, 'mousemove')
      .share()

    const keydownOnWindow$ = Observable
      .fromEvent(window, 'keydown') // use `keydown` event, `keypress` will be blocked by system
      .share()

    const commandCopyFromKeyboard$ = keydownOnWindow$
      .filter(evt => (evt.metaKey || evt.ctrlKey) && evt.code === 'KeyC')
      .share()

    const commandCopy$ = Observable
      .merge(
        commandCopyFromKeyboard$,
        // commandCopyFromContextmenu$,
      )
      .share()

    const commandPasteFromKeyboard$ = keydownOnWindow$
      .filter(evt => (evt.metaKey || evt.ctrlKey) && evt.code === 'KeyV')
      .share()

    const commandPaste$ = Observable
      .merge(
        commandPasteFromKeyboard$,
        // commandPasteFromContextmenu$,
      )
      .share()

    // const commandCutFromKeyboard$ = keydownOnWindow$
    //   .filter(evt => (evt.metaKey || evt.ctrlKey) && evt.code === 'KeyX')
    //   .share()

    // const commandDeleteFromKeyboard$ = keydownOnWindow$
    //   .filter(evt => evt.code === 'Delete')
    //   .share()

    // const contextmenuOnMap$ = Observable
    //   .fromEvent(map, 'contextmenu')
    //   .share()

    const currentMousePositionPoint$ = mousemoveOnMap$
      .map(evt => evt.latlng)
      .map(({ lat, lng }) => turf.point([lng, lat]))
      .publishReplay(1)
      .refCount()

    const mapMouseClickDrawingStream = Observable
      .merge(clickOnMap$)
      .share();


    const featureCreate$ = this.featureCreate$ = new Subject();

    const featureUpdate$ = this.featureUpdate$ = new Subject();

    const featureRemove$ = this.featureRemove$ = new Subject();

    const pointFeatureCreate$ = featureCreate$
      .filter(feature => feature.geometry_type === 'Point')
      .share();

    const curveFeatureCreate$ = featureCreate$
      .filter(feature => feature.geometry_type === 'Curve')
      .share()

    const surfaceFeatureCreate$ = featureCreate$
      .filter(feature => feature.geometry_type === 'Surface')
      .share()

    const pointFeatureUpdate$ = featureUpdate$
      .filter(feature => feature.geometry_type === 'Point')
      .share();

    const curveFeatureUpdate$ = featureUpdate$
      .filter(feature => feature.geometry_type === 'Curve')
      .share()

    const surfaceFeatureUpdate$ = featureUpdate$
      .filter(feature => feature.geometry_type === 'Surface')
      .share()

    const featureChange$ = Observable
      .merge(
        featureCreate$.map(feature => ['create', feature]),
        featureUpdate$.map(feature => ['update', feature]),
        featureRemove$.map(feature => ['remove', feature]),
      )
      .share()

    const features$ = featureChange$
      .scan((features, [action, feature]) => {
        if (action === 'create') {
          return [...features, feature];
        } else if (action === 'update') {
          const featureUUID = feature.uuid;
          const index = features.findIndex(_feature => _feature.uuid === featureUUID);
          return [
            ...features.slice(0, index),
            feature,
            ...features.slice(index + 1),
          ];
        } else if (action === 'remove') {
          const featureUUID = feature.uuid;
          const index = features.findIndex(_feature => feature.uuid === featureUUID);
          return [
            ...features.slice(0, index),
            ...features.slice(index + 1),
          ];
        }
      }, [])
      .publishReplay(1)
      .refCount()

    const pointElementCreate$ = pointFeatureCreate$
      .map(feature => {
        const { layer, geometry } = feature;
        const label = utils.getFeatureLabel(feature);
        const paneName = utils.getPaneNameOfLayer(layer);

        const [lng, lat] = geometry.coordinates;
        const elem = L.custom.point([lat, lng], {
          label,
          feature,
          pane: paneName,
        });

        return elem;
      })
      .share()

    const curveElementCreate$ = curveFeatureCreate$
      .map(feature => {
        const { layer, geometry_style, geometry } = feature;
        const label = utils.getFeatureLabel(feature);
        const paneName = utils.getPaneNameOfLayer(layer);

        const latlngs = geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        const elem = L.custom.curve(latlngs, {
          label,
          feature,
          pane: paneName,
          ...utils.convertStyle(geometry_style),
        });

        return elem;
      })
      .share()

    const surfaceElementCreate$ = surfaceFeatureCreate$
      .map(feature => {
        const { layer, geometry_style, geometry } = feature;
        const label = utils.getFeatureLabel(feature);
        const paneName = utils.getPaneNameOfLayer(layer);

        const latlngs = geometry.coordinates.map(ring => ring.slice(0, -1).map(([lng, lat]) => [lat, lng]));
        const elem = L.custom.surface(latlngs, {
          label,
          feature,
          pane: paneName,
          ...utils.convertStyle(geometry_style),
        });

        return elem;
      })
      .share()

    const elementCreate$ = Observable
      .merge(
        pointElementCreate$,
        curveElementCreate$,
        surfaceElementCreate$
      )
      .do(elem => {
        const { feature, pane } = elem.options;

        const { uuid } = feature;
        this.elemStore.set(uuid, elem);

        const layerGroup = this.layerGroupStore.get(pane);
        elem.addTo(layerGroup);
      })
      .share()

    const pointFeatureAndElementDict$ = Observable
      .zip(
        pointFeatureCreate$,
        pointElementCreate$,
      )
      .scan((dict, pair) => {
        const [feature] = pair;
        invariant(!dict[feature.uuid], 'point feature uuid conflict');
        dict[feature.uuid] = pair;
        return dict;
      }, {})
      .share()

    const curveFeatureAndElementDict$ = Observable
      .zip(
        curveFeatureCreate$,
        curveElementCreate$,
      )
      .scan((dict, pair) => {
        const [feature] = pair;
        invariant(!dict[feature.uuid], 'curve feature uuid conflict');
        dict[feature.uuid] = pair;
        return dict;
      }, {})
      .share()

    const surfaceFeatureAndElementDict$ = Observable
      .zip(
        surfaceFeatureCreate$,
        surfaceElementCreate$,
      )
      .scan((dict, pair) => {
        const [feature] = pair;
        invariant(!dict[feature.uuid], 'surface feature uuid conflict');
        dict[feature.uuid] = pair;
        return dict;
      }, {})
      .share()

    const pointElementUpdate$ = pointFeatureUpdate$
      .withLatestFrom(
        pointFeatureAndElementDict$,
        (feature, dict) => {
          const [, element] = dict[feature.uuid];
          return [feature, element];
        }
      )
      .do(([feature, element]) => {
        element.options.feature = feature;

        const [lng, lat] = feature.geometry.coordinates;
        element.setLatLng([lat, lng]);
        element.setLabel(utils.getFeatureLabel(feature));
      })
      .map(([, element]) => element)
      .share()

    const curveElementUpdate$ = curveFeatureUpdate$
      .withLatestFrom(
        curveFeatureAndElementDict$,
        (feature, dict) => {
          const [, element] = dict[feature.uuid];
          return [feature, element];
        }
      )
      .do(([feature, element]) => {
        element.options.feature = feature;

        const latlngs = feature.geometry.coordinates.map(utils.coordsToLatLng);
        element.setLatLngs(latlngs);
        element.setStyle(utils.convertStyle(feature.geometry_style));
        element.setLabel(utils.getFeatureLabel(feature));
      })
      .map(([, element]) => element)
      .share()

    const surfaceElementUpdate$ = surfaceFeatureUpdate$
      .withLatestFrom(
        surfaceFeatureAndElementDict$,
        (feature, dict) => {
          const [, element] = dict[feature.uuid];
          return [feature, element];
        }
      )
      .do(([feature, element]) => {
        element.options.feature = feature;

        const latlngs = feature.geometry.coordinates.map(ring => ring.slice(0, -1).map(utils.coordsToLatLng));
        element.setLatLngs(latlngs);
        element.setStyle(utils.convertStyle(feature.geometry_style));
        element.setLabel(utils.getFeatureLabel(feature));
      })
      .map(([, element]) => element)
      .share()

    const elementUpdate$ = Observable
      .merge(
        pointElementUpdate$,
        curveElementUpdate$,
        surfaceElementUpdate$
      )
      .do(elem => {
        const { feature, pane } = elem.options;

        const { uuid } = feature;
        this.elemStore.set(uuid, elem);

        const layerGroup = this.layerGroupStore.get(pane);
        elem.addTo(layerGroup);
      })
      .share()

    const elementRemove$ = featureRemove$
      .do(feature => {
        const elem = this.elemStore.get(feature.uuid);
        if (elem) {
          elem.remove();
          this.elemStore.delete(feature.uuid);
        }
      })
      .share()

    const elements$ = Observable
      .merge(
        elementCreate$.map(element => ['create', element]),
        elementUpdate$.map(element => ['update', element]),
        elementRemove$.map(element => ['remove', element]),
      )
      .scan((elements, [action, element]) => {
        if (action === 'create') {
          return [...elements, element];
        } else if (action === 'update') {
          const featureUUID = element.uuid;
          const index = elements.findIndex(_feature => _feature.uuid === featureUUID);
          return [
            ...elements.slice(0, index),
            element,
            ...elements.slice(index + 1),
          ];
        } else if (action === 'remove') {
          const featureUUID = element.options.feature.uuid;
          const index = elements.findIndex(_feature => element.options.feature.uuid === featureUUID);
          return [
            ...elements.slice(0, index),
            ...elements.slice(index + 1),
          ];
        }
      }, [])
      .publishReplay(1)
      // .multicast(new BehaviorSubject([]))
      .refCount()

    const mapStateStream = this.mapStateStream = new Subject();

    const noop$ = Observable.empty();

    const ctx = this;

    const mousePosition$ = mapMouseClickDrawingStream
      .map(evt => evt.latlng)
      .map(({ lat, lng }) => [lng, lat])
      .share();

    const commandFromKeyboard$ = noop$;

    const command$ = Observable
      .merge(
        mapStateStream
          .map(({ mapState }) => mapState),
        commandFromKeyboard$,
      )

    const drawPoint$ = command$
      .switchMap(command => {
        if (!command.startsWith(MODE_DRAW_POINT)) { return noop$; }

        return Observable.create(observer => {
          const drawPointLoop$ = mousePosition$
            .map(position => {
              const { cartogram, drawingLayer } = ctx.props;
              return utils.genFeature(cartogram, drawingLayer, {
                type: 'Point',
                coordinates: position,
              });
            })
            .do(point => {
              ctx.createFeature(point);
            })
            .subscribe(observer);

          return () => {
            drawPointLoop$.unsubscribe();
          };
        });

      });

    const drawCurve$ = command$
      .switchMap(command => {
        if (!command.startsWith(MODE_DRAW_CURVE)) { return noop$ }

        return Observable
          .create(observer => {
            const marker = L.marker([0, 0], {
              icon: L.divIcon({
                html: '',
                className: 'leaflet-vertex',
                iconSize: [23, 23],
              }),
              draggable: true,
            });

            const confirm$ = Observable
              .fromEvent(marker, 'click')
              .share();

            const curve$ = mousePosition$
              .distinctUntilChanged((p, q) => p[0] === q[0] && p[1] === q[1])
              .buffer(confirm$)
              .filter(positions => positions.length >= 2)
              .map(positions => {
                const { cartogram, drawingLayer } = ctx.props;
                return utils.genFeature(cartogram, drawingLayer, {
                  type: 'LineString',
                  coordinates: positions,
                });
              })
              .do(curve => {
                ctx.createFeature(curve);
              });

            const latlngs$ = Observable.defer(() => {
              return mousePosition$
                .map(([lng, lat]) => [lat, lng])
                .window(confirm$);
            });

            /********* marker start ***********/
            const markerShow$ = latlngs$
              .switchMap(latlngs => latlngs.take(1))
              .do(latlng => {
                marker.setLatLng(latlng);
                marker.addTo(ctx.leafletMap);
              })

            const markerMove$ = latlngs$
              .switchMap(latlngs => latlngs.skip(1))
              .do(latlng => {
                marker.setLatLng(latlng);
              })

            const markerHide$ = confirm$
              .do(() => {
                marker.remove();
              })

            const markerLifeCycle$ = Observable
              .zip(markerShow$, markerMove$, markerHide$)
            /********* marker end ***********/

            /********** helper line start **********/
            const helperLine = L.custom.curveHelperLine([[0, 0], [1, 1]]);

            const lineLatLngs$ = Observable.defer(() => {
              return latlngs$
                .map(latlngs => {
                  return latlngs
                    .scan((accu, latlng) => [...accu, latlng], [])
                    .switchMap(accu => {
                      return mousemoveOnMap$
                        .map(evt => evt.latlng)
                        .map(latlng => [...accu, latlng]);
                    })
                })
            });

            const helperLineShow$ = lineLatLngs$
              .switchMap(latlngs__ => latlngs__.take(1))
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
                helperLine.addTo(ctx.leafletMap);
              })

            const helperLineMove$ = lineLatLngs$
              .switchMap(latlngs__ => latlngs__.skip(1))
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
              });

            const helperLineHide$ = confirm$
              .do(() => {
                helperLine.remove();
              })

            const helperLineLifeCycle$ = Observable.zip(helperLineShow$, helperLineMove$, helperLineHide$);
            /********** helper line end **********/

            const drawCurveLoopSubscription = Observable
              .zip(curve$, markerLifeCycle$, helperLineLifeCycle$)
              .subscribe(observer);

            return () => {
              drawCurveLoopSubscription.unsubscribe();
              marker.off();
              marker.remove();
              helperLine.off();
              helperLine.remove();
            };
          });
      });

    const drawSurfaceFreehand$ = command$
      .switchMap(command => {
        if (!command.startsWith(MODE_DRAW_SURFACE_FREEHAND)) { return noop$ }

        return Observable
          .create(observer => {
            const marker = L.marker([0, 0], {
              icon: L.divIcon({
                html: '',
                className: 'leaflet-vertex',
                iconSize: [23, 23],
              }),
              draggable: true,
            });

            const confirm$ = Observable
              .fromEvent(marker, 'click')
              .share();

            const surface$ = mousePosition$
              .distinctUntilChanged((p, q) => p[0] === q[0] && p[1] === q[1])
              .buffer(confirm$)
              .filter(positions => positions.length >= 3)
              .map(positions => {
                const { cartogram, drawingLayer } = ctx.props;
                return utils.genFeature(cartogram, drawingLayer, {
                  type: 'Polygon',
                  coordinates: [[...positions, positions[0]]],
                });
              })
              .do(curve => {
                ctx.createFeature(curve);
              });

            const latlngs$ = Observable.defer(() => {
              return mousePosition$
                .map(([lng, lat]) => [lat, lng])
                .window(confirm$);
            });

            /********* marker start ***********/
            const markerShow$ = latlngs$
              .switchMap(latlngs => latlngs.take(1))
              .do(latlng => {
                marker.setLatLng(latlng);
                marker.addTo(ctx.leafletMap);
              })

            const markerHide$ = confirm$
              .do(() => {
                marker.remove();
              })

            const markerLifeCycle$ = Observable
              .zip(markerShow$, markerHide$)
            /********* marker end ***********/

            /********** helper line start **********/
            const helperLine = L.custom.surfaceHelperLine([[0, 0], [1, 1]]);

            const lineLatLngs$ = Observable.defer(() => {
              return latlngs$
                .map(latlngs => {
                  return latlngs
                    .scan((accu, latlng) => [...accu, latlng], [])
                    .switchMap(accu => {
                      return mousemoveOnMap$
                        .map(evt => evt.latlng)
                        .map(latlng => [...accu, latlng, ...accu.slice(0, 1)]);
                    })
                })
            });

            const helperLineShow$ = lineLatLngs$
              .switchMap(latlngs__ => latlngs__.take(1))
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
                helperLine.addTo(ctx.leafletMap);
              })

            const helperLineMove$ = lineLatLngs$
              .switchMap(latlngs__ => latlngs__.skip(1))
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
              });

            const helperLineHide$ = confirm$
              .do(() => {
                helperLine.remove();
              })

            const helperLineLifeCycle$ = Observable.zip(helperLineShow$, helperLineMove$, helperLineHide$);
            /********** helper line end **********/

            const drawSurfaceLoopSubscription = Observable
              .zip(surface$, markerLifeCycle$, helperLineLifeCycle$)
              .subscribe(observer);

            return () => {
              drawSurfaceLoopSubscription.unsubscribe();
              marker.off();
              marker.remove();
              helperLine.off();
              helperLine.remove();
            };
          });
      });

    const drawSurfaceRectangle$ = command$
      .switchMap(command => {
        if (!command.startsWith(MODE_DRAW_SURFACE_RECTANGLE)) { return noop$; }

        return Observable
          .create(observer => {
            const confirmMarker = L.marker([0, 0], {
              icon: L.divIcon({
                html: '',
                className: 'leaflet-vertex',
                iconSize: [23, 23],
              }),
              draggable: true,
            });

            const confirm$ = Observable
              .fromEvent(confirmMarker, 'click', null, () => ({ latlng: confirmMarker.getLatLng() }))
              .share();

            const firstLatLng$ = mousePosition$
              .map(([lng, lat]) => [lat, lng])
              .windowWhen(() => confirm$)
              .switchMap(positions => positions.take(1))
              .share();

            const firstPoint$ = firstLatLng$
              .map(([_1lat, _1lng]) => turf.point([_1lng, _1lat]))
              .share();

            const secondLatLng$ = mousePosition$
              .map(([lng, lat]) => [lat, lng])
              .windowWhen(() => firstLatLng$)
              .switchMap(positions => positions.skip(1).take(1))
              .share();

            const secondPoint$ = secondLatLng$
              .map(([_2lat, _2lng]) => turf.point([_2lng, _2lat]))
              .share();

            const firstSecondBearing$ = Observable
              .zip(
                firstPoint$,
                secondPoint$,
                (_firstPoint, _secondPoint) => turf.bearing(_firstPoint, _secondPoint) + 180,
              )
              .share();

            const secondPointRotated$ = Observable
              .zip(
                firstPoint$,
                secondPoint$,
                firstSecondBearing$,
                (_firstPoint, _secondPoint, bear) => turf.transformRotate(_secondPoint, -bear, { pivot: turf.getCoord(_firstPoint) }),
              )
              .share();

            const thirdLatLng$ = confirm$
              .map(evt => evt.latlng)
              .map(({ lat, lng }) => [lat, lng])
              .share();

            const thirdPoint$ = thirdLatLng$
              .map(([lat, lng]) => [lng, lat])
              .map(coord => turf.point(coord))
              .share();

            const thirdPointRotated$ = Observable
              .zip(
                firstPoint$,
                thirdPoint$,
                firstSecondBearing$,
                (_firstPoint, _3P, bearing) => turf.transformRotate(_3P, -bearing, { pivot: turf.getCoord(_firstPoint) }),
              )
              .share();

            const fourthPoint$ = Observable
              .zip(
                firstPoint$,
                firstSecondBearing$,
                thirdPointRotated$,
                (_1p, bearing, _3pr) => {
                  return turf.transformRotate(
                    turf.point([
                      turf.getCoord(_3pr)[0],
                      turf.getCoord(_1p)[1],
                    ]),
                    bearing,
                    {
                      pivot: turf.getCoord(_1p),
                    },
                  );
                }
              )
              .share();

            const fourthLatLng$ = fourthPoint$
              .map(point => {
                const [lng, lat] = turf.getCoord(point);
                return [lat, lng];
              })
              .share()

            const surfaceRectangle$ = Observable
              .zip(
                firstLatLng$,
                secondLatLng$,
                thirdLatLng$,
                fourthLatLng$,
                confirm$,
                (_1, _2, _3, _4) => [_1, _2, _3, _4],
              )
              .map(latlngs => latlngs.map(([lat, lng]) => [lng, lat]))
              .map(positions => {
                const { cartogram, drawingLayer } = ctx.props;
                return utils.genFeature(cartogram, drawingLayer, {
                  type: 'Polygon',
                  coordinates: [[...positions, positions[0]]],
                });
              })
              .do(surface => {
                ctx.createFeature(surface);
              });

            const thirdLatLngCondidate$ = Observable
              .zip(
                firstPoint$,
                secondPointRotated$,
                firstSecondBearing$,
              )
              .map(([firstPoint, secondPointRotated, bear]) => {
                const firstCoord = turf.getCoord(firstPoint);
                const rotateOption = {
                  pivot: firstCoord,
                };


                return mousemoveOnMap$
                  .map(evt => evt.latlng)
                  .map(mouseLatLng => turf.point([mouseLatLng.lng, mouseLatLng.lat]))
                  .map(mousePoint => turf.transformRotate(mousePoint, -bear, rotateOption))
                  .map(mousePointRotated => {
                    return turf.point([
                      turf.getCoord(mousePointRotated)[0],
                      turf.getCoord(secondPointRotated)[1],
                    ]);
                  })
                  .map(thirdCandidatePointRotated => turf.transformRotate(thirdCandidatePointRotated, bear, rotateOption))
                  .map(thirdCandidatePoint => {
                    const [lng, lat] = turf.getCoord(thirdCandidatePoint);
                    return [lat, lng];
                  });
              })
              .share()

            /********* confirm marker start ***********/
            const confirmMarkerShow$ = secondLatLng$
              .do(latlng => {
                confirmMarker.setLatLng(latlng);
                confirmMarker.addTo(ctx.leafletMap);
              })

            const confirmMarkerMove$ = thirdLatLngCondidate$
              .switch()
              .do(latlng => {
                confirmMarker.setLatLng(latlng);
              })

            const confirmMarkerHide$ = confirm$
              .do(() => {
                confirmMarker.remove();
              })

            const confirmMarkerLifeCycle$ = Observable
              .combineLatest(confirmMarkerShow$, confirmMarkerMove$, confirmMarkerHide$)
            /********* confirm marker end ***********/

            /********** helper line start **********/
            const helperLine = L.custom.surfaceHelperLine([[0, 0], [1, 1]]);

            const thirdPointCandidates$ = thirdLatLngCondidate$
              .map(latlngs => {
                return latlngs
                  .map(([lat, lng]) => turf.point([lng, lat]))
              })
              .share()

            const thirdPointCandidateRotated$ = Observable
              .zip(
                firstPoint$,
                firstSecondBearing$,
                thirdPointCandidates$,
                (firstPoint, bearing, thirdPointCandidates) => {
                  return thirdPointCandidates
                    .map(thirdPointCandidate => {
                      return turf.transformRotate(thirdPointCandidate, -bearing, { pivot: turf.getCoord(firstPoint) })
                    })
                },
              )
              .share()

            const fourthPointCandidateRotated$ = Observable
              .zip(
                firstPoint$,
                thirdPointCandidateRotated$,
                (firstPoint, points) => {
                  return points
                    .map(point => {
                      return turf.point([
                        turf.getCoord(point)[0],
                        turf.getCoord(firstPoint)[1],
                      ]);
                    });
                }
              )
              .share()

            const fourthPointCandidatesOnThirdLatLngCandidate$ = Observable
              .zip(
                firstPoint$,
                firstSecondBearing$,
                fourthPointCandidateRotated$,
                (firstPoint, bearing, _4Points) => {
                  return _4Points
                    .map(point => {
                      return turf.transformRotate(point, bearing, { pivot: turf.getCoord(firstPoint )});
                    });
                }
              )
              .share()

            const fourthLatLngCondidateOnThirdLatLngCandidate$ = fourthPointCandidatesOnThirdLatLngCandidate$
              .map(points => {
                return points
                  .map(point => {
                    const [lng, lat] = turf.getCoord(point);
                    return [lat, lng];
                  })
              })
              .share()

            const step1 = firstLatLng$
              .map(firstLatLng => {
                return mousemoveOnMap$
                  .map(evt => evt.latlng)
                  .takeUntil(secondLatLng$)
                  .map(latlng => [firstLatLng, latlng]);
              })

            const step2 = Observable
              .zip(
                firstLatLng$,
                secondLatLng$,
                thirdLatLngCondidate$,
                fourthLatLngCondidateOnThirdLatLngCandidate$,
                (firstLatLng, secondLatLng, _3cs, _4cs) => {
                  return Observable
                    .zip(_3cs, _4cs)
                    .takeUntil(thirdLatLng$)
                    .map(latlngs => [firstLatLng, secondLatLng, ...latlngs]);
                }
              )

            const step3 = Observable
              .zip(
                firstLatLng$,
                secondLatLng$,
                thirdLatLng$,
                fourthLatLng$,
                (_1, _2, _3, _4) => [_1, _2, _3, _4],
              );

            const helperLineShow$ = step1
              .switchMap(latlngs__ => latlngs__.take(1))
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
                helperLine.addTo(ctx.leafletMap);
              })

            const helperLineMove1$ = step1
              .switchMap(latlngs__ => latlngs__.skip(1))
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
              });

            const helperLineMove2$ = step2
              .switchMap(latlngs__ => latlngs__.skip(1))
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
              });

            const helperLineMove3$ = step3
              .do(latlngs => {
                helperLine.setLatLngs([latlngs]);
              });

            const helperLineHide$ = confirm$
              .do(() => {
                helperLine.remove();
              })

            const helperLineLifeCycle$ = Observable.zip(
              helperLineShow$,
              helperLineMove1$,
              helperLineMove2$,
              helperLineMove3$,
              helperLineHide$,
            );
            /********** helper line end **********/


            const drawSurfaceRectangleLoopSubscription = Observable
              .zip(surfaceRectangle$, confirmMarkerLifeCycle$, helperLineLifeCycle$)
              .subscribe(observer);

            return () => {
              drawSurfaceRectangleLoopSubscription.unsubscribe();
              confirmMarker.off();
              confirmMarker.remove();
              helperLine.off();
              helperLine.remove();
            };
          });
      });


    const drawSurface$ = Observable
      .merge(
        drawSurfaceFreehand$,
        drawSurfaceRectangle$,
      );

    const draw$ = Observable
      .merge(
        drawPoint$,
        drawCurve$,
        drawSurface$,
      );


/******************************************************************************/
/******************************************************************************/
/************************            编辑            **************************/
/******************************************************************************/
/******************************************************************************/

    const selectedFeaturesByClick$ = elements$
      .switchMap(elements => {
        return Observable.from(elements)
          .mergeMap(element => Observable.fromEvent(element, 'click'));
      })
      .windowToggle(
        command$.filter(command => command.startsWith(MODE_EDIT)),
        () => command$.filter(command => !command.startsWith(MODE_EDIT)),
      )
      .switchMap(evt$ => {
        let selectedFeatures = [];

        return evt$
          .map(evt => {
            const clickedFeature = evt.target.options.feature;

            if (evt.originalEvent.shiftKey) {
              selectedFeatures.push(clickedFeature);
            } else {
              selectedFeatures = [clickedFeature];
            }

            return selectedFeatures;
          })
      })
      .share()

    const mousedownWithShiftKeyOnMap$ = mousedownOnMap$
      .filter(evt => evt.originalEvent.shiftKey)
      .share()

    const selectionPolygons$ = mousemoveOnMap$
      .windowToggle(
        mousedownWithShiftKeyOnMap$,
        () => mouseupOnMap$,
      )
      .map((_mousemove$) => {
        return _mousemove$
          .map(evt => evt.latlng)
          .map(({ lat, lng }) => [lng, lat])
          .scan((positions, currentPosition) => [...positions, currentPosition], [])
          .filter(positions => positions.length > 3)
          .map(positions => turf.polygon([[...positions, positions[0]]]))
          .map(selectionPolygon => turf.cleanCoords(selectionPolygon));
      })
      .share()

    const selectionRangeIndicatorCreate$ = selectionPolygons$
      .switchMap(selectionPolygon$ => selectionPolygon$.take(1))
      .map(selectionPolygon => selectionPolygon.geometry.coordinates)
      .map(coordinates => coordinates.map(ring => ring.map(([lng, lat]) => [lat, lng])))
      .map(latlngs => L.polygon(latlngs))
      .do(element => {
        element.addTo(this.leafletMap);
      })
      .share()

    const selectionRangeIndicatorUpdate$ = selectionRangeIndicatorCreate$
      .withLatestFrom(
        selectionPolygons$
      )
      .switchMap(([rangeIndicatorElement, selectionPolygon$]) => {
        return selectionPolygon$
          .skip(1)
          .map(selectionPolygon => selectionPolygon.geometry.coordinates)
          .map(coordinates => coordinates.map(ring => ring.map(([lng, lat]) => [lat, lng])))
          .do(
            (latlngs) => {
              rangeIndicatorElement.setLatLngs(latlngs);
            },
            null,
            () => {
              rangeIndicatorElement.off();
              rangeIndicatorElement.remove();
            },
          );
      })
      .share()

    // OPTIMIZE:
    selectionRangeIndicatorUpdate$.subscribe()

    // OPTIMIZE:
    command$
      .do(a => {
        console.log('command', a);
      })
      .filter(command => !command.startsWith(MODE_EDIT))
      .do(a => {
        console.log('filtered command', a);
      })
      .withLatestFrom(
        selectionRangeIndicatorCreate$.do(a => {
          console.log('created indicator', a);
        }),
        (_, indicator) => indicator,
      )
      .do(indicator => {
        indicator.off();
        indicator.remove();
        console.log('rmeove indicator');
      })
      .subscribe()


    const selectedFeaturesByDrag$ = selectionPolygons$
      .switch()
      .withLatestFrom(
        features$,
        (selectionPolygon, features) => {
          return features
            .filter(feature => {
              const geometry = feature.geometry;
              const geometryType = geometry.type;
              const isLineString = geometryType === 'LineString';
              const isPolygon = geometryType === 'Polygon';

              return turf.booleanContains(selectionPolygon, geometry) ||
                (isLineString && turf.booleanCrosses(selectionPolygon, geometry)) ||
                (isPolygon && turf.booleanOverlap(selectionPolygon, geometry)) ||
                (isPolygon && turf.booleanWithin(selectionPolygon, geometry));
            });
        },
      )
      .share();

    const selectedFeatures$ = Observable
      .merge(
        selectedFeaturesByClick$,
        selectedFeaturesByDrag$,
      )
      .combineLatest(
        Observable.from(featureUpdate$).startWith(null),
        (features, updatedFeature) => {
          if (!updatedFeature) { return features; }
          const featureIndex = features.findIndex(_feature => _feature.uuid === updatedFeature.uuid);
          if (featureIndex >= 0) {
            return [
              ...features.slice(0, featureIndex),
              updatedFeature,
              ...features.slice(featureIndex + 1),
            ];
          }

          return features;
        }
      )
      .do(features => {
        // OPTIMIZE: 准备支持多元素编辑
        if (features.length === 1) {
          ctx.props.selectFeatureSuccess(features[0]);
        } else {
          ctx.props.deselectFeatureSuccess();
        }
      })
      .share()

    const selectedFeaturesIndicatorCreate$ = selectedFeatures$
      .map(features => turf.geometryCollection(features.map(feature => feature.geometry)))
      .map(geometryCollection => {
        return L.geoJson(
          geometryCollection,
          {
            style: {
              color: 'red',
              fillColor: 'white',
              fillOpacity: 0.2,
            },
            pointToLayer: (pointFeature, latlng) => L.circleMarker(latlng),
          },
        );
      })
      .do(indicator => {
        indicator.addTo(this.leafletMap);
      })
      .share()

    const selectedFeaturesIndicatorSwitch$ = selectedFeaturesIndicatorCreate$
      .pairwise()
      .do(([previewIndicator, currentIndicator]) => {
        previewIndicator.remove();
        currentIndicator.addTo(this.leafletMap);
      })
      .map(([_, currentIndicator]) => currentIndicator)
      .share()

    selectedFeaturesIndicatorSwitch$.subscribe()

    const verticsOfSelectedFeatures$ = selectedFeatures$
      .map(features => {
        return features
          .reduce((vertics, feature, featureIndex) => {
            const { geometry } = feature;
            const { type, coordinates } = geometry;
            if (type === 'Polygon') {
              return [
                ...vertics,
                ...coordinates
                  .reduce((subAccu, ring, ringIndex) => {
                    return [
                      ...subAccu,
                      ...ring.slice(0, -1).map((position, coordIndex) => {
                        return turf.point(position, {
                          is_vertex: true,
                          coordIndex,
                          ringIndex,
                          featureIndex,
                        });
                      })
                    ]
                  }, []),
              ];
            } else if (type === 'LineString') {
              return [
                ...vertics,
                ...coordinates
                  .map((position, coordIndex) => {
                    return turf.point(position, {
                      is_vertex: true,
                      coordIndex,
                      featureIndex,
                    });
                  })
              ];
            } else {
              return [
                ...vertics,
                turf.point(coordinates, {
                  is_vertex: true,
                  featureIndex,
                }),
              ];
            }
          }, []);
      })
      .share()

    const edgesOfSelectedFeatures$ = selectedFeatures$
      .map(features => {
        return features
          .filter(feature => feature.geometry_type !== 'Point')
          .reduce((edges, feature, featureIndex) => {
            const { geometry } = feature;
            const { type, coordinates } = geometry;
            if (type === 'Polygon') {
              return [
                ...edges,
                ...coordinates
                  .reduce((subAccu, ring, ringIndex) => {
                    return [
                      ...subAccu,
                      ...ring.slice(1).map((position, coordIndex) => {
                        return turf.lineString([ring[coordIndex], position], {
                          coordIndex,
                          ringIndex,
                          featureIndex,
                        });
                      })
                    ]
                  }, []),
              ];
            } else {
              return [
                ...edges,
                ...coordinates
                  .slice(1)
                  .map((position, coordIndex) => {
                    return turf.lineString([coordinates[coordIndex], position], {
                      coordIndex,
                      featureIndex,
                    });
                  })
              ];
            }
          }, []);
      })
      .share()

    const distanceReducer = (nearestPoint, point) => {
      if (!nearestPoint) {
        return point;
      }

      return nearestPoint.properties.dist < point.properties.dist
        ? nearestPoint
        : point;
    }

    const nearestPointsOnVerticOfSelectedFeaturesFromCurrentMousePoint$ = verticsOfSelectedFeatures$
      .map(verticsOfSelectedCurveFeatures => {
        return currentMousePositionPoint$
          .map(currentMousePositionPoint => {
            const [mlng, mlat] = turf.getCoord(currentMousePositionPoint);
            const mcp = ctx.leafletMap.latLngToContainerPoint([mlat, mlng]);

            return verticsOfSelectedCurveFeatures
              .map(vertic => {
                const [vlng, vlat] = turf.getCoord(vertic);
                const vcp = ctx.leafletMap.latLngToContainerPoint([vlat, vlng]);

                return {
                  ...vertic,
                  properties: {
                    ...vertic.properties,
                    dist: turf.distance(currentMousePositionPoint, vertic),
                    pixelDist: mcp.distanceTo(vcp),
                  },
                };
              })
              .reduce(distanceReducer, null)
          })
      })
      .share()

    const nearestPointsOnEdgeOfSelectedFeaturesFromCurrentMousePoint$ = edgesOfSelectedFeatures$
      .map(edgesOfSelectedFeatures => {
        return currentMousePositionPoint$
          .map(currentMousePositionPoint => {
            return edgesOfSelectedFeatures
              .map(edge => {
                const point = turf.nearestPointOnLine(edge, currentMousePositionPoint);
                point.properties = {
                  ...point.properties,
                  ...edge.properties,
                }

                return point;
              })
              .reduce(distanceReducer, null)
          });
      })
      .share()

    const nearestPointsOnSelectedFeatures$ = Observable
      .zip(
        nearestPointsOnVerticOfSelectedFeaturesFromCurrentMousePoint$,
        nearestPointsOnEdgeOfSelectedFeaturesFromCurrentMousePoint$,
        (nearestVerticPoint$, nearestEdgePoint$) => {
          return Observable
            .zip(
              nearestVerticPoint$,
              nearestEdgePoint$,
              (vertexPoint, edgePoint) => {
                if (!vertexPoint) {
                  return edgePoint;
                }

                return edgePoint && (vertexPoint.properties.pixelDist <= INTERACTIVE_VERTEX_MARKER_RADIUS + 10)
                  ? vertexPoint
                  : edgePoint;
              },
            )
        }
      )
      .share()

    const editAdjustInteractiveMarkerCreate$ = nearestPointsOnSelectedFeatures$
      .switchMap(nearestPointOnSelectedFeatures$ => {
        return nearestPointOnSelectedFeatures$
          .take(1)
          .map(nearestPointOnSelectedFeatures => {
            if (!nearestPointOnSelectedFeatures) { return null; }

            const [lng, lat] = turf.getCoord(nearestPointOnSelectedFeatures);
            return L.marker.draggableCircleMarker([lat, lng], {
              radius: INTERACTIVE_VERTEX_MARKER_RADIUS,
              feature: nearestPointOnSelectedFeatures,
            });
          })
      })
      .do(interactiveMarker => {
        interactiveMarker && interactiveMarker.addTo(ctx.leafletMap);
      })
      .share()

    const editAdjustInteractiveMarkerMouseover$ = editAdjustInteractiveMarkerCreate$
      .map(interactiveMarker => interactiveMarker ? Observable.fromEvent(interactiveMarker, 'mouseover') : noop$)
      .share()

    const editAdjustInteractiveMarkerMouseout$ = editAdjustInteractiveMarkerCreate$
      .map(interactiveMarker => interactiveMarker ? Observable.fromEvent(interactiveMarker, 'mouseout') : noop$)
      .share()

    const editAdjustInteractiveMarkerDragstart$ = editAdjustInteractiveMarkerCreate$
      .map(interactiveMarker => interactiveMarker ? Observable.fromEvent(interactiveMarker, 'dragstart') : noop$)
      .share()

    const editAdjustInteractiveMarkerDragend$ = editAdjustInteractiveMarkerCreate$
      .map(interactiveMarker => interactiveMarker ? Observable.fromEvent(interactiveMarker, 'dragend') : noop$)
      .share()

    const editAdjustInteractiveMarkerDragmove$ = editAdjustInteractiveMarkerCreate$
      .map(interactiveMarker => interactiveMarker ? Observable.fromEvent(interactiveMarker, 'drag') : noop$)
      .share()

    const editAdjustInteractiveMarkerUpdateStyle$ = Observable
      .zip(
        editAdjustInteractiveMarkerMouseover$,
        editAdjustInteractiveMarkerMouseout$,
        editAdjustInteractiveMarkerCreate$,
      )
      .switchMap(([mouseover$, mouseout$, interactiveMarker]) => {
        return Observable
          .merge(
            mouseover$.do(() => interactiveMarker && interactiveMarker.focus()),
            mouseout$.do(() => interactiveMarker && interactiveMarker.blur()),
          );
      })
      .share();

    const editAdjustInteractiveMarkerUpdatePosition$ = Observable
      .zip(
        editAdjustInteractiveMarkerDragstart$,
        editAdjustInteractiveMarkerDragend$,
        editAdjustInteractiveMarkerCreate$,
        nearestPointsOnSelectedFeatures$,
      )
      .switchMap(([dragstart$, dragend$, interactiveMarker, nearestPointOnSelectedFeatures$]) => {
        if (!interactiveMarker) { return noop$; }

        return nearestPointOnSelectedFeatures$
          .window(dragend$)
          .switchMap(period$ => period$.takeUntil(dragstart$))
          .do((nearestPointOnSelectedFeatures) => {
            const [lng, lat] = turf.getCoord(nearestPointOnSelectedFeatures);
            interactiveMarker.setLatLng([lat, lng]);
          })
      })
      .share()

    const editAdjustInteractiveMarkerRemoveWhenSwitchElement$ = editAdjustInteractiveMarkerCreate$
      .pairwise()
      .map(([prevInteractiveMarker, interactiveMarker]) => prevInteractiveMarker)
      .share()

    const editAdjustInteractiveMarkerRemoveWhenSwitchCommand$ = command$
      .filter(command => !command.startsWith(MODE_EDIT_ADJUST))
      .withLatestFrom(
        editAdjustInteractiveMarkerCreate$,
        (_, interactiveMarker) => interactiveMarker,
      )
      .share();

    const editAdjustInteractiveMarkerRemove$ = Observable
      .merge(
        editAdjustInteractiveMarkerRemoveWhenSwitchElement$,
        editAdjustInteractiveMarkerRemoveWhenSwitchCommand$,
      )
      .do((prevInteractiveMarker) => {
        if (prevInteractiveMarker) {
          prevInteractiveMarker.off();
          prevInteractiveMarker.remove();
        }
      })
      .share()

    const editAdjustInteractiveMarkerUpdate$ = Observable
      .merge(
        editAdjustInteractiveMarkerUpdateStyle$,
        editAdjustInteractiveMarkerUpdatePosition$,
      )
      .share();

      editAdjustInteractiveMarkerUpdate$.subscribe()

    const editAdjustInteractiveMarker$ = Observable
      .merge(
        editAdjustInteractiveMarkerCreate$,
        editAdjustInteractiveMarkerUpdate$,
        editAdjustInteractiveMarkerRemove$,
      )
      .share()

    const selectedSurfaceFeaturesIndicatorUpdateByAdjust$ = Observable
      .zip(
        selectedFeatures$,
        editAdjustInteractiveMarkerDragstart$,
        editAdjustInteractiveMarkerDragmove$,
        nearestPointsOnSelectedFeatures$,
        selectedFeaturesIndicatorCreate$,
      )
      .filter(([features]) => features.length)
      .switchMap(([features, dragstart$, dragmove$, nearestPoint$, indicator]) => {
        return dragstart$
          .switchMap(() => nearestPoint$.take(1))
          .switchMap(nearestPoint => {
            const {
              is_vertex,
              coordIndex,
              ringIndex,
              featureIndex,
            } = nearestPoint.properties;
            const feature = features[featureIndex];
            const { geometry_type } = feature;
            const originalFeatureCoordinates = feature.geometry.coordinates;

            return dragmove$
              .map(evt => evt.latlng)
              .map(({ lat, lng }) => [lng, lat])
              .takeUntil(editAdjustInteractiveMarkerDragend$)
              .map(position => {
                let updatedFeatureCoordinates = [...originalFeatureCoordinates];

                if (geometry_type === 'Surface') {
                  const originalRing = originalFeatureCoordinates[ringIndex];
                  const newRing = [...originalRing];

                  if (is_vertex) { // 如果拖动的是顶点，那么就替换此座标位置
                    newRing.splice(coordIndex, 1, position);
                  } else { // 如果拖动的是边，那么插入座标位置
                    newRing.splice(coordIndex + 1, 0, position);
                  }
                  newRing.splice(-1, 1, newRing[0]); // 确保头尾一致

                  updatedFeatureCoordinates[ringIndex] = newRing;
                } else if (geometry_type === 'Curve') {
                  if (is_vertex) { // 如果拖动的是顶点，那么就替换此座标位置
                    originalFeatureCoordinates.splice(coordIndex, 1, position);
                  } else { // 如果拖动的是边，那么插入座标位置
                    originalFeatureCoordinates.splice(coordIndex + 1, 0, position);
                  }
                } else {
                  updatedFeatureCoordinates = position;
                }

                return updatedFeatureCoordinates;
              })
              .map(newCoordinates => {
                return {
                  ...feature,
                  geometry: {
                    ...feature.geometry,
                    coordinates: newCoordinates,
                  },
                };
              })
              .map(newFeature => {
                return [
                  ...features.slice(0, featureIndex),
                  newFeature,
                  ...features.slice(featureIndex + 1),
                ];
              })
              .map(newFeatures => newFeatures.map(_feature => _feature.geometry))
              .map(newGeometryCollection => {
                return L.geoJson(
                  newGeometryCollection,
                  {
                    style: {
                      color: 'red',
                      fillColor: 'white',
                      fillOpacity: 0.2,
                    },
                    pointToLayer: (pointFeature, latlng) => L.circleMarker(latlng),
                  },
                );
              })
              .do((newIndicator) => {
                indicator.clearLayers();
                newIndicator.eachLayer(layer => {
                  indicator.addLayer(layer);
                })
              })
          })
      })
      .share();

      selectedSurfaceFeaturesIndicatorUpdateByAdjust$.subscribe()

    const editAdjustFeatureSelf$ = Observable
      .zip(
        editAdjustInteractiveMarkerCreate$,
        editAdjustInteractiveMarkerDragend$,
        nearestPointsOnSelectedFeatures$,
        selectedFeatures$,
        editAdjustInteractiveMarkerDragstart$,
      )
      .filter(([interactiveMarker]) => interactiveMarker)
      .switchMap(([interactiveMarker, dragend$, nearestPoint$, features, dragstart$]) => {
        return dragstart$
          .switchMap(() => nearestPoint$.take(1))
          .switchMap((nearestPoint) => {
            return dragend$
              .take(1)
              .map(() => interactiveMarker.getLatLng())
              .map(({ lat, lng }) => [lng, lat])
              .map(position => [position, nearestPoint])
          })
          .map(([position, nearestPoint]) => {
            const {
              is_vertex,
              coordIndex,
              ringIndex,
              featureIndex,
            } = nearestPoint.properties;
            const feature = features[featureIndex];

            const { geometry_type } = feature;
            const originalFeatureCoordinates = feature.geometry.coordinates;

            let updatedFeatureCoordinates = [...originalFeatureCoordinates];

            if (geometry_type === 'Surface') {
              const originalRing = originalFeatureCoordinates[ringIndex];
              const newRing = [...originalRing];

              if (is_vertex) { // 如果拖动的是顶点，那么就替换此座标位置
                newRing.splice(coordIndex, 1, position);
              } else { // 如果拖动的是边，那么插入座标位置
                newRing.splice(coordIndex + 1, 0, position);
              }
              newRing.splice(-1, 1, newRing[0]); // 确保头尾一致

              updatedFeatureCoordinates[ringIndex] = newRing;
            } else if (geometry_type === 'Curve') {
              if (is_vertex) { // 如果拖动的是顶点，那么就替换此座标位置
                originalFeatureCoordinates.splice(coordIndex, 1, position);
              } else { // 如果拖动的是边，那么插入座标位置
                originalFeatureCoordinates.splice(coordIndex + 1, 0, position);
              }
            } else {
              updatedFeatureCoordinates = position;
            }

            const newFeature = {
              ...feature,
              geometry: {
                ...feature.geometry,
                coordinates: updatedFeatureCoordinates,
              },
            };

            const newFeatures = [
              ...features.slice(0, featureIndex),
              newFeature,
              ...features.slice(featureIndex + 1),
            ];

            return [newFeature, newFeatures];
          })
          .do(([newFeature, newFeatures]) => {
            ctx.updateFeature(newFeature);
            featureUpdate$.next(newFeature);
          })
      })
      .share();

    const editAdjust$ = Observable
      .merge(
        selectedSurfaceFeaturesIndicatorUpdateByAdjust$,
        editAdjustInteractiveMarker$,
        editAdjustFeatureSelf$,
      )

    const commandMove$ = keydownOnWindow$
      .filter(evt => evt.shiftKey && evt.code === 'KeyM')
      .share()

    const editMove$ = commandMove$
      .withLatestFrom(
        selectedFeatures$,
        (_, features) => features,
      )
      .withLatestFrom(currentMousePositionPoint$)
      .switchMap(([features, originMousePositionPoint]) => {
        const distance$ = currentMousePositionPoint$
          .map(currentMousePositionPoint => turf.distance(originMousePositionPoint, currentMousePositionPoint));

        const direction$ = currentMousePositionPoint$
          .map(currentMousePositionPoint => turf.bearing(originMousePositionPoint, currentMousePositionPoint));

        return Observable
          .zip(
            distance$,
            direction$,
          )
          .takeUntil(clickOnMap$)
          .map(([distance, direction]) => {
            return features.map(feature => {
              return {
                ...feature,
                geometry: turf.transformTranslate(feature.geometry, distance, direction),
              };
            })
          })
          .do(
            features => features.forEach(feature => ctx.updateFeature(feature)),
            null,
            () => ctx.switchMapState(MODE_EDIT_ADJUST),
          )
      })
      .share()

    const editRotate$ = keydownOnWindow$
      .filter(evt => evt.shiftKey && evt.code === 'KeyR')
      .withLatestFrom(
        selectedFeatures$,
        (_, features) => features,
      )
      .withLatestFrom(
        currentMousePositionPoint$,
        (features, currentMousePositionPoint) => {
          const pivot = turf.center(turf.geometryCollection(features.map(feature => feature.geometry)));
          const startAngle = turf.bearing(pivot, currentMousePositionPoint);
          return [features, pivot, startAngle];
        },
      )
      .switchMap(([features, pivot, startAngle]) => {
        return currentMousePositionPoint$
          .takeUntil(clickOnMap$)
          .map((currentMousePositionPoint) => turf.bearing(pivot, currentMousePositionPoint))
          .map(endAngle => endAngle - startAngle)
          .map(angle => {
            return features.map(feature => {
              return {
                ...feature,
                geometry: turf.transformRotate(feature.geometry, angle, { pivot }),
              };
            })
          })
          .do(
            features => features.forEach(feature => ctx.updateFeature(feature)),
            null,
            () => ctx.switchMapState(MODE_EDIT_ADJUST),
          );
      })
      .share()

    const copiedFeatures$ = commandCopy$
      .withLatestFrom(
        selectedFeatures$,
        (_, features) => features,
      )
      .share();

    const editCopy$ = commandPaste$
      .withLatestFrom(
        copiedFeatures$,
        (_, features) => features,
      )
      .withLatestFrom(currentMousePositionPoint$)
      .switchMap(([features, originMousePositionPoint]) => {
        const distance$ = currentMousePositionPoint$
          .map(currentMousePositionPoint => turf.distance(originMousePositionPoint, currentMousePositionPoint));

        const bearing$ = currentMousePositionPoint$
          .map(currentMousePositionPoint => turf.bearing(originMousePositionPoint, currentMousePositionPoint));

        const pasteIndicator = L.geoJson(turf.featureCollection(features.map(feature => ({ type: 'Feature', ...feature })))).addTo(ctx.leafletMap);

        return Observable
          .zip(
            distance$,
            bearing$,
          )
          .takeUntil(clickOnMap$)
          .map(([distance, bearing]) => {
            return features
              .map(feature => {
                const { id, ...rest } = feature;
                return {
                  ...rest,
                  uuid: uuid(),
                  geometry: turf.transformTranslate(feature.geometry, distance, bearing),
                };
              })
          })
          .do(
            (features) => {
              const featureCollection = turf.featureCollection(features.map(feature => ({ type: 'Feature', ...feature })));
              const newPasteIndicator = L.geoJson(featureCollection);
              pasteIndicator.clearLayers();
              newPasteIndicator.eachLayer(elem => {
                pasteIndicator.addLayer(elem);
              })
            },
            null,
            () => {
              pasteIndicator.off();
              pasteIndicator.remove();
            },
          )
          .last()
          .do(
            (features) => features.forEach(feature => this.createFeature(feature)),
            null,
            () => ctx.switchMapState(MODE_EDIT_ADJUST),
          )
      })
      .share()

    const edit$ = Observable
      .merge(
        selectedFeaturesByClick$,
        editAdjust$,
        editMove$,
        editRotate$,
        editCopy$,
      );

    this.activitySubscription = Observable
      .merge(
        currentMousePositionPoint$,
        features$,
        elements$,
        draw$,
        edit$,
      )
      .subscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataLoaded && !this.props.dataLoaded) {
      const { cartogram, cartogramGeoreference, layers, features } = nextProps;

      let imgTrans;
      if (cartogram.diagram) {
        const anchors = [
          utils.coordsToLatLng(turf.getCoord(cartogramGeoreference.northWest)),
          utils.coordsToLatLng(turf.getCoord(cartogramGeoreference.southWest)),
          utils.coordsToLatLng(turf.getCoord(cartogramGeoreference.southEast)),
          utils.coordsToLatLng(turf.getCoord(cartogramGeoreference.northEast)),
        ];
        imgTrans = L.imageTransform(`/apis/storage/${cartogram.diagram}`, anchors, {
          opacity: 0.9,
        });
        imgTrans.addTo(this.leafletMap);

        this.leafletMap.fitBounds(imgTrans.getBounds());
      } else {
        this.leafletMap.setView(utils.coordsToLatLng(turf.getCoord(cartogram.location)), 19);
      }


      const sortedLayers = layers.sort((a, b) => a.sequence - b.sequence);

      // 添加`pane`并设置`z-index`
      sortedLayers.forEach(layer => {
        const pane = this.leafletMap.createPane(utils.getPaneNameOfLayer(layer), this.leafletMap.getPane('overlayPane'));
        pane.style.zIndex = layer.sequence;
      });


      // 添加 Leaflet.Control.Layers 控件，用来显示隐藏相应的图层
      const baseLayers = {
        高德瓦块图: gtm,
        高德卫星图: gsm,
      };

      const overlays = sortedLayers.reduce((accu, layer) => {
        const paneName = utils.getPaneNameOfLayer(layer);
        const layerGroupElem = L.layerGroup(null, {
          pane: paneName,
        });
        layerGroupElem.addTo(this.leafletMap);
        this.layerGroupStore.set(paneName, layerGroupElem);

        accu[`${layer.name || layer.code} (${layer.is_created_by_system ? 'system' : 'custom'})`] = layerGroupElem;
        return accu;
      }, {});

      const diagramLayers = {};
      if (imgTrans) {
        diagramLayers['底图'] = imgTrans;
      }
      L.control.layers.custom(baseLayers, diagramLayers, overlays).addTo(this.leafletMap);


      features.forEach(feature => {
        this.leafletMap.fire('feature:create', {
          feature,
        });
        this.featureCreate$.next(feature)
      });
    }
  }

  componentWillUnmount() {
    this.activitySubscription.unsubscribe();
  }

  switchMapState = (mapState, params) => {
    this.props.switchMapStateSuccess({
      mapState,
      params,
    });
    this.mapStateStream.next({
      mapState,
      params,
    });
  }


  createFeature = feature => {
    this.leafletMap.fire('feature:create', {
      feature,
    });
    this.featureCreate$.next(feature);
    this.props.createFeatureSuccess(feature);
  }


  updateFeature = feature => {
    this.leafletMap.fire('feature:update', {
      feature,
    });
    this.featureUpdate$.next(feature);
    this.props.updateFeature(feature);
  }


  removeFeature = feature => {
    this.leafletMap.fire('feature:remove', {
      feature,
    });
    this.featureRemove$.next(feature);
    this.props.removeFeatureSuccess(feature);
  }


  render() {
    const {
      selectedFeature,
      mapState,
    } = this.props;

    return (
      <AppShell>
        <Container className="app-container">
          <Sidebar selectedFeature={selectedFeature}>
            {selectedFeature && (
              <FeatureEditor />
            )}
          </Sidebar>

          <MainWindow>
            <Toolbar>
              <MapStateSwitcher />

              <Divider type="vertical" />

              <PersistFeatureButtonGroup />

              <Divider style={{ margin: '10px 0' }} />

              {/* {mapState.startsWith(MODE_EDIT) && (<EdittingModeSwitcher />)} */}
              {mapState.startsWith(MODE_DRAW) && <DrawingModeSwitcher />}
            </Toolbar>
            <MapContainer innerRef={elem => this.mapContainerElem = elem} />
            <div style={{ height: '2em' }}>移动模式：Shift + M，旋转模式：Shift + R，复制模式：Ctrl/Command + C然后Ctrl/Command + V</div>
          </MainWindow>
        </Container>
      </AppShell>
    );
  }
}


const Container = styled.div`
  display: flex;
  flex-direction: row;
`;


const Sidebar = styled.div`
  display: ${props => props.selectedFeature ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  z-index: 1049; ${'' /* 确保z-index不大与antd Select.Option的z-index，否则Option无法被看见 */}
  background-color: white;
  top: 98px;
  right: 20px;
  bottom: 20px;
  width: 24em;
  overflow: auto;
`;


const MainWindow = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Toolbar = styled.div`
  position: absolute;
  left: 60px;
  top: 10px;
  z-index: 800;
`;


const MapContainer = styled.div`
  height: 100%;
`;
