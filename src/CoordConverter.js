import L from "leaflet";

/**
 * 坐标转换插件
 * 支持GPS84、GCJ02(火星坐标)、BD09(百度坐标)之间的相互转换
 */
L.CoordConverter = class {
    constructor() {
        // 常量定义
        this.pi = Math.PI;
        this.a = 6378245.0;
        this.ee = 0.006693421622965943;
        this.x_pi = (this.pi * 3000.0) / 180.0;
        this.R = 6378137;
    }

    /**
     * 百度坐标转GPS84坐标
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @returns {Object} {lng, lat}
     */
    bd09ToGps84(lng, lat) {
        const gcj02 = this.bd09ToGcj02(lng, lat);
        const gps84 = this.gcj02ToGps84(gcj02.lng, gcj02.lat);
        return gps84;
    }

    /**
     * GPS84坐标转百度坐标
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @returns {Object} {lng, lat}
     */
    gps84ToBd09(lng, lat) {
        const gcj02 = this.gps84ToGcj02(lng, lat);
        const bd09 = this.gcj02ToBd09(gcj02.lng, gcj02.lat);
        return bd09;
    }

    /**
     * GPS84坐标转火星坐标(GCJ02)
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @returns {Object} {lng, lat}
     */
    gps84ToGcj02(lng, lat) {
        let dLat = this._transformLat(lng - 105.0, lat - 35.0);
        let dLng = this._transformLng(lng - 105.0, lat - 35.0);
        const radLat = (lat / 180.0) * this.pi;
        let magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLat =
            (dLat * 180.0) /
            (((this.a * (1 - this.ee)) / (magic * sqrtMagic)) * this.pi);
        dLng =
            (dLng * 180.0) /
            ((this.a / sqrtMagic) * Math.cos(radLat) * this.pi);
        const mgLat = lat + dLat;
        const mgLng = lng + dLng;
        return {
            lng: mgLng,
            lat: mgLat,
        };
    }

    /**
     * 火星坐标(GCJ02)转GPS84坐标
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @returns {Object} {lng, lat}
     */
    gcj02ToGps84(lng, lat) {
        const coord = this._transform(lng, lat);
        const longitude = lng * 2 - coord.lng;
        const latitude = lat * 2 - coord.lat;
        return {
            lng: longitude,
            lat: latitude,
        };
    }

    /**
     * 火星坐标(GCJ02)转百度坐标
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @returns {Object} {lng, lat}
     */
    gcj02ToBd09(lng, lat) {
        const z =
            Math.sqrt(lng * lng + lat * lat) +
            0.00002 * Math.sin(lat * this.x_pi);
        const theta =
            Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_pi);
        const bd_lng = z * Math.cos(theta) + 0.0065;
        const bd_lat = z * Math.sin(theta) + 0.006;
        return {
            lng: bd_lng,
            lat: bd_lat,
        };
    }

    /**
     * 百度坐标转火星坐标(GCJ02)
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @returns {Object} {lng, lat}
     */
    bd09ToGcj02(lng, lat) {
        const x = lng - 0.0065;
        const y = lat - 0.006;
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        const gg_lng = z * Math.cos(theta);
        const gg_lat = z * Math.sin(theta);
        return {
            lng: gg_lng,
            lat: gg_lat,
        };
    }

    /**
     * 批量转换坐标数组
     * @param {Array} coords 坐标数组 [{lng, lat}, ...]
     * @param {string} fromType 源坐标系类型 'gps84'|'gcj02'|'bd09'
     * @param {string} toType 目标坐标系类型 'gps84'|'gcj02'|'bd09'
     * @returns {Array} 转换后的坐标数组
     */
    convertArray(coords, fromType, toType) {
        if (fromType === toType) return coords;

        const methodMap = {
            gps84_gcj02: this.gps84ToGcj02.bind(this),
            gps84_bd09: this.gps84ToBd09.bind(this),
            gcj02_gps84: this.gcj02ToGps84.bind(this),
            gcj02_bd09: this.gcj02ToBd09.bind(this),
            bd09_gps84: this.bd09ToGps84.bind(this),
            bd09_gcj02: this.bd09ToGcj02.bind(this),
        };

        const methodKey = `${fromType}_${toType}`;
        const convertMethod = methodMap[methodKey];

        if (!convertMethod) {
            throw new Error(`不支持的转换类型: ${fromType} -> ${toType}`);
        }

        return coords.map((coord) => convertMethod(coord.lng, coord.lat));
    }

    /**
     * 私有方法：坐标变换
     */
    _transform(lng, lat) {
        let dLat = this._transformLat(lng - 105.0, lat - 35.0);
        let dLng = this._transformLng(lng - 105.0, lat - 35.0);
        const radLat = (lat / 180.0) * this.pi;
        let magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLat =
            (dLat * 180.0) /
            (((this.a * (1 - this.ee)) / (magic * sqrtMagic)) * this.pi);
        dLng =
            (dLng * 180.0) /
            ((this.a / sqrtMagic) * Math.cos(radLat) * this.pi);
        const mgLat = lat + dLat;
        const mgLng = lng + dLng;
        return {
            lng: mgLng,
            lat: mgLat,
        };
    }

    /**
     * 私有方法：纬度变换
     */
    _transformLat(x, y) {
        let ret =
            -100.0 +
            2.0 * x +
            3.0 * y +
            0.2 * y * y +
            0.1 * x * y +
            0.2 * Math.sqrt(Math.abs(x));
        ret +=
            ((20.0 * Math.sin(6.0 * x * this.pi) +
                20.0 * Math.sin(2.0 * x * this.pi)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(y * this.pi) +
                40.0 * Math.sin((y / 3.0) * this.pi)) *
                2.0) /
            3.0;
        ret +=
            ((160.0 * Math.sin((y / 12.0) * this.pi) +
                320 * Math.sin((y * this.pi) / 30.0)) *
                2.0) /
            3.0;
        return ret;
    }

    /**
     * 私有方法：经度变换
     */
    _transformLng(x, y) {
        let ret =
            300.0 +
            x +
            2.0 * y +
            0.1 * x * x +
            0.1 * x * y +
            0.1 * Math.sqrt(Math.abs(x));
        ret +=
            ((20.0 * Math.sin(6.0 * x * this.pi) +
                20.0 * Math.sin(2.0 * x * this.pi)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(x * this.pi) +
                40.0 * Math.sin((x / 3.0) * this.pi)) *
                2.0) /
            3.0;
        ret +=
            ((150.0 * Math.sin((x / 12.0) * this.pi) +
                300.0 * Math.sin((x / 30.0) * this.pi)) *
                2.0) /
            3.0;
        return ret;
    }
};

// 创建全局实例
L.coordConverter = new L.CoordConverter();

// 便捷方法
L.coordConvert = function () {
    return L.coordConverter;
};

// 扩展GridLayer以支持坐标转换
L.GridLayer.include({
    _setZoomTransform: function (level, _center, zoom) {
        let center = _center;
        if (center != undefined && this.options) {
            if (this.options.coordType === "gcj02") {
                center = L.coordConverter.gps84ToGcj02(
                    _center.lng,
                    _center.lat
                );
            } else if (this.options.coordType === "bd09") {
                center = L.coordConverter.gps84ToBd09(_center.lng, _center.lat);
            }
        }
        const scale = this._map.getZoomScale(zoom, level.zoom);
        const translate = level.origin
            .multiplyBy(scale)
            .subtract(this._map._getNewPixelOrigin(center, zoom))
            .round();

        if (L.Browser.any3d) {
            L.DomUtil.setTransform(level.el, translate, scale);
        } else {
            L.DomUtil.setPosition(level.el, translate);
        }
    },

    _getTiledPixelBounds: function (_center) {
        let center = _center;
        if (center != undefined && this.options) {
            if (this.options.coordType === "gcj02") {
                center = L.coordConverter.gps84ToGcj02(
                    _center.lng,
                    _center.lat
                );
            } else if (this.options.coordType === "bd09") {
                center = L.coordConverter.gps84ToBd09(_center.lng, _center.lat);
            }
        }
        const map = this._map;
        const mapZoom = map._animatingZoom
            ? Math.max(map._animateToZoom, map.getZoom())
            : map.getZoom();
        const scale = map.getZoomScale(mapZoom, this._tileZoom);
        const pixelCenter = map.project(center, this._tileZoom).floor();
        const halfSize = map.getSize().divideBy(scale * 2);

        return new L.Bounds(
            pixelCenter.subtract(halfSize),
            pixelCenter.add(halfSize)
        );
    },
});

export default L.CoordConverter;
