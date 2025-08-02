# Leaflet 坐标转换插件

这是一个用于 Leaflet 地图的坐标转换插件，支持 GPS84（WGS84）、GCJ02（火星坐标）、BD09（百度坐标）之间的相互转换。

## 功能特性

-   ✅ 支持三种主要坐标系转换：GPS84、GCJ02、BD09
-   ✅ 单点坐标转换
-   ✅ 批量坐标转换
-   ✅ 与 Leaflet 地图组件集成
-   ✅ 支持 TrackPlayer 轨迹播放坐标转换
-   ✅ TypeScript 类型支持
-   ✅ 简单易用的 API

## 安装使用

### 1. 引入插件

```javascript
import L from "leaflet";
import "./src/CoordConverter.js";
```

### 2. 基本使用

```javascript
// 单点坐标转换
const gpsCoord = { lng: 116.404, lat: 39.915 }; // 天安门GPS坐标

// GPS84转GCJ02
const gcj02Coord = L.coordConverter.gps84ToGcj02(gpsCoord.lng, gpsCoord.lat);
console.log(gcj02Coord); // { lng: 116.41024449916938, lat: 39.91601738120499 }

// GPS84转BD09
const bd09Coord = L.coordConverter.gps84ToBd09(gpsCoord.lng, gpsCoord.lat);
console.log(bd09Coord); // { lng: 116.41662724378733, lat: 39.92266577467233 }

// 反向转换
const backToGps = L.coordConverter.gcj02ToGps84(gcj02Coord.lng, gcj02Coord.lat);
console.log(backToGps); // 应该接近原始GPS坐标
```

### 3. 批量转换

```javascript
const gpsCoords = [
    { lng: 116.404, lat: 39.915 }, // 天安门
    { lng: 121.473, lat: 31.23 }, // 上海外滩
    { lng: 113.264, lat: 23.129 }, // 广州塔
];

// 批量转换GPS84到GCJ02
const gcj02Coords = L.coordConverter.convertArray(gpsCoords, "gps84", "gcj02");
console.log(gcj02Coords);
```

## API 参考

### L.CoordConverter 类

#### 单点转换方法

-   `gps84ToGcj02(lng, lat)` - GPS84 转 GCJ02
-   `gcj02ToGps84(lng, lat)` - GCJ02 转 GPS84
-   `gps84ToBd09(lng, lat)` - GPS84 转 BD09
-   `bd09ToGps84(lng, lat)` - BD09 转 GPS84
-   `gcj02ToBd09(lng, lat)` - GCJ02 转 BD09
-   `bd09ToGcj02(lng, lat)` - BD09 转 GCJ02

#### 批量转换方法

```javascript
convertArray(coords, fromType, toType);
```

参数：

-   `coords`: 坐标数组 `[{lng, lat}, ...]`
-   `fromType`: 源坐标系 `'gps84'|'gcj02'|'bd09'`
-   `toType`: 目标坐标系 `'gps84'|'gcj02'|'bd09'`

### 全局实例

-   `L.coordConverter` - 全局坐标转换器实例
-   `L.coordConvert()` - 创建新的转换器实例

## 与 Leaflet 集成

### 1. 瓦片图层坐标转换

```javascript
// 创建支持坐标转换的瓦片图层
const tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap contributors",
        coordType: "gcj02", // 指定坐标系类型
    }
).addTo(map);
```

### 2. 与 TrackPlayer 集成

```javascript
// 增强TrackPlayer以支持坐标转换
import { enhanceTrackPlayerWithCoordConversion } from "./src/CoordConverterExample.js";

// 调用增强函数
enhanceTrackPlayerWithCoordConversion();

// 使用带坐标转换的TrackPlayer
const track = [
    { lng: 116.404, lat: 39.915 },
    { lng: 116.407, lat: 39.918 },
    // ... 更多轨迹点
];

const player = new L.TrackPlayer(track, {
    coordType: "gcj02", // 指定输入轨迹的坐标系
    speed: 600,
    // ... 其他选项
}).addTo(map);

// 转换轨迹到不同坐标系
player.convertTrackTo("bd09");
```

## 工具函数

### 检测坐标系类型

```javascript
import { detectCoordType } from "./src/CoordConverterExample.js";

const coordType = detectCoordType(116.404, 39.915);
console.log(coordType); // 'gps84', 'gcj02', 'bd09', 或 'unknown'
```

## 示例

### HTML 示例页面

查看 `examples/coord-converter-demo.html` 文件，这是一个完整的演示页面，展示了：

1. 实时坐标转换
2. 地图上显示不同坐标系的标记
3. 轨迹播放与坐标转换

### 运行示例

```bash
# 在项目根目录启动本地服务器
npx serve examples

# 或者使用Python
python -m http.server 8000

# 然后访问 http://localhost:8000/coord-converter-demo.html
```

## 坐标系说明

### GPS84 (WGS84)

-   国际标准 GPS 坐标系
-   真实的地理坐标
-   适用于国外地图服务

### GCJ02 (火星坐标)

-   中国国家测绘局制定的坐标系
-   在 GPS84 基础上加密偏移
-   高德地图、腾讯地图等使用

### BD09 (百度坐标)

-   百度公司在 GCJ02 基础上二次加密
-   百度地图专用坐标系
-   与其他坐标系偏差最大

## 注意事项

1. **精度问题**：坐标转换存在微小误差，多次转换会累积误差
2. **适用范围**：转换算法主要适用于中国境内，境外精度可能降低
3. **性能考虑**：大量坐标转换时建议使用批量转换方法
4. **坐标顺序**：注意经纬度顺序，本插件使用 `{lng, lat}` 格式

## TypeScript 支持

插件提供完整的 TypeScript 类型定义，支持 IDE 智能提示：

```typescript
import { CoordType, CoordPoint, detectCoordType } from "./src/CoordConverter";

const point: CoordPoint = { lng: 116.404, lat: 39.915 };
const coordType: CoordType = "gps84";
const result = L.coordConverter.gps84ToGcj02(point.lng, point.lat);
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个插件！
