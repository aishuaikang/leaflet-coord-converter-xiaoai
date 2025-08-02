// 导入 Leaflet
import * as L from "leaflet";

// 通过引入类型定义文件来扩展 Leaflet 的类型
/// <reference path="../src/CoordConverter.d.ts" />

/**
 * TypeScript 类型测试示例
 * 这个文件主要用于验证类型定义是否正确
 */
class TypeScriptDemo {
    private map: L.Map;

    constructor() {
        // 初始化地图
        this.map = L.map("map").setView([39.915, 116.404], 13);

        // 测试关键功能：扩展的 TileLayer 选项，支持 coordType 属性
        // 这是你提到的关键用法：
        const tileLayerOptions: L.TileLayerOptions = {
            attribution: "Leaflet高德离线地图",
            coordType: "gcj02", // 现在这里应该没有错误了
            tms: true,
        };

        L.tileLayer("tiles/{z}/{x}/{y}.png", tileLayerOptions).addTo(this.map);

        // 或者直接使用内联形式（你提到的用法）：
        L.tileLayer("tiles/{z}/{x}/{y}.png", {
            attribution: "Leaflet高德离线地图",
            coordType: "gcj02", // 这行很重要 - 现在应该支持 coordType
            tms: true,
        }).addTo(this.map);
    }

    /**
     * 测试坐标转换器实例
     */
    testCoordConverter(): void {
        // 使用类型安全的方式测试坐标转换器
        // 注意：运行时可能需要实际的实现
        try {
            // 如果 L.coordConverter 在类型定义中存在，这里不应该有编译错误
            const converter = (L as any).coordConverter;

            if (converter) {
                const originalCoord = { lng: 116.404, lat: 39.915 };

                // 测试各种转换方法
                const gcj02Result = converter.gps84ToGcj02(
                    originalCoord.lng,
                    originalCoord.lat
                );

                console.log("Original GPS84:", originalCoord);
                console.log("Converted to GCJ02:", gcj02Result);

                // 在地图上显示标记
                this.addMarkersToMap(originalCoord, gcj02Result);
            } else {
                console.warn(
                    "L.coordConverter 实例在运行时不存在（仅测试类型定义）"
                );
            }
        } catch (error) {
            console.log("运行时错误（这在类型测试中是正常的）:", error);
        }
    }

    /**
     * 测试不同类型的图层选项 - 这是核心测试
     */
    testLayerOptions(): void {
        console.log("=== 测试图层选项类型定义 ===");

        // 1. 测试 TileLayer 选项类型定义
        const tileLayerOptions: L.TileLayerOptions = {
            attribution: "高德地图",
            coordType: "gcj02", // 关键测试：这应该通过类型检查
            maxZoom: 18,
            tms: true,
        };

        const baiduOptions: L.TileLayerOptions = {
            attribution: "百度地图",
            coordType: "bd09", // 关键测试：这应该通过类型检查
            maxZoom: 18,
            tms: true,
        };

        const gpsOptions: L.TileLayerOptions = {
            attribution: "GPS地图",
            coordType: "gps84", // 关键测试：这应该通过类型检查
            maxZoom: 18,
        };

        console.log("✓ TileLayer options (类型检查通过):", {
            tileLayerOptions,
            baiduOptions,
            gpsOptions,
        });

        // 2. 测试 GridLayer 选项类型定义
        const gridLayerOptions: L.GridLayerOptions = {
            coordType: "bd09", // 关键测试：这应该通过类型检查
            tileSize: 256,
        };

        console.log("✓ GridLayer options (类型检查通过):", gridLayerOptions);

        // 3. 测试实际图层创建
        try {
            const _gaodeLayer = L.tileLayer(
                "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
                {
                    attribution: "高德地图",
                    coordType: "gcj02", // 关键测试点
                    maxZoom: 18,
                }
            );

            console.log("✓ 成功创建带有 coordType 的图层");
        } catch (error) {
            console.log(
                "创建图层时的运行时错误（类型检查可能仍然成功）:",
                error
            );
        }
    }

    /**
     * 测试类型安全性和错误检查
     */
    testTypeSafety(): void {
        console.log("=== 类型安全性测试 ===");

        // 这些应该通过类型检查
        const validCoordTypes: ("gps84" | "gcj02" | "bd09")[] = [
            "gps84",
            "gcj02",
            "bd09",
        ];
        console.log("✓ 有效的坐标类型:", validCoordTypes);

        // 测试坐标点接口
        const coord: { lng: number; lat: number } = {
            lng: 116.404,
            lat: 39.915,
        };
        console.log("✓ 坐标点类型检查通过:", coord);

        // 测试图层选项的类型安全
        const safeTileOptions: L.TileLayerOptions = {
            coordType: "gcj02", // 只允许指定的字符串字面量类型
            attribution: "测试地图",
        };
        console.log("✓ 图层选项类型检查通过:", safeTileOptions);

        // 注释掉的代码 - 这些应该产生 TypeScript 编译错误：
        /*
        const invalidOptions: L.TileLayerOptions = {
            coordType: "invalid",  // 这应该产生编译错误
            attribution: "测试"
        };
        
        const invalidCoord: { lng: string; lat: number } = { lng: "invalid", lat: 39.915 }; // 错误类型
        */

        console.log("✓ 类型安全性测试完成");
    }

    /**
     * 在地图上添加标记
     */
    private addMarkersToMap(
        gps84: { lng: number; lat: number },
        gcj02: { lng: number; lat: number }
    ): void {
        try {
            // GPS84标记
            const _gps84Marker = L.marker([gps84.lat, gps84.lng])
                .addTo(this.map)
                .bindPopup(
                    `GPS84: ${gps84.lng.toFixed(6)}, ${gps84.lat.toFixed(6)}`
                );

            // GCJ02标记
            const _gcj02Marker = L.marker([gcj02.lat, gcj02.lng])
                .addTo(this.map)
                .bindPopup(
                    `GCJ02: ${gcj02.lng.toFixed(6)}, ${gcj02.lat.toFixed(6)}`
                );

            console.log("✓ 标记已添加到地图");
        } catch (error) {
            console.log("添加标记时的错误:", error);
        }
    }

    /**
     * 运行所有测试
     */
    runAllTests(): void {
        console.log("🚀 开始 TypeScript 类型检查测试...");
        console.log("主要测试目标：验证 TileLayer 的 coordType 属性类型定义");

        this.testLayerOptions(); // 这是最重要的测试
        this.testTypeSafety();
        this.testCoordConverter();

        console.log("✅ 所有测试完成!");
        console.log("如果上面没有 TypeScript 编译错误，说明类型定义正确工作！");
        console.log("特别是 L.tileLayer 的 coordType 属性应该可以正常使用。");
    }
}

// 导出类以供其他文件使用
export { TypeScriptDemo };

// 如果在浏览器环境中直接运行
if (typeof window !== "undefined") {
    // 等待DOM加载完成
    document.addEventListener("DOMContentLoaded", () => {
        const demo = new TypeScriptDemo();
        demo.runAllTests();

        // 将demo实例暴露到全局作用域以便调试
        (window as any).coordDemo = demo;

        console.log("📋 TypeScript Demo 已加载");
        console.log("🔍 请检查控制台是否有 TypeScript 编译错误");
        console.log("✨ 如果没有错误，说明你的用法是正确的：");
        console.log(
            '   L.tileLayer("tiles/{z}/{x}/{y}.png", { coordType: "gcj02", ... })'
        );
    });
}
