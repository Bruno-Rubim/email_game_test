import { measureTextWidth, TextContent } from "./canvas-object.js";
import { findSprite } from "./sprite-loader.js";
import { randomInt } from "./util.js";

export class RenderObject {
	constructor({
		width = 0,
		height = 0,
		sprite = null,
		posShift = { x: 0, y: 0 },
		spriteShift = { x: 0, y: 0, width: 0, height: 0 },
	}) {
		this.width = width;
		this.height = height;
		this.sprite = sprite;
		this.posShift = posShift;
		if (spriteShift.width == 0) {
			spriteShift.width = width;
		}
		if (spriteShift.height == 0) {
			spriteShift.height = height;
		}
		this.spriteShift = spriteShift;
	}
}

export class GameObject {
	constructor({
		pos,
		renderObject,
		hitboxWidth = renderObject.width,
		hitboxHeight = renderObject.height,
		hitboxXShift = 0,
		hitboxYShift = 0,
	}) {
		this.pos = pos;
		this.renderObject = renderObject;
		this.hitboxWidth = hitboxWidth;
		this.hitboxHeight = hitboxHeight;
		this.hitboxXShift = hitboxXShift;
		this.hitboxYShift = hitboxYShift;
	}

	posInHitbox(pos) {
		// returns boolean if the coordinates are inside its hitbox
		if (
			pos.x > this.pos.x + this.hitboxXShift &&
			pos.x < this.pos.x + this.hitboxXShift + this.hitboxWidth &&
			pos.y > this.pos.y + this.hitboxYShift &&
			pos.y < this.pos.y + this.hitboxYShift + this.hitboxHeight
		) {
			return true;
		} else {
			return false;
		}
	}
	drawSprite(canvasObject) {
		canvasObject.drawGameObject(this);
	}
}

export class AppIcon extends GameObject {
	constructor({
		pos,
		renderObject,
		hitboxWidth = renderObject.width,
		hitboxHeight = renderObject.height,
		hitboxXShift = 0,
		hitboxYShift = 0,
		iconName = "Default",
	}) {
		super({
			pos: pos,
			width: 0,
			height: 0,
			renderObject: renderObject,
			hitboxWidth: hitboxWidth,
			hitboxHeight: hitboxHeight,
			hitboxXShift: hitboxXShift,
			hitboxYShift: hitboxYShift,
		});
		this.iconName = iconName;
		this.isApp = true;
	}

	drawSprite(canvasObject) {
		canvasObject.drawGameObject(this);
		canvasObject.writeText(
			"minecraftia",
			"bnw",
			this.iconName,
			{ x: this.pos.x + 16, y: this.pos.y + 32 },
			"center"
		);
	}

	onClick(cursor) {
		console.log(this.iconName);
	}
}

export class Email extends GameObject {
	constructor({
		picture = "default_picture_" + randomInt(0, 7),
		content = "Default Content",
		sender = "Default Name",
		address = "<defaultAddress@jmail.com>",
	}) {
		super({ pos: { x: 0, y: 0 }, renderObject: new RenderObject({}) });
		this.isEmail = true;
		this.picture = picture;
		this.content = content;
		this.sender = sender;
		this.address = address;
		this.pictureObject = new GameObject({
			pos: { x: 8, y: 8 },
			renderObject: new RenderObject({
				width: 32,
				height: 32,
				sprite: findSprite(this.picture),
			}),
		});
		this.textContent = new TextContent({
			text: content,
			font: "minecraftia",
			maxLineWidth: 304,
			maxRenderHeight: 176,
		});
		if (this.textContent.hasScroll) {
			this.generateScrollBar();
		}
	}

	generateScrollBar() {
		this.scrollSlotRO = new RenderObject({
			sprite: findSprite("scroll_slot"),
			width: 352,
			height: 256,
		});
		this.scrollBarTopRO = new RenderObject({
			sprite: findSprite("scroll_bar"),
			width: 8,
			height: 3,
			spriteShift: { x: 0, y: 0, width: 8, height: 3 },
		});
		this.scrollSpace = Math.ceil(
			(this.textContent.textHeight - this.textContent.maxRenderHeight) /
				this.textContent.scrollAmmount
		);
		this.scrollBarHeight = 182 - this.scrollSpace;
		this.scrollBarMidRO = new RenderObject({
			sprite: findSprite("scroll_bar"),
			width: 8,
			height: this.scrollBarHeight,
			spriteShift: { x: 0, y: 3, width: 8, height: 1 },
		});
		this.scrollBarBotRO = new RenderObject({
			sprite: findSprite("scroll_bar"),
			width: 8,
			height: 3,
			spriteShift: { x: 0, y: 4, width: 8, height: 3 },
		});
	}

	posInHitbox(pos) {
		if (
			this.textContent.hasScroll &&
			pos.x > 330 &&
			pos.x < 343 &&
			pos.y > 56 &&
			pos.y < 249
		) {
			return true;
		} else {
			return false;
		}
	}

	onClick(cursor) {
		let clickScroll = cursor.pos.y - this.scrollBarHeight / 2 - 60;
		clickScroll = Math.max(clickScroll, 0);
		clickScroll = Math.min(clickScroll, this.scrollSpace);
		this.textContent.scrollTo(clickScroll);
	}

	drawSprite(canvasObject) {
		canvasObject.drawGameObject(this.pictureObject);
		if (this.textContent.hasScroll) {
			canvasObject.drawRenderObject(this.scrollSlotRO, { x: 0, y: 0 });
			canvasObject.drawRenderObject(this.scrollBarTopRO, {
				x: 332,
				y: 58 + this.textContent.scrollShift / this.textContent.scrollAmmount,
			});
			canvasObject.drawRenderObject(this.scrollBarMidRO, {
				x: 332,
				y: 61 + this.textContent.scrollShift / this.textContent.scrollAmmount,
			});
			canvasObject.drawRenderObject(this.scrollBarBotRO, {
				x: 332,
				y:
					61 +
					this.textContent.scrollShift / this.textContent.scrollAmmount +
					this.scrollBarHeight,
			});
		}
		canvasObject.writeText(
			"wcp",
			"brown",
			this.sender,
			{ x: 43, y: 10 },
			"left"
		);
		canvasObject.writeText(
			"minecraftia",
			"light_brown",
			this.address,
			{ x: 43 + measureTextWidth(this.sender, "wcp") + 2, y: 13 },
			"left"
		);
		canvasObject.writeText(
			"minecraftia",
			"brown",
			"Para: Você",
			{ x: 43, y: 28 },
			"left"
		);
		canvasObject.writeTextContent(
			this.textContent,
			"black",
			{ x: 16, y: 64 },
			"left"
		);
	}
}
