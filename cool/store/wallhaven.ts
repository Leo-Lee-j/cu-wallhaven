import { ref } from "vue";
import { storage } from "../utils";
import type {
	FilterForm,
	SearchParams,
	SearchResponse,
	Wallpaper,
	WallpaperResponse,
	Collection,
	CollectionsResponse
} from "@/types/wallhaven";

// Wallhaven API 基础URL
const API_BASE = "https://wallhaven.cc/api/v1";

// 最大搜索历史记录数
const MAX_SEARCH_HISTORY = 10;

/**
 * Wallhaven 状态管理类
 */
export class WallhavenStore {
	// API Key
	apiKey = ref<string>("");

	// 用户名
	username = ref<string>("");

	// 搜索历史
	searchHistory = ref<string[]>([]);

	// 本地收藏的壁纸ID列表
	localFavorites = ref<string[]>([]);

	// 筛选表单
	filterForm = ref<FilterForm>({
		categories: ["general", "anime", "people"],
		purity: ["sfw"],
		sorting: "date_added",
		topRange: "1M",
		ratios: [],
		wallpaperType: 'all',
		colors: []
	});

	constructor() {
		this.load();
	}

	/**
	 * 从本地存储加载数据
	 */
	load() {
		const apiKey = storage.get("wallhaven_apiKey") as string | null;
		const username = storage.get("wallhaven_username") as string | null;
		const searchHistory = storage.get("wallhaven_searchHistory");
		const localFavorites = storage.get("wallhaven_localFavorites");
		const filterForm = storage.get("wallhaven_filterForm");

		if (apiKey != null) {
			this.apiKey.value = apiKey;
		}
		if (username != null) {
			this.username.value = username;
		}
		
		// 处理 searchHistory - 如果是字符串则解析,否则直接使用
		if (searchHistory != null) {
			if (typeof searchHistory === 'string') {
				// 检查字符串是否非空
				if (searchHistory.trim().length > 0) {
					try {
						const parsed = JSON.parse(searchHistory);
						if (Array.isArray(parsed)) {
							this.searchHistory.value = parsed as string[];
						}
					} catch (err) {
						console.error("解析 searchHistory 失败:", err);
					}
				}
			} else if (Array.isArray(searchHistory)) {
				this.searchHistory.value = searchHistory as string[];
			}
		}
		
		// 处理 localFavorites - 如果是字符串则解析,否则直接使用
		if (localFavorites != null) {
			if (typeof localFavorites === 'string') {
				// 检查字符串是否非空
				if (localFavorites.trim().length > 0) {
					try {
						const parsed = JSON.parse(localFavorites);
						if (Array.isArray(parsed)) {
							this.localFavorites.value = parsed as string[];
						}
					} catch (err) {
						console.error("解析 localFavorites 失败:", err);
					}
				}
			} else if (Array.isArray(localFavorites)) {
				this.localFavorites.value = localFavorites as string[];
			}
		}
		
		//处理 filterForm - 如果是字符串则解析,否则直接使用
		if (filterForm != null) {
			if (typeof filterForm === 'string') {
				// 检查字符串是否非空
				if (filterForm.trim().length > 0) {
					try {
						const parsed = JSON.parse(filterForm);
						if (parsed != null && typeof parsed === 'object') {
							// 手动构建 FilterForm 对象 - 逐个属性赋值
							const obj = parsed as UTSJSONObject;
							this.filterForm.value.categories = obj['categories'] as string[] ?? ["general", "anime", "people"];
							this.filterForm.value.purity = obj['purity'] as string[] ?? ["sfw"];
							this.filterForm.value.sorting = obj['sorting'] as string ?? "date_added";
							this.filterForm.value.topRange = obj['topRange'] as string ?? "1M";
							this.filterForm.value.ratios = obj['ratios'] as string[] ?? [];
							this.filterForm.value.wallpaperType = (obj['wallpaperType'] as 'all' | 'pc' | 'mobile') ?? 'all';
							this.filterForm.value.colors = obj['colors'] as string[] ?? [];
						}
					} catch (err) {
						console.error("解析 filterForm 失败:", err);
					}
				}
			} else if (typeof filterForm === 'object') {
			// 手动构建 FilterForm 对象 - 逐个属性赋值
			const obj = filterForm as UTSJSONObject;
			this.filterForm.value.categories = obj['categories'] as string[] ?? ["general", "anime", "people"];
			this.filterForm.value.purity = obj['purity'] as string[] ?? ["sfw"];
			this.filterForm.value.sorting = obj['sorting'] as string ?? "date_added";
			this.filterForm.value.topRange = obj['topRange'] as string ?? "1M";
			this.filterForm.value.ratios = obj['ratios'] as string[] ?? [];
			this.filterForm.value.wallpaperType = (obj['wallpaperType'] as 'all' | 'pc' | 'mobile') ?? 'all';
			this.filterForm.value.colors = obj['colors'] as string[] ?? [];
		}
		}
	}

	/**
	 * 保存 API Key
	 */
	setApiKey(key: string) {
		this.apiKey.value = key;
		storage.set("wallhaven_apiKey", key, 0);
	}

	/**
	 * 保存用户名
	 */
	setUsername(name: string) {
		this.username.value = name;
		storage.set("wallhaven_username", name, 0);
	}

	/**
	 * 添加搜索历史
	 */
	addSearchHistory(keyword: string) {
		if (keyword.trim() === "") return;

		// 移除已存在的相同关键词
		const index = this.searchHistory.value.indexOf(keyword);
		if (index > -1) {
			this.searchHistory.value.splice(index, 1);
		}

		// 添加到开头
		this.searchHistory.value.unshift(keyword);

		// 限制最大数量
		if (this.searchHistory.value.length > MAX_SEARCH_HISTORY) {
			this.searchHistory.value = this.searchHistory.value.slice(0, MAX_SEARCH_HISTORY);
		}

		storage.set("wallhaven_searchHistory", this.searchHistory.value, 0);
	}

	/**
	 * 移除单条搜索历史
	 */
	removeSearchHistory(keyword: string) {
		const index = this.searchHistory.value.indexOf(keyword);
		if (index > -1) {
			this.searchHistory.value.splice(index, 1);
			storage.set("wallhaven_searchHistory", this.searchHistory.value, 0);
		}
	}

	/**
	 * 清空搜索历史
	 */
	clearSearchHistory() {
		this.searchHistory.value = [];
		storage.remove("wallhaven_searchHistory");
	}

	/**
	 * 添加本地收藏
	 */
	addFavorite(wallpaperId: string) {
		if (!this.localFavorites.value.includes(wallpaperId)) {
			this.localFavorites.value.push(wallpaperId);
			storage.set("wallhaven_localFavorites", this.localFavorites.value, 0);
		}
	}

	/**
	 * 移除本地收藏
	 */
	removeFavorite(wallpaperId: string) {
		const index = this.localFavorites.value.indexOf(wallpaperId);
		if (index > -1) {
			this.localFavorites.value.splice(index, 1);
			storage.set("wallhaven_localFavorites", this.localFavorites.value, 0);
		}
	}

	/**
	 * 检查是否已收藏
	 */
	isFavorite(wallpaperId: string): boolean {
		return this.localFavorites.value.includes(wallpaperId);
	}

	/**
	 * 保存筛选表单
	 */
	setFilterForm(form: FilterForm) {
		this.filterForm.value = form;
		storage.set("wallhaven_filterForm", form, 0);
	}

	/**
	 * 构建请求头
	 */
	private buildHeaders(): UTSJSONObject {
		if (this.apiKey.value !== "") {
			return { "X-API-Key": this.apiKey.value } as UTSJSONObject;
		}
		return {} as UTSJSONObject;
	}

	/**
	 * 构建分类参数 (111 格式)
	 */
	private buildCategories(): string {
		const cats = this.filterForm.value?.categories ?? ["general", "anime", "people"];
		if (cats == null || !Array.isArray(cats)) {
			return "111";
		}
		return [
			cats.indexOf("general") >= 0 ? "1" : "0",
			cats.indexOf("anime") >= 0 ? "1" : "0",
			cats.indexOf("people") >= 0 ? "1" : "0"
		].join("");
	}

	/**
	 * 构建纯度参数 (100 格式)
	 */
	private buildPurity(): string {
		const purity = this.filterForm.value?.purity ?? ["sfw"];
		if (purity == null || !Array.isArray(purity)) {
			return "100";
		}
		return [
			purity.indexOf("sfw") >= 0 ? "1" : "0",
			purity.indexOf("sketchy") >= 0 ? "1" : "0",
			purity.indexOf("nsfw") >= 0 ? "1" : "0"
		].join("");
	}

	/**
	 * 构建宽高比参数，根据 wallpaperType 和 ratios 合并
	 */
	private buildRatios(): string {
		const wallpaperType = this.filterForm.value?.wallpaperType ?? 'all';
		const customRatios = this.filterForm.value?.ratios ?? [];
		
		const ratioList: string[] = [];
		
		// 根据壁纸类型添加预设比例
		if (wallpaperType === 'pc') {
			// PC壁纸 - 横屏比例
			ratioList.push('16x9', '16x10', '21x9', '32x9', '4x3', '5x4');
		} else if (wallpaperType === 'mobile') {
			// 手机壁纸 - 竖屏比例
			ratioList.push('9x16', '10x16', '9x18', '9x19.5', '9x20');
		}
		
		// 添加自定义比例，去重
		if (customRatios != null && Array.isArray(customRatios)) {
			for (const ratio of customRatios) {
				if (!ratioList.includes(ratio)) {
					ratioList.push(ratio);
				}
			}
		}
		
		return ratioList.join(',');
	}

	/**
	 * 搜索壁纸
	 */
	async search(params: any = {}): Promise<any> {
		const queryParts: string[] = [];
		
		// 将 params 转换为 UTSJSONObject 以访问属性
		const p = params as UTSJSONObject;

		// 关键词
		const q =  (p != null ? p['q'] : null) as string | null;
		if (q != null && q !== "") {
			queryParts.push(`q=${encodeURIComponent(q)}`);
		}

		// 分类
		const categories = (p != null ? p['categories'] : null) as string | null;
		queryParts.push(`categories=${categories ?? this.buildCategories()}`);

		// 纯度
		const purity = (p != null ? p['purity'] : null) as string | null;
		queryParts.push(`purity=${purity ?? this.buildPurity()}`);

		// 排序
		const sorting = (p != null ? p['sorting'] : null) as string | null;
		queryParts.push(`sorting=${sorting ?? this.filterForm.value?.sorting ?? "date_added"}`);

		// 排序顺序
		const order = (p != null ? p['order'] : null) as string | null;
		if (order != null) {
			queryParts.push(`order=${order}`);
		}

		// 热门时间范围
		if (sorting === "toplist" || this.filterForm.value?.sorting === "toplist") {
			const topRange = (p != null ? p['topRange'] : null) as string | null;
			queryParts.push(`topRange=${topRange ?? this.filterForm.value?.topRange ?? "1M"}`);
		}

		// 宽高比 - 根据 wallpaperType 和 ratios 构建
		const ratiosParam = this.buildRatios();
		if (ratiosParam !== "") {
			queryParts.push(`ratios=${ratiosParam}`);
		}

		// 颜色筛选
		const colors = this.filterForm.value?.colors;
		if (colors !== null && Array.isArray(colors) && colors.length > 0) {
			queryParts.push(`colors=${colors.join(",")}`);
		}

		// 页码
		const page = (p != null ? p['page'] : null) as number | null;
		if (page != null) {
			queryParts.push(`page=${page.toString()}`);
		}

		// 随机种子
		const seed = (p != null ? p['seed'] : null) as string | null;
		if (seed != null && seed !== "") {
			queryParts.push(`seed=${seed}`);
		}

		// API Key
		if (this.apiKey.value !== "") {
			queryParts.push(`apikey=${this.apiKey.value}`);
		}

		const url = `${API_BASE}/search?${queryParts.join("&")}`;

		return new Promise((resolve, reject) => {
			uni.request({
				url,
				method: "GET",
				header: this.buildHeaders(),
				success: (res) => {
					if (res.statusCode === 200) {
						// 使用 any 中间类型绕过 UTS 类型检查
						resolve(res.data as any);
					} else {
						reject(new Error(`请求失败: ${res.statusCode}`));
					}
				},
				fail: (err) => {
					reject(new Error(err.errMsg));
				}
			});
		});
	}

	/**
	 * 获取壁纸详情
	 */
	async getWallpaper(id: string): Promise<any> {
		let url = `${API_BASE}/w/${id}`;
		if (this.apiKey.value !== '' && this.apiKey.value !== null) {
			url += `?apikey=${this.apiKey.value}`;
		}

		return new Promise((resolve, reject) => {
			uni.request({
				url,
				method: "GET",
				header: this.buildHeaders(),
				success: (res) => {
					if (res.statusCode === 200) {
						// 从响应中提取 data 字段
						const response = res.data as UTSJSONObject;
						resolve(response['data'] as any);
					} else {
						reject(new Error(`请求失败: ${res.statusCode}`));
					}
				},
				fail: (err) => {
					reject(new Error(err.errMsg));
				}
			});
		});
	}

	/**
	 * 获取用户收藏夹列表
	 */
	async getCollections(username: string | null = null): Promise<any> {
		let url = `${API_BASE}/collections`;
		if (username !== null && username !== "") {
			url += `/${username}`;
		}
		if (this.apiKey.value !== '' && this.apiKey.value !== null) {
			url += `?apikey=${this.apiKey.value}`;
		}

		return new Promise((resolve, reject) => {
			uni.request({
				url,
				method: "GET",
				header: this.buildHeaders(),
				success: (res) => {
					if (res.statusCode === 200) {
						// 从响应中提取 data 字段
						const response = res.data as UTSJSONObject;
						resolve(response['data'] as any);
					} else {
						reject(new Error(`请求失败: ${res.statusCode}`));
					}
				},
				fail: (err) => {
					reject(new Error(err.errMsg));
				}
			});
		});
	}

	/**
	 * 获取收藏夹内容
	 */
	async getCollectionWallpapers(
		username: string,
		collectionId: number,
		page: number = 1
	): Promise<any> {
		let url = `${API_BASE}/collections/${username}/${collectionId}?page=${page}`;
		if (this.apiKey.value !== '' && this.apiKey.value !== null) {
			url += `&apikey=${this.apiKey.value}`;
		}

		return new Promise((resolve, reject) => {
			uni.request({
				url,
				method: "GET",
				header: this.buildHeaders(),
				success: (res) => {
					if (res.statusCode === 200) {
						// 直接返回 res.data
						resolve(res.data as any);
					} else {
						reject(new Error(`请求失败: ${res.statusCode}`));
					}
				},
				fail: (err) => {
					reject(new Error(err.errMsg));
				}
			});
		});
	}
}

// 单例实例
export const wallhavenStore = new WallhavenStore();
