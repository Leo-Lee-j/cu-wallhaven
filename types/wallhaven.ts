/**
 * Wallhaven API 类型定义
 */

// 壁纸缩略图
export type WallpaperThumbs = {
	large: string;
	original: string;
	small: string;
};

// 头像尺寸
export type WallpaperAvatarSizes = {
	"200px": string;
	"128px": string;
	"32px": string;
	"20px": string;
};

// 上传者信息
export type WallpaperUploader = {
	username: string;
	group: string;
	avatar: WallpaperAvatarSizes;
};

// 壁纸标签
export type WallpaperTag = {
	id: number;
	name: string;
	alias: string;
	category_id: number;
	category: string;
	purity: string;
	created_at: string;
};

// 壁纸数据
export type Wallpaper = {
	id: string;
	url: string;
	short_url: string;
	uploader?: WallpaperUploader;
	views: number;
	favorites: number;
	source: string;
	purity: string; // sfw, sketchy, nsfw
	category: string; // general, anime, people
	dimension_x: number;
	dimension_y: number;
	resolution: string;
	ratio: string;
	file_size: number;
	file_type: string;
	created_at: string;
	colors: string[];
	path: string;
	thumbs: WallpaperThumbs;
	tags?: WallpaperTag[];
};

// 搜索查询对象
export type SearchQuery = {
	id: number;
	tag: string;
};

// 搜索响应元数据
export type SearchMeta = {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	query: string | SearchQuery | null;
	seed: string | null;
};

// 搜索响应
export type SearchResponse = {
	data: Wallpaper[];
	meta: SearchMeta;
};

// 壁纸详情响应
export type WallpaperResponse = {
	data: Wallpaper;
};

// 用户收藏夹
export type Collection = {
	id: number;
	label: string;
	views: number;
	public: number;
	count: number;
};

// 收藏夹列表响应
export type CollectionsResponse = {
	data: Collection[];
};

// 搜索参数
export type SearchParams = {
	q?: string; // 搜索关键词
	categories?: string; // 分类 111 (general/anime/people)
	purity?: string; // 纯度 100 (sfw/sketchy/nsfw)
	sorting?: "date_added" | "relevance" | "random" | "views" | "favorites" | "toplist";
	order?: "desc" | "asc";
	topRange?: "1d" | "3d" | "1w" | "1M" | "3M" | "6M" | "1y";
	atleast?: string; // 最小分辨率
	resolutions?: string; // 精确分辨率
	ratios?: string; // 宽高比
	colors?: string; // 颜色代码
	page?: number;
	seed?: string; // 随机种子
};

// 筛选表单
export type FilterForm = {
	categories: string[]; // ['general', 'anime', 'people']
	purity: string[]; // ['sfw', 'sketchy', 'nsfw']
	sorting: string;
	topRange: string;
	ratios: string[];
	wallpaperType: 'all' | 'pc' | 'mobile'; // 壁纸类型: 全部/PC/手机
	colors: string[]; // 颜色代码数组
};

// Wallhaven Store 状态
export type WallhavenState = {
	apiKey: string;
	username: string;
	searchHistory: string[];
	localFavorites: string[]; // 本地收藏的壁纸ID列表
	filterForm: FilterForm;
};
