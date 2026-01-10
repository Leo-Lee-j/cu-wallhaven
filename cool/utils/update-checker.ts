/**
 * GitHub Release 更新检查器
 */

// GitHub 仓库信息
const GITHUB_REPO_OWNER = "Leo-Lee-j";
const GITHUB_REPO_NAME = "cuw";

// 获取当前应用版本
export function getCurrentVersion(): string {
	const appBaseInfo = uni.getAppBaseInfo();
	if (appBaseInfo != null && appBaseInfo.appVersion != null) {
		return appBaseInfo.appVersion!;
	}
	return "0.0.6";
}

// 版本比较函数
export function compareVersion(v1: string, v2: string): number {
	const parts1: number[] = v1.split(".").map((s: string): number => parseInt(s));
	const parts2: number[] = v2.split(".").map((s: string): number => parseInt(s));

	for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
		const p1 = parts1[i] != null ? parts1[i] : 0;
		const p2 = parts2[i] != null ? parts2[i] : 0;

		if (p1 > p2) return 1;
		if (p1 < p2) return -1;
	}

	return 0;
}

// 检查更新类型
export type UpdateCheckResult = {
	hasUpdate: boolean;
	latestVersion: string;
	currentVersion: string;
	releaseUrl?: string;
	releaseNotes?: string;
	downloadUrl?: string;
	publishedAt?: string;
};

/**
 * 检查 GitHub Releases 是否有新版本
 */
export async function checkForUpdates(): Promise<UpdateCheckResult> {
	const currentVersion = getCurrentVersion();

	try {
		const apiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;

		const response = await new Promise<any>(
			(resolve: (value: any) => void, reject: (reason?: any) => void) => {
				uni.request({
					url: apiUrl,
					method: "GET",
					header: {
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "cu-wallhaven-app"
					},
					success: (res) => {
						if ((res.statusCode as number) == 200) {
							resolve(res.data as any);
						} else {
							reject(new Error(`GitHub API 请求失败: ${res.statusCode}`));
						}
					},
					fail: (err) => {
						reject(new Error(err.errMsg != null ? err.errMsg : "网络请求失败"));
					}
				});
			}
		);

		const releaseData = response as UTSJSONObject;
		const tagName = releaseData.getString("tag_name") ?? "";
		const latestVersion = tagName.replace(/^v/, "");
		const hasUpdate = compareVersion(latestVersion, currentVersion) > 0;

		let downloadUrl = "";
		const assets = releaseData["assets"] as any[] | null;
		if (assets != null && assets.length > 0) {
			const firstAsset = assets[0] as UTSJSONObject | null;
			if (firstAsset != null) {
				downloadUrl = firstAsset.getString("browser_download_url") ?? "";
			}
		}

		return {
			hasUpdate,
			latestVersion,
			currentVersion,
			releaseUrl: releaseData.getString("html_url") ?? "",
			releaseNotes: releaseData.getString("body") ?? "",
			downloadUrl,
			publishedAt: releaseData.getString("published_at") ?? ""
		};
	} catch (err: any) {
		console.error("检查更新失败:", err);
		throw new Error(err.message ?? "检查更新失败");
	}
}

/**
 * 打开浏览器访问下载链接
 */
export function openDownloadUrl(url: string) {
	// #ifdef APP
	plus.runtime.openURL(url);
	// #endif

	// #ifndef APP
	window.open(url, "_blank");
	// #endif
}

/**
 * 下载进度回调类型
 */
export type DownloadProgressCallback = (
	progress: number,
	totalSize: number,
	downloadedSize: number
) => void;

/**
 * 直接下载 APK 文件并安装（仅 Android）
 */
export async function downloadAndInstall(
	downloadUrl: string,
	onProgress?: DownloadProgressCallback
): Promise<boolean> {
	return new Promise<boolean>(
		(resolve: (res: boolean) => void, reject: (reason?: any) => void) => {
			console.log("downloadAndInstall 开始执行");

			// #ifdef APP-ANDROID
			const downloadTask = uni.downloadFile({
				url: downloadUrl,
				success: (res) => {
					console.log("downloadFile success:", res.statusCode);
					if ((res.statusCode as number) == 200) {
						const filePath = res.tempFilePath;
						console.log("开始安装 APK:", filePath);

						// uni-app x 使用 uni.installApk
						// #ifdef UNI-APP-X
						uni.installApk({
							filePath: filePath,
							success: () => {
								console.log("安装成功");
								resolve(true);
							},
							fail: (err) => {
								console.log("安装失败:", err);
								reject(new Error("安装失败: " + (err?.errMsg ?? "未知错误")));
							}
						});
						// #endif

						// 经典 uni-app 使用 plus.runtime.install
						// #ifndef UNI-APP-X
						// #ifdef APP-PLUS
						plus.runtime.install(
							filePath,
							{},
							() => {
								console.log("安装成功");
								resolve(true);
							},
							(error: any) => {
								if (
									error != null &&
									error.message != null &&
									error.message !== "ERROR_UNKNOWN"
								) {
									console.error("安装失败:", error);
									reject(new Error("安装失败: " + (error.message ?? "未知错误")));
								} else {
									console.log("安装已开始");
									resolve(true);
								}
							}
						);
						// #endif
						// #endif
					} else {
						console.log("下载失败, statusCode:", res.statusCode);
						reject(new Error(`下载失败: HTTP ${res.statusCode}`));
					}
				},
				fail: (err) => {
					console.log("downloadFile fail:", err);
					reject(new Error(err.errMsg != null ? err.errMsg : "下载失败"));
				}
			});
			console.log("downloadTask 创建完成");

			if (onProgress != null) {
				downloadTask.onProgressUpdate((res) => {
					const progress = res.progress != null ? res.progress : 0;
					const totalBytesWritten =
						res.totalBytesWritten != null ? res.totalBytesWritten : 0;
					const totalBytesExpectedToWrite =
						res.totalBytesExpectedToWrite != null ? res.totalBytesExpectedToWrite : 0;
					onProgress(progress, totalBytesExpectedToWrite, totalBytesWritten);
				});
			}
			// #endif

			// #ifndef APP-ANDROID
			reject(new Error("仅支持 Android 平台"));
			// #endif
		}
	);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";

	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}
