import { findSprite } from "./sprite-loader.js";

export class CanvasObject {
	constructor({
		width = 800,
		height = 200,
		id = "canvas",
		scale = 1,
		backgroundColor,
	}) {
		this.width = width; // Largura do objeto em px
		this.height = height; // Altura do objeto em px
		this.id = id;
		this.scale = scale; // Valor para multiplicar a escala das imagens
		this.backgroundColor = backgroundColor; // Valor para pintar o fundo
	}

	//generates the canvas element and appends it to a given parent element
	generateElement(parentElement) {
		this.element = document.createElement("canvas");
		this.element.style.imageRendering = "pixelated";
		this.element.width = this.width;
		this.element.height = this.height;
		this.element.style.position = "absolute";
		this.element.style.left = window.innerWidth / 2 - this.width / 2 + "px";

		this.ctx = this.element.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;

		if (parentElement) {
			parentElement.append(this.element);
			return;
		}
		document.querySelector("body")?.append(this.element);
	}

	//draws the sprite of a given game object at its position
	drawGameObject(gameObject) {
		const img = gameObject.renderObject.sprite.img;
		this.ctx.drawImage(
			img,
			(gameObject.pos.x + gameObject.renderObject.posShift.x) * this.scale,
			(gameObject.pos.y + gameObject.renderObject.posShift.y) * this.scale,
			gameObject.renderObject.width * this.scale,
			gameObject.renderObject.height * this.scale
		);
	}

	//draws the sprite of a given render object at a given position
	drawRenderObject(renderObject, pos = { x: 0, y: 0 }) {
		const img = renderObject.sprite.img;
		this.ctx.drawImage(
			img,
			renderObject.spriteShift.x,
			renderObject.spriteShift.y,
			renderObject.spriteShift.width,
			renderObject.spriteShift.height,
			pos.x * this.scale,
			pos.y * this.scale,
			renderObject.width * this.scale,
			renderObject.height * this.scale
		);
	}

	//Clears the canvas and paints the background with background color
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	writeText(font, color, content, pos, direction = "left", limitWidth = 999) {
		let letters = content.split("");
		let totalWidth = 0;
		let currentWidth = 0;
		let currentHeight = 0;
		let startX = 0;
		letters.forEach((l) => {
			if (fontMaps[font][l] == undefined) {
				console.warn(`character "${l}" missing`);
			}
			totalWidth += fontMaps[font][l].width + 1;
		});
		if (direction == "center") {
			startX = Math.floor(-totalWidth / 2);
		}
		const fontMap = fontMaps[font];
		for (let i = 0; i < letters.length; i++) {
			const char = letters[i];
			const charMap = fontMap[char];
			if (currentWidth + charMap.width > limitWidth || char == "\n") {
				currentWidth = 0;
				currentHeight += fontMap.cellHeight;
			}
			this.writeCharacter(font, color, char, {
				x: pos.x + startX + currentWidth,
				y: pos.y + currentHeight,
			});
			currentWidth += charMap.width + 1;
		}
	}

	writeCharacter(font, color, char, pos, topShift = 0, botShift = 0) {
		const fontSprite = findSprite(font + "_" + color);
		const fontMap = fontMaps[font];
		const charMap = fontMap[char];
		this.ctx.drawImage(
			fontSprite.img,
			charMap.x * fontMap.cellWidth,
			charMap.y * fontMap.cellHeight + topShift,
			charMap.width,
			fontMaps[font].cellHeight - (topShift + botShift),
			pos.x * this.scale,
			(pos.y + topShift) * this.scale,
			charMap.width * this.scale,
			(fontMaps[font].cellHeight - (topShift + botShift)) * this.scale
		);
	}

	writeWord(font, color, word, pos, topShift = 0, botShift = 0) {
		let letters = word.split("");
		let wordWidth = 0;
		let currentWidth = 0;

		letters.forEach((l) => {
			if (fontMaps[font][l] == undefined) {
				console.warn(`character "${l}" missing`);
			}
			wordWidth += fontMaps[font][l].width + 1;
		});

		for (let i = 0; i < letters.length; i++) {
			const char = letters[i];
			const fontMap = fontMaps[font];
			const charMap = fontMap[char];
			this.writeCharacter(
				font,
				color,
				char,
				{ x: pos.x + currentWidth, y: pos.y },
				topShift,
				botShift
			);
			currentWidth += charMap.width + 1;
		}
	}

	writeTextContent(textContent, color, pos, direction = "left") {
		const fontMap = fontMaps[textContent.font];
		let currentHeight = 0;
		textContent.lines.forEach((line, i) => {
			let topShift = 0;
			let topDiff = textContent.scrollShift - currentHeight;
			if (topDiff > 0) {
				if (topDiff > fontMap.cellHeight) {
					currentHeight += fontMap.cellHeight;
					return;
				}
				topShift = topDiff;
			}
			let botDiff =
				currentHeight -
				textContent.scrollShift +
				fontMap.cellHeight -
				textContent.maxRenderHeight;
			let botShift = 0;
			if (botDiff > 0) {
				if (botDiff > fontMap.cellHeight) {
					return;
				}
				botShift = botDiff;
			}
			let startX = 0;
			if (direction == "center") {
				startX =
					Math.floor(textContent.maxLineWidth / 2) - Math.floor(line.width / 2);
			}
			let currentWidth = 0;
			line.words.forEach((word) => {
				this.writeWord(
					textContent.font,
					color,
					word,
					{
						x: pos.x + startX + currentWidth,
						y: pos.y + i * fontMap.cellHeight - textContent.scrollShift,
					},
					topShift,
					botShift
				);
				currentWidth += measureTextWidth(word, textContent.font) + 3;
			});
			currentHeight += fontMap.cellHeight;
		});
	}
}

export class TextContent {
	constructor({
		text = "defaultText",
		maxLineWidth = 352,
		font,
		maxRenderHeight = 256,
	}) {
		this.font = font;
		this.lines = [];
		this.maxLineWidth = maxLineWidth;
		this.generateLines(text, maxLineWidth, font);
		this.maxRenderHeight = maxRenderHeight;
		this.textHeight = this.lines.length * fontMaps[this.font].cellHeight;
		this.hasScroll = false;
		if (this.textHeight > this.maxRenderHeight) {
			this.hasScroll = true;
		}
		this.scrollShift = 0;
		this.scrollAmmount = 20;
	}

	generateLines(text, maxLineWidth, font) {
		let letters = text.split("");
		let currentWordStart = 0;
		let currentWordEnd = 0;
		let currentLine = 0;

		for (let i = 0; i < letters.length; i++) {
			if (this.lines[currentLine] == undefined) {
				this.lines[currentLine] = { words: [], width: 0 };
			}
			let line = this.lines[currentLine];
			const char = letters[i];
			if (char == " " || char == "\n") {
				currentWordEnd = i;
				let word = text.substring(currentWordStart, currentWordEnd);
				let wordWidth = measureTextWidth(word, font);
				if (line.width + wordWidth > maxLineWidth) {
					currentLine++;
					this.lines[currentLine] = { words: [], width: 0 };
					line = this.lines[currentLine];
				}
				line.width += wordWidth;
				line.words.push(word);
				currentWordStart = i + 1;
				if (char == "\n") {
					currentLine++;
				} else {
					line.width += 3;
				}
			}
		}
	}

	scroll(mult = 1) {
		if (mult < 0) {
			if (this.scrollShift <= 0) {
				return;
			}
		} else {
			if (
				this.scrollShift >=
				Math.ceil(
					(this.textHeight - this.maxRenderHeight) / this.scrollAmmount
				) *
					this.scrollAmmount
			) {
				return;
			}
		}
		this.scrollShift += this.scrollAmmount * mult;
	}

	scrollTo(num) {
		this.scrollShift = this.scrollAmmount * num;
	}
}

export function measureTextWidth(text, font) {
	let letters = text.split("");
	let width = 0;
	for (let i = 0; i < letters.length; i++) {
		const char = letters[i];
		const fontMap = fontMaps[font];
		const charMap = fontMap[char];
		if (charMap == null) {
			console.warn("no ten", char);
			continue;
		}
		width += charMap.width + 1;
	}
	return width;
}

const fontMaps = {
	minecraftia: {
		cellWidth: 6,
		cellHeight: 12,
		A: { x: 0, y: 0, width: 5 },
		B: { x: 1, y: 0, width: 5 },
		C: { x: 2, y: 0, width: 5 },
		D: { x: 3, y: 0, width: 5 },
		E: { x: 4, y: 0, width: 5 },
		F: { x: 5, y: 0, width: 5 },
		G: { x: 6, y: 0, width: 5 },
		H: { x: 7, y: 0, width: 5 },
		I: { x: 8, y: 0, width: 3 },
		J: { x: 9, y: 0, width: 5 },
		K: { x: 10, y: 0, width: 5 },
		L: { x: 11, y: 0, width: 5 },
		M: { x: 12, y: 0, width: 5 },
		N: { x: 13, y: 0, width: 5 },
		O: { x: 14, y: 0, width: 5 },
		P: { x: 15, y: 0, width: 5 },
		Q: { x: 16, y: 0, width: 5 },
		R: { x: 17, y: 0, width: 5 },
		S: { x: 18, y: 0, width: 5 },
		T: { x: 19, y: 0, width: 5 },
		U: { x: 0, y: 1, width: 5 },
		V: { x: 1, y: 1, width: 5 },
		W: { x: 2, y: 1, width: 5 },
		X: { x: 3, y: 1, width: 5 },
		Y: { x: 4, y: 1, width: 5 },
		Z: { x: 5, y: 1, width: 5 },
		Á: { x: 6, y: 1, width: 5 },
		À: { x: 7, y: 1, width: 5 },
		Ã: { x: 8, y: 1, width: 5 },
		Â: { x: 9, y: 1, width: 5 },
		É: { x: 10, y: 1, width: 5 },
		Ê: { x: 11, y: 1, width: 5 },
		Í: { x: 12, y: 1, width: 3 },
		Ó: { x: 13, y: 1, width: 5 },
		Ô: { x: 14, y: 1, width: 5 },
		Õ: { x: 15, y: 1, width: 5 },
		Ú: { x: 16, y: 1, width: 5 },
		Ç: { x: 17, y: 1, width: 5 },
		a: { x: 0, y: 2, width: 5 },
		b: { x: 1, y: 2, width: 5 },
		c: { x: 2, y: 2, width: 5 },
		d: { x: 3, y: 2, width: 5 },
		e: { x: 4, y: 2, width: 5 },
		f: { x: 5, y: 2, width: 5 },
		g: { x: 6, y: 2, width: 5 },
		h: { x: 7, y: 2, width: 5 },
		i: { x: 8, y: 2, width: 1 },
		j: { x: 9, y: 2, width: 5 },
		k: { x: 10, y: 2, width: 5 },
		l: { x: 11, y: 2, width: 2 },
		m: { x: 12, y: 2, width: 5 },
		n: { x: 13, y: 2, width: 5 },
		o: { x: 14, y: 2, width: 5 },
		p: { x: 15, y: 2, width: 5 },
		q: { x: 16, y: 2, width: 5 },
		r: { x: 17, y: 2, width: 5 },
		s: { x: 18, y: 2, width: 5 },
		t: { x: 19, y: 2, width: 3 },
		u: { x: 0, y: 3, width: 5 },
		v: { x: 1, y: 3, width: 5 },
		w: { x: 2, y: 3, width: 5 },
		x: { x: 3, y: 3, width: 5 },
		y: { x: 4, y: 3, width: 5 },
		z: { x: 5, y: 3, width: 5 },
		á: { x: 6, y: 3, width: 5 },
		à: { x: 7, y: 3, width: 5 },
		ã: { x: 8, y: 3, width: 5 },
		â: { x: 9, y: 3, width: 5 },
		é: { x: 10, y: 3, width: 5 },
		ê: { x: 11, y: 3, width: 5 },
		í: { x: 12, y: 3, width: 1 },
		ó: { x: 13, y: 3, width: 5 },
		ô: { x: 14, y: 3, width: 5 },
		õ: { x: 15, y: 3, width: 5 },
		ú: { x: 16, y: 3, width: 5 },
		ç: { x: 17, y: 3, width: 5 },
		0: { x: 0, y: 4, width: 5 },
		1: { x: 1, y: 4, width: 5 },
		2: { x: 2, y: 4, width: 5 },
		3: { x: 3, y: 4, width: 5 },
		4: { x: 4, y: 4, width: 5 },
		5: { x: 5, y: 4, width: 5 },
		6: { x: 6, y: 4, width: 5 },
		7: { x: 7, y: 4, width: 5 },
		8: { x: 8, y: 4, width: 5 },
		9: { x: 9, y: 4, width: 5 },
		"-": { x: 11, y: 4, width: 5 },
		"+": { x: 12, y: 4, width: 5 },
		"/": { x: 13, y: 4, width: 5 },
		"\\": { x: 14, y: 4, width: 5 },
		"<": { x: 15, y: 4, width: 4 },
		">": { x: 16, y: 4, width: 4 },
		"!": { x: 17, y: 4, width: 1 },
		"?": { x: 18, y: 4, width: 5 },
		":": { x: 0, y: 5, width: 1 },
		";": { x: 1, y: 5, width: 1 },
		".": { x: 2, y: 5, width: 1 },
		",": { x: 3, y: 5, width: 1 },
		'"': { x: 4, y: 5, width: 3 },
		"'": { x: 5, y: 5, width: 1 },
		"(": { x: 6, y: 5, width: 5 },
		")": { x: 7, y: 5, width: 5 },
		"[": { x: 8, y: 5, width: 5 },
		"]": { x: 9, y: 5, width: 5 },
		"{": { x: 10, y: 5, width: 5 },
		"}": { x: 11, y: 5, width: 5 },
		"@": { x: 12, y: 5, width: 6 },

		" ": { x: 19, y: 5, width: 2 },
		"\n": { x: 19, y: 5, width: 0 },
	},
	wcp: {
		cellWidth: 9,
		cellHeight: 16,
		A: { x: 0, y: 0, width: 6 },
		B: { x: 1, y: 0, width: 7 },
		C: { x: 2, y: 0, width: 7 },
		D: { x: 3, y: 0, width: 7 },
		E: { x: 4, y: 0, width: 7 },
		F: { x: 5, y: 0, width: 7 },
		G: { x: 6, y: 0, width: 7 },
		H: { x: 7, y: 0, width: 6 },
		I: { x: 8, y: 0, width: 4 },
		J: { x: 9, y: 0, width: 7 },
		K: { x: 10, y: 0, width: 7 },
		L: { x: 11, y: 0, width: 7 },
		M: { x: 12, y: 0, width: 7 },
		N: { x: 13, y: 0, width: 7 },
		O: { x: 0, y: 1, width: 7 },
		P: { x: 1, y: 1, width: 7 },
		Q: { x: 2, y: 1, width: 7 },
		R: { x: 3, y: 1, width: 7 },
		S: { x: 4, y: 1, width: 6 },
		T: { x: 5, y: 1, width: 6 },
		U: { x: 6, y: 1, width: 6 },
		V: { x: 7, y: 1, width: 6 },
		W: { x: 8, y: 1, width: 7 },
		X: { x: 9, y: 1, width: 6 },
		Y: { x: 10, y: 1, width: 6 },
		Z: { x: 11, y: 1, width: 6 },
		Á: { x: 0, y: 2, width: 6 },
		À: { x: 1, y: 2, width: 6 },
		Â: { x: 3, y: 2, width: 6 },
		Ã: { x: 2, y: 2, width: 7 },
		É: { x: 4, y: 2, width: 7 },
		Ê: { x: 5, y: 2, width: 7 },
		Í: { x: 6, y: 2, width: 5 },
		Ó: { x: 7, y: 2, width: 7 },
		Ô: { x: 8, y: 2, width: 7 },
		Õ: { x: 9, y: 2, width: 7 },
		Ú: { x: 10, y: 2, width: 6 },
		Ç: { x: 11, y: 2, width: 6 },
		"@": { x: 12, y: 2, width: 7 },
		a: { x: 0, y: 3, width: 7 },
		b: { x: 1, y: 3, width: 7 },
		c: { x: 2, y: 3, width: 6 },
		d: { x: 3, y: 3, width: 7 },
		e: { x: 4, y: 3, width: 6 },
		f: { x: 5, y: 3, width: 6 },
		g: { x: 6, y: 3, width: 7 },
		h: { x: 7, y: 3, width: 7 },
		i: { x: 8, y: 3, width: 6 },
		j: { x: 9, y: 3, width: 6 },
		k: { x: 10, y: 3, width: 7 },
		l: { x: 11, y: 3, width: 6 },
		m: { x: 12, y: 3, width: 7 },
		n: { x: 13, y: 3, width: 6 },
		o: { x: 0, y: 4, width: 6 },
		p: { x: 1, y: 4, width: 7 },
		q: { x: 2, y: 4, width: 7 },
		r: { x: 3, y: 4, width: 7 },
		s: { x: 4, y: 4, width: 6 },
		t: { x: 5, y: 4, width: 6 },
		u: { x: 6, y: 4, width: 7 },
		v: { x: 7, y: 4, width: 6 },
		w: { x: 8, y: 4, width: 7 },
		x: { x: 9, y: 4, width: 7 },
		y: { x: 10, y: 4, width: 7 },
		z: { x: 11, y: 4, width: 6 },
		"<": { x: 12, y: 4, width: 6 },
		">": { x: 13, y: 4, width: 6 },
		á: { x: 0, y: 5, width: 6 },
		à: { x: 1, y: 5, width: 6 },
		ã: { x: 2, y: 5, width: 6 },
		â: { x: 3, y: 5, width: 6 },
		é: { x: 4, y: 5, width: 6 },
		ê: { x: 5, y: 5, width: 6 },
		í: { x: 6, y: 5, width: 6 },
		ó: { x: 7, y: 5, width: 6 },
		ô: { x: 8, y: 5, width: 6 },
		õ: { x: 9, y: 5, width: 6 },
		ú: { x: 10, y: 5, width: 6 },
		ç: { x: 11, y: 5, width: 6 },
		"/": { x: 12, y: 5, width: 8 },
		"\\": { x: 13, y: 5, width: 8 },
		0: { x: 0, y: 6, width: 7 },
		1: { x: 1, y: 6, width: 6 },
		2: { x: 2, y: 6, width: 6 },
		3: { x: 3, y: 6, width: 6 },
		4: { x: 4, y: 6, width: 7 },
		5: { x: 5, y: 6, width: 6 },
		6: { x: 6, y: 6, width: 6 },
		7: { x: 7, y: 6, width: 6 },
		8: { x: 8, y: 6, width: 6 },
		9: { x: 9, y: 6, width: 6 },
		"-": { x: 10, y: 6, width: 6 },
		"+": { x: 11, y: 6, width: 6 },
		"*": { x: 12, y: 6, width: 7 },
		"^": { x: 13, y: 6, width: 7 },
		"!": { x: 0, y: 6, width: 6 },
		"?": { x: 1, y: 6, width: 6 },
		":": { x: 2, y: 6, width: 6 },
		";": { x: 3, y: 6, width: 6 },
		".": { x: 4, y: 6, width: 6 },
		",": { x: 5, y: 6, width: 6 },
		'"': { x: 6, y: 6, width: 6 },
		"'": { x: 7, y: 6, width: 6 },
		"(": { x: 8, y: 6, width: 6 },
		")": { x: 9, y: 6, width: 6 },
		"[": { x: 10, y: 6, width: 6 },
		"]": { x: 11, y: 6, width: 6 },
		"{": { x: 12, y: 6, width: 6 },
		"}": { x: 13, y: 6, width: 6 },

		" ": { x: 19, y: 7, width: 2 },
		"\n": { x: 19, y: 7, width: 0 },
	},
};
