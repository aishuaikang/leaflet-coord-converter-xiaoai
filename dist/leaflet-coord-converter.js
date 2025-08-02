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
  bd09ToGps84(o, t) {
    const s = this.bd09ToGcj02(o, t);
    return this.gcj02ToGps84(s.lng, s.lat);
  }
  /**
   * GPS84坐标转百度坐标
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gps84ToBd09(o, t) {
    const s = this.gps84ToGcj02(o, t);
    return this.gcj02ToBd09(s.lng, s.lat);
  }
  /**
   * GPS84坐标转火星坐标(GCJ02)
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gps84ToGcj02(o, t) {
    let s = this._transformLat(o - 105, t - 35), i = this._transformLng(o - 105, t - 35);
    const h = t / 180 * this.pi;
    let n = Math.sin(h);
    n = 1 - this.ee * n * n;
    const a = Math.sqrt(n);
    s = s * 180 / (this.a * (1 - this.ee) / (n * a) * this.pi), i = i * 180 / (this.a / a * Math.cos(h) * this.pi);
    const e = t + s;
    return {
      lng: o + i,
      lat: e
    };
  }
  /**
   * 火星坐标(GCJ02)转GPS84坐标
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gcj02ToGps84(o, t) {
    const s = this._transform(o, t), i = o * 2 - s.lng, h = t * 2 - s.lat;
    return {
      lng: i,
      lat: h
    };
  }
  /**
   * 火星坐标(GCJ02)转百度坐标
   * @param {number} lng 经度
   * @param {number} lat 纬度
   * @returns {Object} {lng, lat}
   */
  gcj02ToBd09(o, t) {
    const s = Math.sqrt(o * o + t * t) + 2e-5 * Math.sin(t * this.x_pi), i = Math.atan2(t, o) + 3e-6 * Math.cos(o * this.x_pi), h = s * Math.cos(i) + 65e-4, n = s * Math.sin(i) + 6e-3;
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
  bd09ToGcj02(o, t) {
    const s = o - 65e-4, i = t - 6e-3, h = Math.sqrt(s * s + i * i) - 2e-5 * Math.sin(i * this.x_pi), n = Math.atan2(i, s) - 3e-6 * Math.cos(s * this.x_pi), a = h * Math.cos(n), e = h * Math.sin(n);
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
  convertArray(o, t, s) {
    if (t === s) return o;
    const i = {
      gps84_gcj02: this.gps84ToGcj02.bind(this),
      gps84_bd09: this.gps84ToBd09.bind(this),
      gcj02_gps84: this.gcj02ToGps84.bind(this),
      gcj02_bd09: this.gcj02ToBd09.bind(this),
      bd09_gps84: this.bd09ToGps84.bind(this),
      bd09_gcj02: this.bd09ToGcj02.bind(this)
    }, h = `${t}_${s}`, n = i[h];
    if (!n)
      throw new Error(`不支持的转换类型: ${t} -> ${s}`);
    return o.map((a) => n(a.lng, a.lat));
  }
  /**
   * 私有方法：坐标变换
   */
  _transform(o, t) {
    let s = this._transformLat(o - 105, t - 35), i = this._transformLng(o - 105, t - 35);
    const h = t / 180 * this.pi;
    let n = Math.sin(h);
    n = 1 - this.ee * n * n;
    const a = Math.sqrt(n);
    s = s * 180 / (this.a * (1 - this.ee) / (n * a) * this.pi), i = i * 180 / (this.a / a * Math.cos(h) * this.pi);
    const e = t + s;
    return {
      lng: o + i,
      lat: e
    };
  }
  /**
   * 私有方法：纬度变换
   */
  _transformLat(o, t) {
    let s = -100 + 2 * o + 3 * t + 0.2 * t * t + 0.1 * o * t + 0.2 * Math.sqrt(Math.abs(o));
    return s += (20 * Math.sin(6 * o * this.pi) + 20 * Math.sin(2 * o * this.pi)) * 2 / 3, s += (20 * Math.sin(t * this.pi) + 40 * Math.sin(t / 3 * this.pi)) * 2 / 3, s += (160 * Math.sin(t / 12 * this.pi) + 320 * Math.sin(t * this.pi / 30)) * 2 / 3, s;
  }
  /**
   * 私有方法：经度变换
   */
  _transformLng(o, t) {
    let s = 300 + o + 2 * t + 0.1 * o * o + 0.1 * o * t + 0.1 * Math.sqrt(Math.abs(o));
    return s += (20 * Math.sin(6 * o * this.pi) + 20 * Math.sin(2 * o * this.pi)) * 2 / 3, s += (20 * Math.sin(o * this.pi) + 40 * Math.sin(o / 3 * this.pi)) * 2 / 3, s += (150 * Math.sin(o / 12 * this.pi) + 300 * Math.sin(o / 30 * this.pi)) * 2 / 3, s;
  }
};
r.coordConverter = new r.CoordConverter();
r.coordConvert = function() {
  return r.coordConverter;
};
r.GridLayer.include({
  _setZoomTransform: function(o, t, s) {
    let i = t;
    i != null && this.options && (this.options.currentType === "gps84" && (this.options.coordType === "gcj02" ? i = r.coordConverter.gps84ToGcj02(
      t.lng,
      t.lat
    ) : this.options.coordType === "bd09" && (i = r.coordConverter.gps84ToBd09(
      t.lng,
      t.lat
    ))), this.options.currentType === "gcj02" && (this.options.coordType === "gps84" ? i = r.coordConverter.gcj02ToGps84(
      t.lng,
      t.lat
    ) : this.options.coordType === "bd09" && (i = r.coordConverter.gcj02ToBd09(
      t.lng,
      t.lat
    ))), this.options.currentType === "bd09" && (this.options.coordType === "gps84" ? i = r.coordConverter.bd09ToGps84(
      t.lng,
      t.lat
    ) : this.options.coordType === "gcj02" && (i = r.coordConverter.bd09ToGcj02(
      t.lng,
      t.lat
    ))));
    const h = this._map.getZoomScale(s, o.zoom), n = o.origin.multiplyBy(h).subtract(this._map._getNewPixelOrigin(i, s)).round();
    r.Browser.any3d ? r.DomUtil.setTransform(o.el, n, h) : r.DomUtil.setPosition(o.el, n);
  },
  _getTiledPixelBounds: function(o) {
    let t = o;
    t != null && this.options && this.options.currentType === "gps84" && (this.options.coordType === "gcj02" ? t = r.coordConverter.gps84ToGcj02(
      o.lng,
      o.lat
    ) : this.options.coordType === "bd09" && (t = r.coordConverter.gps84ToBd09(
      o.lng,
      o.lat
    ))), this.options.currentType === "gcj02" && (this.options.coordType === "gps84" ? t = r.coordConverter.gcj02ToGps84(
      o.lng,
      o.lat
    ) : this.options.coordType === "bd09" && (t = r.coordConverter.gcj02ToBd09(o.lng, o.lat))), this.options.currentType === "bd09" && (this.options.coordType === "gps84" ? t = r.coordConverter.bd09ToGps84(o.lng, o.lat) : this.options.coordType === "gcj02" && (t = r.coordConverter.bd09ToGcj02(o.lng, o.lat)));
    const s = this._map, i = s._animatingZoom ? Math.max(s._animateToZoom, s.getZoom()) : s.getZoom(), h = s.getZoomScale(i, this._tileZoom), n = s.project(t, this._tileZoom).floor(), a = s.getSize().divideBy(h * 2);
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
