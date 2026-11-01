import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

/**
 * E2Eテストは Firestore エミュレーター上で実行する。
 * `pnpm test:e2e` が `firebase emulators:exec` 経由でエミュレーターを起動してから Playwright を実行する。
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL,
		locale: "ja-JP",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "mobile-chrome",
			use: { ...devices["Pixel 7"] },
		},
	],
	webServer: {
		// CIでは本番ビルドで検証し、ローカルでは起動の速い dev サーバーを使う
		command: process.env.CI
			? `pnpm build && pnpm start --port ${PORT}`
			: `pnpm next dev --turbopack --port ${PORT}`,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 300_000,
		env: {
			NEXT_PUBLIC_BASE_URL: baseURL,
			// demo- プレフィックスのプロジェクトIDは実プロジェクトに一切接続しない
			NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-wari-ri",
			NEXT_PUBLIC_FIREBASE_API_KEY: "demo-api-key",
			NEXT_PUBLIC_FIREBASE_APP_ID: "demo-app-id",
			NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: "127.0.0.1:8085",
		},
	},
});
