import { Dict, dict } from "./dict";
import { User, user } from "./user";
import { WallhavenStore, wallhavenStore } from "./wallhaven";

type Store = {
	user: User;
	dict: Dict;
	wallhaven: WallhavenStore;
};

export function useStore(): Store {
	return {
		user,
		dict,
		wallhaven: wallhavenStore
	};
}

export * from "./dict";
export * from "./user";
export * from "./wallhaven";
