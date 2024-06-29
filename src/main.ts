import "./global.css";
import ComplexNumber from "complex";
const maxIterationCount = 99;

const getIterationCountWhenBeyond = (c: ComplexNumber) => {
  const cache = new Map();
  if (cache.has(c)) return cache.get(c);
  let zn = new ComplexNumber(0, 0);
  let iterationCount = 0;
  while (!(zn.abs() > 2 || iterationCount > maxIterationCount)) {
    zn = zn.multiply(zn).add(c);
    iterationCount += 1;
  }
  cache.set(c, iterationCount);
  return iterationCount;
};

const getColorOfIterationCount = (iterationCount: number) => {
  const blendHexColors = (c0: string, c1: string, p: number) => {
    const f = parseInt(c0.slice(1), 16),
      t = parseInt(c1.slice(1), 16),
      R1 = f >> 16,
      G1 = (f >> 8) & 0x00ff,
      B1 = f & 0x0000ff,
      R2 = t >> 16,
      G2 = (t >> 8) & 0x00ff,
      B2 = t & 0x0000ff;
    return (
      "#" +
      (
        0x1000000 +
        (Math.round((R2 - R1) * p) + R1) * 0x10000 +
        (Math.round((G2 - G1) * p) + G1) * 0x100 +
        (Math.round((B2 - B1) * p) + B1)
      )
        .toString(16)
        .slice(1)
    );
  };

  return blendHexColors(
    "#000000",
    "#ffffff",
    iterationCount / (maxIterationCount + 1)
  );
};

const main = () => {
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  let count = 0;
  const text = document.createElement("div");
  const author = document.createElement("p");
  const renderCount = document.createElement("p");
  author.textContent = "@Author：Trigold";
  text.style.zIndex = "9";
  text.style.position = "absolute";
  text.style.bottom = "0";
  text.style.right = "2em";
  text.style.color = "yellow";
  text.appendChild(author);
  text.appendChild(renderCount);
  document.body.appendChild(text);

  const context = canvas.getContext("2d");
  if (context === null) return;
  context.translate(canvas.width / 2, canvas.height / 2);
  const max = 2;

  const draw = () => {
    renderCount.textContent = `渲染次数：${count}`;
    const data = Array.from({ length: 10000 }, () => {
      const min = -max;
      const randomNumber = () => Math.random() * (max - min + 1) + min;
      const c = new ComplexNumber(randomNumber(), randomNumber());
      return [c.real, c.im, getIterationCountWhenBeyond(c)];
    });
    data.forEach(([x, y, iterationCount]) => {
      context.beginPath();
      context.arc(
        x * (canvas.width / 2 / max),
        y * (canvas.width / 2 / max),
        0.5,
        0,
        2 * Math.PI
      );
      context.closePath();
      context.fillStyle = getColorOfIterationCount(iterationCount);
      context.fill();
    });
    count += 1;
    window.requestAnimationFrame(draw);
  };

  draw();
};

main();
