class Sprite {
	constructor(src) {
		this.src = src;
		this.img = new Image();
	}
	load() {
		const { src, img } = this;
		return new Promise((done, fail) => {
			img.onload = () => done(img);
			img.onerror = fail;
			img.src = src;
		});
	}
}

const sprites = {
	blue_bg: new Sprite("./img/blue_bg.png"),
	beige_bg: new Sprite("./img/beige_bg.png"),
	email_ui: new Sprite("./img/email_ui.png"),

	concepts_icon: new Sprite("./img/concepts_icon.png"),
	email_icon: new Sprite("./img/email_icon.png"),
	settings_icon: new Sprite("./img/settings_icon.png"),
	saves_icon: new Sprite("./img/saves_icon.png"),
	scroll_bar: new Sprite("./img/scroll_bar.png"),
	scroll_slot: new Sprite("./img/scroll_slot.png"),

	cursor_arrow: new Sprite("./img/cursor_arrow.png"),
	cursor_pointer: new Sprite("./img/cursor_pointer.png"),

	minecraftia_white: new Sprite("./img/minecraftia_white.png"),
	minecraftia_black: new Sprite("./img/minecraftia_black.png"),
	minecraftia_bnw: new Sprite("./img/minecraftia_bnw.png"),
	minecraftia_brown: new Sprite("./img/minecraftia_brown.png"),
	minecraftia_light_brown: new Sprite("./img/minecraftia_light_brown.png"),
	wcp_black: new Sprite("./img/wcp_black.png"),
	wcp_brown: new Sprite("./img/wcp_brown.png"),

	app_border: new Sprite("./img/app_border.png"),
	exit_btn: new Sprite("./img/exit_btn.png"),

	default_picture_0: new Sprite("./img/default_picture_0.png"),
	default_picture_1: new Sprite("./img/default_picture_1.png"),
	default_picture_2: new Sprite("./img/default_picture_2.png"),
	default_picture_3: new Sprite("./img/default_picture_3.png"),
	default_picture_4: new Sprite("./img/default_picture_4.png"),
	default_picture_5: new Sprite("./img/default_picture_5.png"),
	default_picture_6: new Sprite("./img/default_picture_6.png"),
	default_picture_7: new Sprite("./img/default_picture_7.png"),
};

const spriteArr = Object.values(sprites);
const promises = spriteArr.map((sprite) => sprite.load());
await Promise.all(promises);

export default sprites;

export function findSprite(spriteName) {
	const sprite = sprites[spriteName.replaceAll("-", "_")];
	if (!sprite) {
		throw new Error(`Sprite ${spriteName} not found`);
	}
	return sprite;
}
