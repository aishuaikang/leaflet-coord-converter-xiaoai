import * as L from "leaflet";

declare module "leaflet" {
    namespace L {
        /**
         * 坐标转换器类
         */
        class CoordConverter {
            /**
             * 百度坐标转GPS84坐标
             */
            bd09ToGps84(lng: number, lat: number): { lng: number; lat: number };

            /**
             * GPS84坐标转百度坐标
             */
            gps84ToBd09(lng: number, lat: number): { lng: number; lat: number };

            /**
             * GPS84坐标转火星坐标(GCJ02)
             */
            gps84ToGcj02(
                lng: number,
                lat: number
            ): { lng: number; lat: number };

            /**
             * 火星坐标(GCJ02)转GPS84坐标
             */
            gcj02ToGps84(
                lng: number,
                lat: number
            ): { lng: number; lat: number };

            /**
             * 火星坐标(GCJ02)转百度坐标
             */
            gcj02ToBd09(lng: number, lat: number): { lng: number; lat: number };

            /**
             * 百度坐标转火星坐标(GCJ02)
             */
            bd09ToGcj02(lng: number, lat: number): { lng: number; lat: number };

            /**
             * 批量转换坐标数组
             */
            convertArray(
                coords: Array<{ lng: number; lat: number }>,
                fromType: "gps84" | "gcj02" | "bd09",
                toType: "gps84" | "gcj02" | "bd09"
            ): Array<{ lng: number; lat: number }>;
        }

        /**
         * 全局坐标转换器实例
         */
        const coordConverter: CoordConverter;

        /**
         * 创建坐标转换器实例的便捷方法
         */
        function coordConvert(): CoordConverter;

        /**
         * 扩展GridLayer选项以支持坐标转换
         */
        interface GridLayerOptions {
            /**
             * 坐标系类型
             */
            coordType?: "gps84" | "gcj02" | "bd09";
        }

        /**
         * 扩展TrackPlayer选项以支持坐标转换
         */
        interface TrackPlayerOptions {
            /**
             * 输入轨迹的坐标系类型
             */
            coordType?: "gps84" | "gcj02" | "bd09";
        }
    }
}

/**
 * 坐标类型
 */
export type CoordType = "gps84" | "gcj02" | "bd09";

/**
 * 坐标点接口
 */
export interface CoordPoint {
    lng: number;
    lat: number;
}

/**
 * 坐标转换结果
 */
export interface ConvertResult {
    lng: number;
    lat: number;
}

/**
 * 工具函数：检测坐标系类型
 */
export declare function detectCoordType(
    lng: number,
    lat: number
): CoordType | "unknown";

/**
 * 工具函数：创建支持坐标转换的地图
 */
export declare function createMapWithCoordConversion(): L.Map;

/**
 * 工具函数：增强TrackPlayer以支持坐标转换
 */
export declare function enhanceTrackPlayerWithCoordConversion(): void;
