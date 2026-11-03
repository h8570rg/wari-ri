/**
 * 見分けやすい順に並べた色
 */
const memberColors = [
	"blue",
	"red",
	"green",
	"violet",
	"orange",
	"teal",
	"pink",
	"indigo",
	"lime",
	"cyan",
	"grape",
	"yellow",
];

/**
 * グループ内のメンバーの並び順から色を決める
 */
export function getMemberColor(index: number) {
	return memberColors[index % memberColors.length];
}
