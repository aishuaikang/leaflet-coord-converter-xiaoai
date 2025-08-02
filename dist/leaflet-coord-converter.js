import r from "leaflet";
r.CoordConverter = class {
  constructor() {
    this.pi = Math.PI, this.a = 6378245, this.ee = 0.006693421622965943, this.x_pi = this.pi * 3e3 / 180, this.R = 6378137;
  }
  /**
   * 百度坐标转GPS84坐标
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  bd09ToGps84(t, s) {
    const i = this.bd09ToGcj02(t, s);
    return this.gcj02ToGps84(i.lng, i.lat);
  }
  /**
   * GPS84坐标转百度坐标
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gps84ToBd09(t, s) {
    const i = this.gps84ToGcj02(t, s);
    return this.gcj02ToBd09(i.lng, i.lat);
  }
  /**
   * GPS84坐标转火星坐标(GCJ02)
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gps84ToGcj02(t, s) {
    let i = this._transformLat(t - 105, s - 35), o = this._transformLng(t - 105, s - 35);
    const h = s / 180 * this.pi;
    let n = Math.sin(h);
    n = 1 - this.ee * n * n;
    const a = Math.sqrt(n);
    i = i * 180 / (this.a * (1 - this.ee) / (n * a) * this.pi), o = o * 180 / (this.a / a * Math.cos(h) * this.pi);
    const e = s + i;
    return {
      lng: t + o,
      lat: e
    };
  }
  /**
   * 火星坐标(GCJ02)转GPS84坐标
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gcj02ToGps84(t, s) {
    const i = this._transform(t, s), o = t * 2 - i.lng, h = s * 2 - i.lat;
    return {
      lng: o,
      lat: h
    };
  }
  /**
   * 火星坐标(GCJ02)转百度坐标
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gcj02ToBd09(t, s) {
    const i = Math.sqrt(t * t + s * s) + 2e-5 * Math.sin(s * this.x_pi), o = Math.atan2(s, t) + 3e-6 * Math.cos(t * this.x_pi), h = i * Math.cos(o) + 65e-4, n = i * Math.sin(o) + 6e-3;
    return {
      lng: h,
      lat: n
    };
  }
  /**
   * 百度坐标转火星坐标(GCJ02)
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  bd09ToGcj02(t, s) {
    const i = t - 65e-4, o = s - 6e-3, h = Math.sqrt(i * i + o * o) - 2e-5 * Math.sin(o * this.x_pi), n = Math.atan2(o, i) - 3e-6 * Math.cos(i * this.x_pi), a = h * Math.cos(n), e = h * Math.sin(n);
    return {
      lng: a,
      lat: e
    };
  }
  /**
   * 批量转换坐标数组
   * @param {Array} coords 坐标数组 [{lng, lat}, ...]
   * @param {string} fromType 源坐标系类型 'gps84'|'gcj02'|'bd09'
   * @param {string} toType 目标坐标系类型 'gps84'|'gcj02'|'bd09'
   * @returns {Array} 转换后的坐标数组
   */
  convertArray(t, s, i) {
    if (s === i) return t;
    const o = {
      gps84_gcj02: this.gps84ToGcj02.bind(this),
      gps84_bd09: this.gps84ToBd09.bind(this),
      gcj02_gps84: this.gcj02ToGps84.bind(this),
      gcj02_bd09: this.gcj02ToBd09.bind(this),
      bd09_gps84: this.bd09ToGps84.bind(this),
      bd09_gcj02: this.bd09ToGcj02.bind(this)
    }, h = `${s}_${i}`, n = o[h];
    if (!n)
      throw new Error(`不支持的转换类型: ${s} -> ${i}`);
    return t.map((a) => n(a.lng, a.lat));
  }
  /**
   * 私有方法：坐标变换
   */
  _transform(t, s) {
    let i = this._transformLat(t - 105, s - 35), o = this._transformLng(t - 105, s - 35);
    const h = s / 180 * this.pi;
    let n = Math.sin(h);
    n = 1 - this.ee * n * n;
    const a = Math.sqrt(n);
    i = i * 180 / (this.a * (1 - this.ee) / (n * a) * this.pi), o = o * 180 / (this.a / a * Math.cos(h) * this.pi);
    const e = s + i;
    return {
      lng: t + o,
      lat: e
    };
  }
  /**
   * 私有方法：纬度变换
   */
  _transformLat(t, s) {
    let i = -100 + 2 * t + 3 * s + 0.2 * s * s + 0.1 * t * s + 0.2 * Math.sqrt(Math.abs(t));
    return i += (20 * Math.sin(6 * t * this.pi) + 20 * Math.sin(2 * t * this.pi)) * 2 / 3, i += (20 * Math.sin(s * this.pi) + 40 * Math.sin(s / 3 * this.pi)) * 2 / 3, i += (160 * Math.sin(s / 12 * this.pi) + 320 * Math.sin(s * this.pi / 30)) * 2 / 3, i;
  }
  /**
   * 私有方法：经度变换
   */
  _transformLng(t, s) {
    let i = 300 + t + 2 * s + 0.1 * t * t + 0.1 * t * s + 0.1 * Math.sqrt(Math.abs(t));
    return i += (20 * Math.sin(6 * t * this.pi) + 20 * Math.sin(2 * t * this.pi)) * 2 / 3, i += (20 * Math.sin(t * this.pi) + 40 * Math.sin(t / 3 * this.pi)) * 2 / 3, i += (150 * Math.sin(t / 12 * this.pi) + 300 * Math.sin(t / 30 * this.pi)) * 2 / 3, i;
  }
};
r.coordConverter = new r.CoordConverter();
r.coordConvert = function() {
  return r.coordConverter;
};
r.GridLayer.include({
  _setZoomTransform: function(t, s, i) {
    let o = s;
    o != null && this.options && (this.options.coordType === "gcj02" ? o = r.coordConverter.gps84ToGcj02(
      s.lng,
      s.lat
    ) : this.options.coordType === "bd09" && (o = r.coordConverter.gps84ToBd09(s.lng, s.lat)));
    const h = this._map.getZoomScale(i, t.zoom), n = t.origin.multiplyBy(h).subtract(this._map._getNewPixelOrigin(o, i)).round();
    r.Browser.any3d ? r.DomUtil.setTransform(t.el, n, h) : r.DomUtil.setPosition(t.el, n);
  },
  _getTiledPixelBounds: function(t) {
    let s = t;
    s != null && this.options && (this.options.coordType === "gcj02" ? s = r.coordConverter.gps84ToGcj02(
      t.lng,
      t.lat
    ) : this.options.coordType === "bd09" && (s = r.coordConverter.gps84ToBd09(t.lng, t.lat)));
    const i = this._map, o = i._animatingZoom ? Math.max(i._animateToZoom, i.getZoom()) : i.getZoom(), h = i.getZoomScale(o, this._tileZoom), n = i.project(s, this._tileZoom).floor(), a = i.getSize().divideBy(h * 2);
    return new r.Bounds(
      n.subtract(a),
      n.add(a)
    );
  }
});
const d = r.CoordConverter;
export {
  d as default
};
