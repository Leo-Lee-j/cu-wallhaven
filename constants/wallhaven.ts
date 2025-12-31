/**
 * Wallhaven 应用常量配置
 */

// 筛选选项类型
export type OptionItem = {
	label: string;
	value: string;
}

// 排序选项
export const SORTING_OPTIONS: OptionItem[] = [
	{ label: "最新", value: "date_added" },
	{ label: "热门", value: "toplist" },
	{ label: "随机", value: "random" },
	{ label: "浏览", value: "views" }
];

// 热门时间范围选项
export const TOP_RANGE_OPTIONS: OptionItem[] = [
	{ label: "1天", value: "1d" },
	{ label: "3天", value: "3d" },
	{ label: "1周", value: "1w" },
	{ label: "1月", value: "1M" },
	{ label: "3月", value: "3M" },
	{ label: "6月", value: "6M" },
	{ label: "1年", value: "1y" }
];

// 宽高比选项
export const RATIO_OPTIONS: OptionItem[] = [
	{ label: "16x9", value: "16x9" },
	{ label: "16x10", value: "16x10" },
	{ label: "21x9", value: "21x9" },
	{ label: "32x9", value: "32x9" },
	{ label: "9x16", value: "9x16" },
	{ label: "10x16", value: "10x16" }
];

// 颜色选项类型
export type ColorOption = {
	value: string;
}

// 颜色选项 - 来自 Wallhaven API 文档的24种预设颜色
export const COLOR_OPTIONS: ColorOption[] = [
	{ value: "660000" },
	{ value: "990000" },
	{ value: "cc0000" },
	{ value: "cc3333" },
	{ value: "ea4c88" },
	{ value: "993399" },
	{ value: "663399" },
	{ value: "333399" },
	{ value: "0066cc" },
	{ value: "0099cc" },
	{ value: "66cccc" },
	{ value: "77cc33" },
	{ value: "669900" },
	{ value: "336600" },
	{ value: "666600" },
	{ value: "999900" },
	{ value: "cccc33" },
	{ value: "ffff00" },
	{ value: "ffcc33" },
	{ value: "ff9900" },
	{ value: "ff6600" },
	{ value: "cc6633" },
	{ value: "996633" },
	{ value: "663300" }
];

// 分类标签映射
const CATEGORY_LABELS = new Map<string, string>([
	["general", "综合"],
	["anime", "动漫"],
	["people", "人物"]
]);

// 纯度标签映射
const PURITY_LABELS = new Map<string, string>([
	["sfw", "安全"],
	["sketchy", "轻微"],
	["nsfw", "成人"]
]);

// 纯度类型映射（用于标签颜色）
const PURITY_TYPES = new Map<string, string>([
	["sfw", "success"],
	["sketchy", "warning"],
	["nsfw", "error"]
]);

// 工具函数：获取分类标签
export function getCategoryLabel(category: string): string {
	const label = CATEGORY_LABELS.get(category);
	return label != null ? label : category;
}

// 工具函数：获取纯度标签
export function getPurityLabel(purity: string): string {
	const label = PURITY_LABELS.get(purity);
	return label != null ? label : purity;
}

// 工具函数：获取纯度类型（用于标签颜色）
export function getPurityType(purity: string): any {
	const type = PURITY_TYPES.get(purity);
	return type != null ? type : "info";
}
