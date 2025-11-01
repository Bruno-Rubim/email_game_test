import { CanvasObject } from "./canvas-object.js";
import { AppIcon, Email, GameObject, RenderObject } from "./game-object.js";
import { findSprite } from "./sprite-loader.js";

const body = document.querySelector("body");

const maxHeight = window.innerHeight;
let scale = maxHeight / 256;
let canvasWidth = 352 * scale;

export const canvas = new CanvasObject({
  height: maxHeight,
  width: canvasWidth,
  scale: scale,
  backgroundColor: "#000",
});
canvas.generateElement(body);

export const cursor = new GameObject({
  pos: { x: 0, y: 0 },
  renderObject: new RenderObject({
    width: 32,
    height: 32,
    sprite: findSprite("cursor_arrow"),
    posShift: { x: -16, y: -16 },
  }),
});

let currentSceneObjects = [];

const desktopBackground = new GameObject({
  pos: { x: 0, y: 0 },
  renderObject: new RenderObject({
    width: 352,
    height: 256,
    sprite: findSprite("blue_bg"),
  }),
});
const concepts = new AppIcon({
  pos: { x: 16, y: 16 },
  renderObject: new RenderObject({
    width: 32,
    height: 32,
    sprite: findSprite("concepts_icon"),
  }),
  hitboxHeight: 44,
  iconName: "Conceitos",
});
const training = new AppIcon({
  pos: { x: 80, y: 16 },
  renderObject: new RenderObject({
    width: 32,
    height: 32,
    sprite: findSprite("email_icon"),
  }),
  hitboxHeight: 44,
  iconName: "Treinamento",
});
const settings = new AppIcon({
  pos: { x: 16, y: 80 },
  renderObject: new RenderObject({
    width: 32,
    height: 32,
    sprite: findSprite("settings_icon"),
  }),
  hitboxHeight: 44,
  iconName: "Ajustes",
});
const saves = new AppIcon({
  pos: { x: 80, y: 80 },
  renderObject: new RenderObject({
    width: 32,
    height: 32,
    sprite: findSprite("saves_icon"),
  }),
  hitboxHeight: 44,
  iconName: "Salvamentos",
});

const desktopObjects = [desktopBackground, concepts, training, settings, saves];

const emailBackground = new GameObject({
  pos: { x: 0, y: 0 },
  renderObject: new RenderObject({
    width: 352,
    height: 256,
    sprite: findSprite("beige_bg"),
  }),
});

const emailUI = new GameObject({
  pos: { x: 0, y: 0 },
  renderObject: new RenderObject({
    width: 352,
    height: 256,
    sprite: findSprite("email_ui"),
  }),
});
const appBorder = new GameObject({
  pos: { x: 0, y: 0 },
  renderObject: new RenderObject({
    width: 352,
    height: 256,
    sprite: findSprite("app_border"),
  }),
});
const exitBtn = new GameObject({
  pos: { x: 324, y: 4 },
  renderObject: new RenderObject({
    width: 24,
    height: 24,
    sprite: findSprite("exit_btn"),
  }),
});
exitBtn.onClick = () => {
  currentSceneObjects = desktopObjects;
};
const email = new Email({
  picture: "default_picture_0",
  content:
    //`Hey there,\nWe're excited to announce that KaneAI, our GenAI-native testing agent, is now live on Product Hunt!\n\nSince the KaneAI beta launch, the response has been incredible. Your feedback has been instrumental in shaping KaneAI into the AI testing solution it is today, one that truly democratizes test automation for teams everywhere.\n\n\nExperience AI-native testing like never before\nKaneAI transforms how you approach test automation. Just tell it what to test in natural language, and watch as it:\n\nIntelligently plan your entire test strategy\nAuthor robust end-to-end tests\nContinuously adapts as your application\nevolves\n\nSkip the technical complexity - no coding, no frameworks, no headaches. \n\nReady to experience AI-native testing? Try KaneAI today and see the future of test automation in action.\n\nVisit KaneAI on Product Hunt\n\nYour support and feedback on Product Hunt would mean the world to us. Thank you for being part of this journey!\n\nBest regards,\nThe LambdaTest Team​​​​​​`
    `Se você ainda faz SEO como era feito em 2014, provavelmente você está, nesse momento, desesperado com a queda de tráfego do seu blog.\n\nA chegada do AI Mode no Google é, sem dúvidas, a maior mudança da SERP desde a atualização Panda.\n\nQuem tem blog "velho" tá aí sofrendo. Aqueles milhares de blog-posts com assuntos longtail super difíceis de dar manutenção e manter relevantes.\n\nFora que a empresa evoluiu, cresceu, as estratégias de marketing também mudaram e, ao mesmo tempo, um monte de banners, ctas, materiais ou estão ultrapassados ou até mesmo com link quebrado espalhados por todos os milhares e milhares de conteúdos.\n\nO custo de manutenção subindo e o orçamento diminuindo, afinal o tráfego está caindo, não apenas pelos desafios que comentei, mas também porque as pessoas estão clicando cada vez menos, com o efeito do que chamamos, desde 2017, de zero-click.\n\nUma soma de fatores está chacoalhando a indústria.\n\nAinda temos o aumento dos muros dos jardins fechados, que também contribui para a diminuição de tráfego nos sites e blogs. Até porque nenhuma rede social quer que o usuário saia para um link externo. Por isso que, quando você cola um link num post, tipo esse, a tendência é que seu alcance seja menor.\n\nAutoridade de domínio também já não é mais tão importante quanto antes. O que vale mesmo são recomendações, boas, de especialistas ao seu negócio. Vale mais um especialista que um blog sem cara, sem face, sem assinatura de um... humano (mesmo que o conteúdo não seja lá tão humano assim).\n\nO SEO ainda funciona. Até porque as LLMs usam, e muito, o bom e velho SEO para estruturar suas respostas.\n\nO difícil desafio está, dentre outras coisas, fazer esse básico aqui:\n\n-- Se livrar de conteúdos velhos e que não tem nada a ver com a marca/estratégia atual;\n\n-- Atualizar muito bem, artesanalmente os conteúdos principais e que se relacionam diretamente com o núcleo duro do negócio;\n\n-- Marcar presença nos "jardins fechados", demonstrando conhecimento e reconhecimento como especialista no assunto central tratado no blog;\n\n-- Cultivar uma boa lista de emails para levar visitantes para o blog e mantendo a relevância estratégica de alguns conteúdos;\n\n-- Corrigir links quebrados, de parceiros que nem existem mais, de materiais que você também não usa fazem séculos;\n\n-- Buscar, mais que backlinks, citações de qualidade por especialistas e parceiros da sua indústria nos chamados "jardins fechados" como Reddit, Instagram, X, LinkedIn e assim por diante.\n\nVocê também precisa atualizar seus conteúdos com algumas coisas básicas, como:\n\n-- Resumo do conteúdo logo no início;\n\n-- Bulletpoints com os principais assuntos do artigo;\n\n-- Um pequeno FAQ ao final, complementando o tema.\n\nHá mais ajustes, mas esses já serão bem recebidos pelas LLMs e a probabilidade de começar a aparecer mais por lá aumenta.\n\nÉ uma longa conversa. De todo modo, esse é um pontapé inicial, pra quem estava se sentindo perdido em meio a tantas mudanças.\n\nMatt\n\nPS: Caso você não queira mais receber emails como esse, basta se descadastrar aqui.`,
});

const emailObjects = [emailBackground, emailUI, email, appBorder, exitBtn];

training.onClick = () => {
  currentSceneObjects = emailObjects;
};

canvas.element.addEventListener("mousemove", (e) => {
  cursor.pos.x = e.offsetX / canvas.scale;
  cursor.pos.y = e.offsetY / canvas.scale;
  let pointer = false;
  currentSceneObjects.forEach((o) => {
    if (o.onClick && o.posInHitbox(cursor.pos)) {
      pointer = true;
      cursor.renderObject.sprite = findSprite("cursor_pointer");
    }
  });
  if (!pointer) {
    cursor.renderObject.sprite = findSprite("cursor_arrow");
  }
});

canvas.element.addEventListener("click", (e) => {
  currentSceneObjects.forEach((o) => {
    if (o.onClick && o.posInHitbox(cursor.pos)) {
      o.onClick(cursor);
      cursor.renderObject.sprite = findSprite("cursor_arrow");
    }
  });
});

canvas.element.addEventListener("wheel", (e) => {
  e.preventDefault();
  let email = currentSceneObjects.find((x) => x.isEmail == true);
  if (!email) {
    return;
  }
  if (e.deltaY > 0) {
    email.textContent.scroll(1);
  }
  if (e.deltaY < 0) {
    email.textContent.scroll(-1);
  }
});

canvas.element.addEventListener("mousedown", (e) => {
  cursor.renderObject.posShift = { x: -16, y: -15 };
});

canvas.element.addEventListener("mouseup", (e) => {
  cursor.renderObject.posShift = { x: -16, y: -16 };
});

currentSceneObjects = desktopObjects;

function render() {
  canvas.clearCanvas();
  currentSceneObjects.forEach((o) => {
    o.drawSprite(canvas);
  });
  cursor.drawSprite(canvas);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
