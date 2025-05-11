// Шумы

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Функция плавности
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

// Линейная интерполяция
function lerp(a, b, t) {
    return a + t * (b - a);
}

// Улучшенный градиент (8 направлений)
function grad(hash, x, y) {
    const h = hash & 7; // 8 направлений
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

// Генерация перестановки
function generatePermutation() {
    const p = [];
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
    }
    return [...p, ...p];
}

// Базовая Perlin-функция
function perlin2D(x, y, perm) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];

    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
    return lerp(x1, x2, v);
}

// Простая реализация FFT (быстрое преобразование Фурье)
function fft(real, imag, w, h) {
    for (let u = 0; u < w; u++) {
        for (let v = 0; v < h; v++) {
            let sumReal = 0, sumImag = 0;
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    const angle = 2 * Math.PI * ((u * x) / w + (v * y) / h);
                    sumReal += real[x + y * w] * Math.cos(angle) - imag[x + y * w] * Math.sin(angle);
                    sumImag += real[x + y * w] * Math.sin(angle) + imag[x + y * w] * Math.cos(angle);
                }
            }
            real[u + v * w] = sumReal;
            imag[u + v * w] = sumImag;
        }
    }
}

// Обратное преобразование Фурье (IFFT)
function ifft(real, imag, w, h) {
    for (let i = 0; i < w * h; i++) {
        real[i] /= (w * h);
        imag[i] /= (w * h);
    }

    // Реализуем обратное преобразование
    fft(imag, real, w, h);
}

// ===== ОСНОВНЫЕ ФУНКЦИИ =====


function perlinNoise(width, height, scale, intensity, colorNoise, octaves = 1, persistence = 0.5) {

    const perm = generatePermutation();
    const channels = colorNoise ? 3 : 1;
    const data = new Uint8ClampedArray(width * height * channels);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < channels; c++) {
                let amplitude = 1;
                let frequency = 1;
                let noiseValue = 0;
                let maxAmplitude = 0;

                // Смещение каналов для цветного шума
                const offsetX = colorNoise ? (c * 128) : 0;

                for (let o = 0; o < octaves; o++) {
                    const nx = (x + offsetX) / (scale / frequency);
                    const ny = y / (scale / frequency);
                    const value = perlin2D(nx, ny, perm);

                    noiseValue += value * amplitude;
                    maxAmplitude += amplitude;
                    amplitude *= persistence;
                    frequency *= 2;
                }

                // Нормализация [-1, 1] → [0, 255]
                let normalized = ((noiseValue / maxAmplitude) + 1) / 2;
                let finalValue = Math.min(255, Math.max(0, normalized * intensity * 255));
                data[(y * width + x) * channels + c] = finalValue;
            }
        }
    }

    return data;
}

function simplexNoise(width, height, scale, intensity, colorNoise) {
    const output = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));

    const grad3 = [
        [1, 1], [-1, 1], [1, -1], [-1, -1],
        [1, 0], [-1, 0], [0, 1], [0, -1],
    ];
    const p = new Uint8Array(512);
    const perm = new Uint8Array(512);

    // Надёжный генератор случайностей
    const rand = mulberry32(42);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    function dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }

    function noise(xin, yin) {
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;

        const i1 = x0 > y0 ? 1 : 0;
        const j1 = x0 > y0 ? 0 : 1;

        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;

        const ii = i & 255;
        const jj = j & 255;

        const gi0 = perm[ii + perm[jj]] % 8;
        const gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
        const gi2 = perm[ii + 1 + perm[jj + 1]] % 8;

        let n0 = 0, n1 = 0, n2 = 0;

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            t0 *= t0;
            n0 = t0 * t0 * dot(grad3[gi0], x0, y0);
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            t1 *= t1;
            n1 = t1 * t1 * dot(grad3[gi1], x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            t2 *= t2;
            n2 = t2 * t2 * dot(grad3[gi2], x2, y2);
        }

        return 70.0 * (n0 + n1 + n2);
    }

    function mulberry32(a) {
        return function () {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            let t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    // Генерация шума по пикселям
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const nx = (x + c * 1000) / scale;
                const ny = y / scale;
                const val = noise(nx, ny); // от -1 до 1
                const pixel = Math.min(255, Math.max(0, ((val + 1) / 2) * intensity * 255));
                output[(y * width + x) * (colorNoise ? 3 : 1) + c] = pixel;
            }
        }
    }

    return output;
}


function fractalNoise(width, height, scale, intensity, colorNoise) {
    const perm = generatePermutation(); // нужно сгенерировать perm
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value = 0;
                let amplitude = 1;
                let frequency = 1 / scale;
                let maxAmplitude = 0;

                for (let i = 0; i < 6; i++) {
                    const sampleX = x * frequency + (colorNoise ? c * 100 : 0); // Смещение для цветных каналов
                    const sampleY = y * frequency;

                    const noiseVal = perlin2D(sampleX, sampleY, perm); // ✅ передаём perm
                    value += noiseVal * amplitude;

                    maxAmplitude += amplitude;
                    amplitude *= 0.5;
                    frequency *= 2;
                }

                const normalized = (value / maxAmplitude + 1) / 2;
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] =
                    Math.min(255, Math.max(0, normalized * intensity * 255));
            }
        }
    }

    return noise;
}

function cellularNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const points = [];
    const numPoints = Math.floor(width * height / (scale * scale));

    // Генерация случайных точек
    for (let i = 0; i < numPoints; i++) {
        points.push([Math.random() * width, Math.random() * height]);
    }

    // Для каждого пикселя вычисляем расстояние до ближайших точек
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let min1 = Infinity, min2 = Infinity;
            let closestPoint = null;

            // Находим ближайшие 2 точки
            for (const point of points) {
                const dx = x - point[0];
                const dy = y - point[1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < min1) {
                    min2 = min1;
                    min1 = dist;
                    closestPoint = point;
                } else if (dist < min2) {
                    min2 = dist;
                }
            }

            // Вычисление значения для клеточного шума на основе минимальных расстояний
            const value = Math.min(1, (min2 - min1) / scale) * intensity;

            // Заполнение массива шума в зависимости от выбранного типа шума
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                // Если colorNoise включен, добавляем случайный цвет на основе точки
                if (colorNoise) {
                    const idx = points.indexOf(closestPoint);
                    const r = (idx * 31) % 256;
                    const g = (idx * 57) % 256;
                    const b = (idx * 89) % 256;

                    // Распределяем значения по цветам
                    noise[(y * width + x) * 3 + 0] = Math.min(255, Math.max(0, value * r));
                    noise[(y * width + x) * 3 + 1] = Math.min(255, Math.max(0, value * g));
                    noise[(y * width + x) * 3 + 2] = Math.min(255, Math.max(0, value * b));
                } else {
                    // Монохромный вариант
                    noise[(y * width + x)] = Math.min(255, Math.max(0, value * 255));
                }
            }
        }
    }

    return noise;
}

function worleyNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));  // Создание массива для хранения шума
    const points = [];
    const numPoints = Math.floor(width * height / (scale * scale));  // Количество точек в зависимости от масштаба

    // Генерация случайных точек
    for (let i = 0; i < numPoints; i++) {
        points.push([Math.random() * width, Math.random() * height]);
    }

    // Для каждого пикселя вычисляем расстояния до ближайших точек
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = Infinity;
            let secondMinDist = Infinity;

            // Находим два ближайших центра
            for (const point of points) {
                const dx = x - point[0];
                const dy = y - point[1];
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Сортировка по минимальному и второму минимальному расстоянию
                if (dist < minDist) {
                    secondMinDist = minDist;
                    minDist = dist;
                } else if (dist < secondMinDist) {
                    secondMinDist = dist;
                }
            }

            // Нормализация разницы расстояний
            let value = (secondMinDist - minDist) / scale * intensity;
            value = Math.min(1, Math.max(0, value));  // Ограничиваем значение между 0 и 1 для нормализации

            // Применение этого значения к шуму
            if (colorNoise) {
                // Если создаём цветной шум, то генерируем случайные значения для R, G и B
                for (let c = 0; c < 3; c++) {
                    const colorValue = Math.floor(Math.min(255, Math.max(0, value * 255)));
                    noise[(y * width + x) * 3 + c] = colorValue;
                }
            } else {
                // Для монохромного шума используем одно значение
                const grayValue = Math.floor(Math.min(255, Math.max(0, value * 255)));
                noise[(y * width + x)] = grayValue;
            }
        }
    }

    return noise;  // Возвращаем массив шума
}

function voronoiNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));  // Создание массива для хранения шума
    const points = [];
    const numPoints = Math.floor(width * height / (scale * scale));  // Количество точек в зависимости от масштаба

    // Генерация случайных точек
    for (let i = 0; i < numPoints; i++) {
        points.push([Math.random() * width, Math.random() * height]);
    }

    // Для каждого пикселя вычисляем расстояния до ближайших точек
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = Infinity;
            let secondMinDist = Infinity;

            // Находим два ближайших центра
            for (const point of points) {
                const dx = x - point[0];
                const dy = y - point[1];
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Сортировка по минимальному и второму минимальному расстоянию
                if (dist < minDist) {
                    secondMinDist = minDist;
                    minDist = dist;
                } else if (dist < secondMinDist) {
                    secondMinDist = dist;
                }
            }

            // Нормализация разницы расстояний
            let value = (secondMinDist - minDist) / scale * intensity;
            value = Math.min(1, Math.max(0, value));  // Ограничиваем значение между 0 и 1 для нормализации

            // Применение этого значения к шуму
            if (colorNoise) {
                // Если создаём цветной шум, то генерируем случайные значения для R, G и B
                for (let c = 0; c < 3; c++) {
                    const colorValue = Math.floor(Math.min(255, Math.max(0, value * 255)));
                    noise[(y * width + x) * 3 + c] = colorValue;
                }
            } else {
                // Для монохромного шума используем одно значение
                const grayValue = Math.floor(Math.min(255, Math.max(0, value * 255)));
                noise[(y * width + x)] = grayValue;
            }
        }
    }

    return noise;  // Возвращаем массив шума
}

function billowNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));

    // Генерация перестановки (на одном уровне для всего шума)
    const perm = generatePermutation();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value = 0;
                let amplitude = 1;
                let frequency = 1 / scale;

                // Генерация фрактального шума с использованием Perlin
                for (let i = 0; i < 6; i++) {
                    const sampleX = x * frequency;
                    const sampleY = y * frequency;

                    // Используем Perlin
                    value += amplitude * perlin2D(sampleX, sampleY, perm);

                    amplitude *= 0.5;  // уменьшаем амплитуду
                    frequency *= 2;    // увеличиваем частоту
                }

                // Нормализация значения для RGB или одного канала
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(
                    255,
                    Math.max(0, (value * intensity * 255 + 255) / 2)
                );
            }
        }
    }

    return noise;
}

function ridgedNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value = 0;
                let amplitude = 1;
                let frequency = 1 / scale;
                for (let i = 0; i < 6; i++) {
                    const sampleX = x * frequency;
                    const sampleY = y * frequency;
                    let n = Math.sin(sampleX) + Math.cos(sampleY);
                    n = 1 - Math.abs(n);
                    n *= n;
                    value += amplitude * n;
                    amplitude *= 0.5;
                    frequency *= 2;
                }
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (value * intensity * 255 + 255) / 2));
            }
        }
    }
    return noise;
}

function whiteNoise(width, height, intensity, colorNoise, seed = Date.now(), distribution = "uniform") {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));

    // Простая реализация псевдослучайного генератора с seed
    let s = seed % 2147483647;
    function random() {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    }

    // Функция для нормального распределения (Box-Muller transform)
    function gaussianRandom() {
        let u = 0, v = 0;
        while (u === 0) u = random();
        while (v === 0) v = random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value;
                if (distribution === "gaussian") {
                    // Центрируем шум в 128, чтобы не было полного чёрного/белого
                    value = 128 + gaussianRandom() * 64 * intensity;
                } else {
                    value = random() * 255 * intensity;
                }
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, value));
            }
        }
    }

    return noise;
}

function pinkNoise(width, height, scale, intensity, colorNoise) {

    function fft2D(real, imag, width, height) {
        const rowReal = new Float32Array(width);
        const rowImag = new Float32Array(width);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                rowReal[x] = real[y * width + x];
                rowImag[x] = imag[y * width + x];
            }
            fft1D(rowReal, rowImag);
            for (let x = 0; x < width; x++) {
                real[y * width + x] = rowReal[x];
                imag[y * width + x] = rowImag[x];
            }
        }

        const colReal = new Float32Array(height);
        const colImag = new Float32Array(height);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                colReal[y] = real[y * width + x];
                colImag[y] = imag[y * width + x];
            }
            fft1D(colReal, colImag);
            for (let y = 0; y < height; y++) {
                real[y * width + x] = colReal[y];
                imag[y * width + x] = colImag[y];
            }
        }
    }

    function ifft2D(real, imag, width, height) {
        for (let i = 0; i < width * height; i++) {
            imag[i] = -imag[i];
        }
        fft2D(real, imag, width, height);
        for (let i = 0; i < width * height; i++) {
            real[i] /= (width * height);
            imag[i] = -imag[i] / (width * height);
        }
    }

    function fft1D(real, imag) {
        const n = real.length;
        const PI2 = Math.PI * 2;

        // Битовая инверсия
        const rev = new Uint32Array(n);
        let bits = Math.log2(n);
        for (let i = 0; i < n; i++) {
            let x = i;
            let r = 0;
            for (let j = 0; j < bits; j++) {
                r = (r << 1) | (x & 1);
                x >>= 1;
            }
            rev[i] = r;
        }

        for (let i = 0; i < n; i++) {
            if (i < rev[i]) {
                [real[i], real[rev[i]]] = [real[rev[i]], real[i]];
                [imag[i], imag[rev[i]]] = [imag[rev[i]], imag[i]];
            }
        }

        for (let size = 2; size <= n; size <<= 1) {
            const half = size >> 1;
            const tableStep = PI2 / size;
            for (let i = 0; i < n; i += size) {
                for (let j = 0; j < half; j++) {
                    const angle = j * tableStep;
                    const wr = Math.cos(angle);
                    const wi = Math.sin(angle);
                    const evenR = real[i + j];
                    const evenI = imag[i + j];
                    const oddR = real[i + j + half];
                    const oddI = imag[i + j + half];

                    const tr = wr * oddR - wi * oddI;
                    const ti = wr * oddI + wi * oddR;

                    real[i + j] = evenR + tr;
                    imag[i + j] = evenI + ti;
                    real[i + j + half] = evenR - tr;
                    imag[i + j + half] = evenI - ti;
                }
            }
        }
    }

    const channels = colorNoise ? 3 : 1;
    const noise = new Uint8ClampedArray(width * height * channels);
    const white = whiteNoise(width, height, scale, colorNoise); // [0..255]

    // Преобразуем в float32 [-1..1]
    const toFloatArray = (src, ch) => {
        const out = new Float32Array(width * height);
        for (let i = 0; i < width * height; i++) {
            out[i] = (src[i * ch] - 128) / 128; // нормализуем
        }
        return out;
    };

    const input = toFloatArray(white, channels);
    const real = input.slice();
    const imag = new Float32Array(width * height);

    // FFT 2D (наивная реализация)
    fft2D(real, imag, width, height);

    // Применяем фильтр 1/sqrt(f² + 1)
    for (let y = 0; y < height; y++) {
        const fy = y < height / 2 ? y : y - height;
        for (let x = 0; x < width; x++) {
            const fx = x < width / 2 ? x : x - width;
            const idx = y * width + x;
            const freq = Math.sqrt(fx * fx + fy * fy);
            const scaleFactor = 1 / Math.sqrt(freq * freq + 1);
            real[idx] *= scaleFactor;
            imag[idx] *= scaleFactor;
        }
    }

    // Обратное FFT
    ifft2D(real, imag, width, height);

    // Переводим результат обратно в [0..255]
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const val = real[y * width + x] * intensity;
            const clamped = Math.min(255, Math.max(0, (val * 128 + 128)));
            for (let c = 0; c < channels; c++) {
                noise[(y * width + x) * channels + c] = clamped;
            }
        }
    }

    return noise;
}

function brownNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    let lastValue = [0, 0, 0];

    // Функция для генерации шума с учетом зависимости между пикселями
    function generateNoise() {
        let value = (Math.random() - 0.5) * 2 / scale;
        lastValue[0] += value;
        lastValue[0] = Math.min(1, Math.max(-1, lastValue[0]));

        // Если включен цветной шум
        if (colorNoise) {
            lastValue[1] += (Math.random() - 0.5) * 2 / scale;
            lastValue[1] = Math.min(1, Math.max(-1, lastValue[1]));

            lastValue[2] += (Math.random() - 0.5) * 2 / scale;
            lastValue[2] = Math.min(1, Math.max(-1, lastValue[2]));
        }

        return lastValue;
    }

    // Генерация шума для каждого пикселя
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let colorValues = generateNoise();

            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                // Преобразование значений в диапазон от 0 до 255
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, ((colorValues[c] + 1) / 2) * intensity * 255));
            }
        }
    }

    return noise;
}

function blueNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value = 0;
                let amplitude = 1;
                let frequency = 1 / scale;
                for (let i = 0; i < 6; i++) {
                    value += amplitude * (Math.random() - 0.5) * 2 * frequency;
                    amplitude *= 0.5;
                    frequency *= 2;
                }
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (value * intensity * 255 + 255) / 2));
            }
        }
    }
    return noise;
}

function gradientNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const nx = x / scale;
                const ny = y / scale;
                const value = (Math.sin(nx) + Math.cos(ny)) * intensity;
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (value * 255 + 255) / 2));
            }
        }
    }
    return noise;
}

function sparkleNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const points = [];
    const numPoints = Math.floor(width * height / (scale * scale));
    for (let i = 0; i < numPoints; i++) {
        points.push([Math.random() * width, Math.random() * height]);
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = 0;
            for (const point of points) {
                const dx = x - point[0];
                const dy = y - point[1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < scale) {
                    value += (1 - dist / scale) * intensity;
                }
            }
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, value * 255));
            }
        }
    }
    return noise;
}

function impulseNoise(width, height, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const rand = Math.random();
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = rand < intensity * 0.1 ? (rand < 0.05 ? 255 : 0) : 128;
            }
        }
    }
    return noise;
}

function stripeNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const stripeWidth = scale * 10;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = Math.sin(x / stripeWidth) * intensity;
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (value * 255 + 255) / 2));
            }
        }
    }
    return noise;
}

function turbulentNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = 0;
            let amplitude = 1;
            let frequency = 1 / scale;
            for (let i = 0; i < 6; i++) {
                const sampleX = x * frequency;
                const sampleY = y * frequency;
                value += amplitude * Math.abs(Math.sin(sampleX + Math.cos(sampleY * frequency)));
                amplitude *= 0.5;
                frequency *= 2;
            }
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (value * intensity * 255 + 255) / 2));
            }
        }
    }
    return noise;
}

function multilayerPerlinNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const octaves = 4; // Количество октав для многослойности
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value = 0;
                let amplitude = 1;
                let frequency = 1 / scale;
                for (let i = 0; i < octaves; i++) {
                    const sampleX = x * frequency + c * 100; // Смещение для цветного шума
                    const sampleY = y * frequency + c * 100;
                    value += amplitude * (Math.sin(sampleX) + Math.cos(sampleY));
                    amplitude *= 0.5; // Уменьшение амплитуды для каждой октавы
                    frequency *= 2; // Увеличение частоты
                }
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, ((value + 2) / 4) * intensity * 255));
            }
        }
    }
    return noise;
}

function diamondSquareNoise(width, height, scale, intensity, colorNoise) {
    const size = Math.max(width, height);
    const gridSize = Math.pow(2, Math.ceil(Math.log2(size))) + 1;
    const grid = new Array(gridSize).fill().map(() => new Array(gridSize).fill(0));

    // Инициализация углов
    grid[0][0] = (Math.random() - 0.5) * intensity * 255;
    grid[0][gridSize - 1] = (Math.random() - 0.5) * intensity * 255;
    grid[gridSize - 1][0] = (Math.random() - 0.5) * intensity * 255;
    grid[gridSize - 1][gridSize - 1] = (Math.random() - 0.5) * intensity * 255;

    let step = gridSize - 1;
    let roughness = intensity;

    while (step > 1) {
        const halfStep = step / 2;

        // Diamond step
        for (let y = halfStep; y < gridSize; y += step) {
            for (let x = halfStep; x < gridSize; x += step) {
                const avg = (
                    grid[y - halfStep][x - halfStep] +
                    grid[y - halfStep][x + halfStep] +
                    grid[y + halfStep][x - halfStep] +
                    grid[y + halfStep][x + halfStep]
                ) / 4;
                grid[y][x] = avg + (Math.random() - 0.5) * roughness * 255;
            }
        }

        // Square step
        for (let y = 0; y < gridSize; y += halfStep) {
            for (let x = (y % step === 0) ? halfStep : 0; x < gridSize; x += step) {
                let sum = 0, count = 0;
                if (x >= halfStep) { sum += grid[y][x - halfStep]; count++; }
                if (x + halfStep < gridSize) { sum += grid[y][x + halfStep]; count++; }
                if (y >= halfStep) { sum += grid[y - halfStep][x]; count++; }
                if (y + halfStep < gridSize) { sum += grid[y + halfStep][x]; count++; }
                grid[y][x] = sum / count + (Math.random() - 0.5) * roughness * 255;
            }
        }

        step /= 2;
        roughness *= 0.5; // Уменьшение шероховатости
    }

    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const gridX = Math.floor((x / width) * gridSize);
                const gridY = Math.floor((y / height) * gridSize);
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (grid[gridY][gridX] + 255) / 2));
            }
        }
    }
    return noise;
}

function ridgedMultifractalNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const octaves = 4;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value = 0;
                let amplitude = 1;
                let frequency = 1 / scale;
                let prev = 1;
                for (let i = 0; i < octaves; i++) {
                    const sampleX = x * frequency + c * 100;
                    const sampleY = y * frequency + c * 100;
                    let n = Math.sin(sampleX) + Math.cos(sampleY);
                    n = Math.abs(n);
                    n = 1 - n; // Инверсия для резких пиков
                    n *= n * prev; // Усиление резкости
                    prev = n;
                    value += amplitude * n;
                    amplitude *= 0.5;
                    frequency *= 2;
                }
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (value * intensity * 255 + 255) / 2));
            }
        }
    }
    return noise;
}

function midpointDisplacementNoise(width, height, scale, intensity, colorNoise) {
    const size = Math.max(width, height);
    const gridSize = Math.pow(2, Math.ceil(Math.log2(size))) + 1;
    const grid = new Array(gridSize).fill().map(() => new Array(gridSize).fill(0));

    // Инициализация углов
    grid[0][0] = (Math.random() - 0.5) * intensity * 255;
    grid[0][gridSize - 1] = (Math.random() - 0.5) * intensity * 255;
    grid[gridSize - 1][0] = (Math.random() - 0.5) * intensity * 255;
    grid[gridSize - 1][gridSize - 1] = (Math.random() - 0.5) * intensity * 255;

    let step = gridSize - 1;
    let roughness = intensity;

    while (step > 1) {
        const halfStep = step / 2;

        // Midpoint displacement
        for (let y = halfStep; y < gridSize; y += step) {
            for (let x = halfStep; x < gridSize; x += step) {
                const avg = (
                    grid[y - halfStep][x - halfStep] +
                    grid[y - halfStep][x + halfStep] +
                    grid[y + halfStep][x - halfStep] +
                    grid[y + halfStep][x + halfStep]
                ) / 4;
                grid[y][x] = avg + (Math.random() - 0.5) * roughness * 255;
            }
        }

        step /= 2;
        roughness *= 0.6; // Уменьшение шероховатости
    }

    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const gridX = Math.floor((x / width) * gridSize);
                const gridY = Math.floor((y / height) * gridSize);
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (grid[gridY][gridX] + 255) / 2));
            }
        }
    }
    return noise;
}

function voronoiRidgedNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const points = [];
    const numPoints = Math.floor(width * height / (scale * scale));
    for (let i = 0; i < numPoints; i++) {
        points.push([Math.random() * width, Math.random() * height]);
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = Infinity;
            let secondMinDist = Infinity;
            for (const point of points) {
                const dx = x - point[0];
                const dy = y - point[1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    secondMinDist = minDist;
                    minDist = dist;
                } else if (dist < secondMinDist) {
                    secondMinDist = dist;
                }
            }
            const value = Math.abs(secondMinDist - minDist) / scale * intensity;
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, (1 - value) * 255)); // Инверсия для резкости
            }
        }
    }
    return noise;
}

function waveletNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const layers = 3; // Количество слоев вейвлетов
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                let value = 0;
                let amplitude = 1;
                let frequency = 1 / scale;
                for (let i = 0; i < layers; i++) {
                    const sampleX = x * frequency + c * 50;
                    const sampleY = y * frequency + c * 50;
                    value += amplitude * (Math.sin(sampleX) * Math.cos(sampleY) + (Math.random() - 0.5));
                    amplitude *= 0.7;
                    frequency *= 1.5;
                }
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, ((value + 1) / 2) * intensity * 255));
            }
        }
    }
    return noise;
}

function erosionNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const baseNoise = perlinNoise(width, height, scale * 2, intensity, colorNoise); // Базовый Перлин для высот
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const index = (y * width + x) * (colorNoise ? 3 : 1) + c;
                let value = baseNoise[index] / 255;
                // Имитация эрозии: усиление низин и сглаживание пиков
                value = Math.pow(value, 1.5) * (1 - Math.abs(Math.sin(x / scale) * Math.cos(y / scale)) * 0.3);
                noise[index] = Math.min(255, Math.max(0, value * intensity * 255));
            }
        }
    }
    return noise;
}

function flowNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                // Имитация потоков с использованием синусоидальных искажений
                const sampleX = x / scale + Math.sin(y / scale) * 2;
                const sampleY = y / scale + Math.cos(x / scale) * 2;
                let value = (Math.sin(sampleX) + Math.cos(sampleY)) * 0.5;
                value += (Math.random() - 0.5) * 0.2; // Легкая случайность
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, ((value + 1) / 2) * intensity * 255));
            }
        }
    }
    return noise;
}

function organicNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const points = [];
    const numPoints = Math.floor(width * height / (scale * scale));
    for (let i = 0; i < numPoints; i++) {
        points.push([Math.random() * width, Math.random() * height]);
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = 0;
            for (const point of points) {
                const dx = x - point[0];
                const dy = y - point[1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                value += Math.exp(-dist / scale) * intensity; // Органический спад
            }
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, value * 255));
            }
        }
    }
    return noise;
}

function cloudNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const baseNoise = perlinNoise(width, height, scale * 3, intensity, colorNoise); // Базовый Перлин для мягких облаков
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const index = (y * width + x) * (colorNoise ? 3 : 1) + c;
                let value = baseNoise[index] / 255;
                // Имитация облаков: усиление контраста и мягкие края
                value = Math.pow(value, 2) * (1 + Math.sin(x / scale + y / scale) * 0.2);
                noise[index] = Math.min(255, Math.max(0, value * intensity * 255));
            }
        }
    }
    return noise;
}

function lavaNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                // Имитация лавы: турбулентные искажения с яркими пятнами
                const sampleX = x / scale + Math.sin(y / (scale * 0.5)) * 1.5;
                const sampleY = y / scale + Math.cos(x / (scale * 0.5)) * 1.5;
                let value = Math.abs(Math.sin(sampleX) * Math.cos(sampleY));
                value += (Math.random() - 0.5) * 0.3; // Случайные вспышки
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, value * intensity * 255));
            }
        }
    }
    return noise;
}

function fabricNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                // Имитация ткани: волокнистые узоры с переплетениями
                const sampleX = x / scale;
                const sampleY = y / scale;
                let value = (Math.sin(sampleX * 2) + Math.cos(sampleY * 2)) * 0.5;
                value += Math.sin((x + y) / scale) * 0.3; // Диагональные волокна
                value += (Math.random() - 0.5) * 0.1; // Легкая случайность
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, ((value + 1) / 2) * intensity * 255));
            }
        }
    }
    return noise;
}

function cloudNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    const baseNoise = perlinNoise(width, height, scale * 3, intensity, colorNoise); // Базовый Перлин для мягких облаков
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                const index = (y * width + x) * (colorNoise ? 3 : 1) + c;
                let value = baseNoise[index] / 255;
                // Имитация облаков: усиление контраста и мягкие края
                value = Math.pow(value, 2) * (1 + Math.sin(x / scale + y / scale) * 0.2);
                noise[index] = Math.min(255, Math.max(0, value * intensity * 255));
            }
        }
    }
    return noise;
}

function lavaNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                // Имитация лавы: турбулентные искажения с яркими пятнами
                const sampleX = x / scale + Math.sin(y / (scale * 0.5)) * 1.5;
                const sampleY = y / scale + Math.cos(x / (scale * 0.5)) * 1.5;
                let value = Math.abs(Math.sin(sampleX) * Math.cos(sampleY));
                value += (Math.random() - 0.5) * 0.3; // Случайные вспышки
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, value * intensity * 255));
            }
        }
    }
    return noise;
}

function fabricNoise(width, height, scale, intensity, colorNoise) {
    const noise = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                // Имитация ткани: волокнистые узоры с переплетениями
                const sampleX = x / scale;
                const sampleY = y / scale;
                let value = (Math.sin(sampleX * 2) + Math.cos(sampleY * 2)) * 0.5;
                value += Math.sin((x + y) / scale) * 0.3; // Диагональные волокна
                value += (Math.random() - 0.5) * 0.1; // Легкая случайность
                noise[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, ((value + 1) / 2) * intensity * 255));
            }
        }
    }
    return noise;
}

function warpMap(width, height, scale, intensity, colorNoise) {
    const warpX = new Float32Array(width * height);
    const warpY = new Float32Array(width * height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sampleX = x / scale;
            const sampleY = y / scale;
            warpX[y * width + x] = (Math.sin(sampleX) + Math.cos(sampleY)) * intensity * 10;
            warpY[y * width + x] = (Math.cos(sampleX) + Math.sin(sampleY)) * intensity * 10;
        }
    }
    return { warpX, warpY };
}

function applyWarp(imageData, warpX, warpY, width, height) {
    const result = new Uint8ClampedArray(imageData.data.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const dx = warpX[y * width + x];
            const dy = warpY[y * width + x];
            const newX = Math.min(width - 1, Math.max(0, Math.round(x + dx)));
            const newY = Math.min(height - 1, Math.max(0, Math.round(y + dy)));
            const newIdx = (newY * width + newX) * 4;
            result[idx] = imageData.data[newIdx];
            result[idx + 1] = imageData.data[newIdx + 1];
            result[idx + 2] = imageData.data[newIdx + 2];
            result[idx + 3] = imageData.data[newIdx + 3];
        }
    }
    return new ImageData(result, width, height);
}

/// === Сглаживания 


function gaussianBlur(imgData, width, height, radius) {
    if (radius <= 0) return imgData;
    const kernelSize = Math.ceil(radius) * 2 + 1;
    const kernel = [];
    let sum = 0;
    const sigma = radius / 3;

    for (let i = -Math.floor(kernelSize / 2); i <= Math.floor(kernelSize / 2); i++) {
        const value = Math.exp(-(i * i) / (2 * sigma * sigma));
        kernel.push(value);
        sum += value;
    }
    for (let i = 0; i < kernel.length; i++) kernel[i] /= sum;

    const tempData = new Uint8ClampedArray(imgData.data);
    const outputData = new Uint8ClampedArray(imgData.data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let i = 0; i < kernel.length; i++) {
                const offsetX = x + i - Math.floor(kernelSize / 2);
                if (offsetX >= 0 && offsetX < width) {
                    const index = (y * width + offsetX) * 4;
                    const weight = kernel[i];
                    r += tempData[index] * weight;
                    g += tempData[index + 1] * weight;
                    b += tempData[index + 2] * weight;
                    a += tempData[index + 3] * weight;
                }
            }
            const index = (y * width + x) * 4;
            outputData[index] = r;
            outputData[index + 1] = g;
            outputData[index + 2] = b;
            outputData[index + 3] = a;
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let i = 0; i < kernel.length; i++) {
                const offsetY = y + i - Math.floor(kernelSize / 2);
                if (offsetY >= 0 && offsetY < height) {
                    const index = (offsetY * width + x) * 4;
                    const weight = kernel[i];
                    r += outputData[index] * weight;
                    g += outputData[index + 1] * weight;
                    b += outputData[index + 2] * weight;
                    a += outputData[index + 3] * weight;
                }
            }
            const index = (y * width + x) * 4;
            imgData.data[index] = r;
            imgData.data[index + 1] = g;
            imgData.data[index + 2] = b;
            imgData.data[index + 3] = a;
        }
    }
    return imgData;
}

function medianFilter(imgData, width, height, radius) {
    if (radius <= 0) return imgData;
    const kernelSize = radius * 2 + 1;
    const outputData = new Uint8ClampedArray(imgData.data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const rValues = [], gValues = [], bValues = [], aValues = [];
            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const index = (ny * width + nx) * 4;
                        rValues.push(imgData.data[index]);
                        gValues.push(imgData.data[index + 1]);
                        bValues.push(imgData.data[index + 2]);
                        aValues.push(imgData.data[index + 3]);
                    }
                }
            }
            rValues.sort((a, b) => a - b);
            gValues.sort((a, b) => a - b);
            bValues.sort((a, b) => a - b);
            aValues.sort((a, b) => a - b);
            const index = (y * width + x) * 4;
            outputData[index] = rValues[Math.floor(rValues.length / 2)];
            outputData[index + 1] = gValues[Math.floor(gValues.length / 2)];
            outputData[index + 2] = bValues[Math.floor(bValues.length / 2)];
            outputData[index + 3] = aValues[Math.floor(aValues.length / 2)];
        }
    }
    imgData.data.set(outputData);
    return imgData;
}

function bilateralFilter(imgData, width, height, sigma) {
    if (sigma <= 0) return imgData;
    const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
    const outputData = new Uint8ClampedArray(imgData.data);
    const spatialKernel = [];
    let spatialSum = 0;

    for (let i = -Math.floor(kernelSize / 2); i <= Math.floor(kernelSize / 2); i++) {
        const value = Math.exp(-(i * i) / (2 * sigma * sigma));
        spatialKernel.push(value);
        spatialSum += value;
    }
    for (let i = 0; i < spatialKernel.length; i++) spatialKernel[i] /= spatialSum;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rSum = 0, gSum = 0, bSum = 0, aSum = 0, weightSum = 0;
            const centerIndex = (y * width + x) * 4;
            const centerR = imgData.data[centerIndex];
            const centerG = imgData.data[centerIndex + 1];
            const centerB = imgData.data[centerIndex + 2];
            const centerA = imgData.data[centerIndex + 3];

            for (let ky = -Math.floor(kernelSize / 2); ky <= Math.floor(kernelSize / 2); ky++) {
                for (let kx = -Math.floor(kernelSize / 2); kx <= Math.floor(kernelSize / 2); kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const index = (ny * width + nx) * 4;
                        const r = imgData.data[index];
                        const g = imgData.data[index + 1];
                        const b = imgData.data[index + 2];
                        const a = imgData.data[index + 3];

                        const colorDiff = Math.sqrt(
                            (r - centerR) ** 2 +
                            (g - centerG) ** 2 +
                            (b - centerB) ** 2
                        );
                        const colorWeight = Math.exp(-(colorDiff * colorDiff) / (2 * sigma * sigma));
                        const spatialWeight = spatialKernel[kx + Math.floor(kernelSize / 2)] * spatialKernel[ky + Math.floor(kernelSize / 2)];
                        const weight = colorWeight * spatialWeight;

                        rSum += r * weight;
                        gSum += g * weight;
                        bSum += b * weight;
                        aSum += a * weight;
                        weightSum += weight;
                    }
                }
            }

            const index = (y * width + x) * 4;
            outputData[index] = rSum / weightSum;
            outputData[index + 1] = gSum / weightSum;
            outputData[index + 2] = bSum / weightSum;
            outputData[index + 3] = aSum / weightSum;
        }
    }
    imgData.data.set(outputData);
    return imgData;
}

function anisotropicFilter(imgData, width, height, strength) {
    if (strength <= 0) return imgData;
    const outputData = new Uint8ClampedArray(imgData.data);
    const iterations = Math.floor(strength);

    for (let iter = 0; iter < iterations; iter++) {
        const tempData = new Uint8ClampedArray(outputData);
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const index = (y * width + x) * 4;
                let rGradX = 0, rGradY = 0, gGradX = 0, gGradY = 0, bGradX = 0, bGradY = 0;

                for (let c = 0; c < 3; c++) {
                    const idx = index + c;
                    rGradX += (tempData[idx + 4] - tempData[idx - 4]) * 0.5;
                    rGradY += (tempData[idx + width * 4] - tempData[idx - width * 4]) * 0.5;
                    gGradX += (tempData[idx + 4 + 1] - tempData[idx - 4 + 1]) * 0.5;
                    gGradY += (tempData[idx + width * 4 + 1] - tempData[idx - width * 4 + 1]) * 0.5;
                    bGradX += (tempData[idx + 4 + 2] - tempData[idx - 4 + 2]) * 0.5;
                    bGradY += (tempData[idx + width * 4 + 2] - tempData[idx - width * 4 + 2]) * 0.5;
                }

                const gradMag = Math.sqrt(rGradX ** 2 + rGradY ** 2 + gGradX ** 2 + gGradY ** 2 + bGradX ** 2 + bGradY ** 2) || 1;
                const diffusion = Math.exp(-gradMag / strength);

                for (let c = 0; c < 4; c++) {
                    const idx = index + c;
                    const laplacian = (
                        tempData[idx - 4] +
                        tempData[idx + 4] +
                        tempData[idx - width * 4] +
                        tempData[idx + width * 4] -
                        4 * tempData[idx]
                    ) * diffusion;
                    outputData[idx] = tempData[idx] + 0.25 * laplacian;
                }
            }
        }
    }
    imgData.data.set(outputData);
    return imgData;
}

function nonlocalMeansFilter(imgData, width, height, strength) {
    if (strength <= 0) return imgData;
    const outputData = new Uint8ClampedArray(imgData.data);
    const patchSize = 3;
    const searchWindow = 7;
    const h = strength * 10;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rSum = 0, gSum = 0, bSum = 0, aSum = 0, weightSum = 0;
            const centerIndex = (y * width + x) * 4;

            for (let ky = -searchWindow; ky <= searchWindow; ky++) {
                for (let kx = -searchWindow; kx <= searchWindow; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        let patchDiff = 0;
                        for (let py = -patchSize; py <= patchSize; py++) {
                            for (let px = -patchSize; px <= patchSize; px++) {
                                const cx = x + px;
                                const cy = y + py;
                                const nx2 = nx + px;
                                const ny2 = ny + py;
                                if (cx >= 0 && cx < width && cy >= 0 && cy < height && nx2 >= 0 && nx2 < width && ny2 >= 0 && ny2 < height) {
                                    const idx1 = (cy * width + cx) * 4;
                                    const idx2 = (ny2 * width + nx2) * 4;
                                    for (let c = 0; c < 3; c++) {
                                        patchDiff += (imgData.data[idx1 + c] - imgData.data[idx2 + c]) ** 2;
                                    }
                                }
                            }
                        }
                        const weight = Math.exp(-patchDiff / (h * h));
                        const idx = (ny * width + nx) * 4;
                        rSum += imgData.data[idx] * weight;
                        gSum += imgData.data[idx + 1] * weight;
                        bSum += imgData.data[idx + 2] * weight;
                        aSum += imgData.data[idx + 3] * weight;
                        weightSum += weight;
                    }
                }
            }

            const index = (y * width + x) * 4;
            outputData[index] = rSum / weightSum;
            outputData[index + 1] = gSum / weightSum;
            outputData[index + 2] = bSum / weightSum;
            outputData[index + 3] = aSum / weightSum;
        }
    }
    imgData.data.set(outputData);
    return imgData;
}

function meanFilter(imgData, width, height, radius) {
    if (radius <= 0) return imgData;
    const kernelSize = radius * 2 + 1;
    const outputData = new Uint8ClampedArray(imgData.data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;
            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const index = (ny * width + nx) * 4;
                        rSum += imgData.data[index];
                        gSum += imgData.data[index + 1];
                        bSum += imgData.data[index + 2];
                        aSum += imgData.data[index + 3];
                        count++;
                    }
                }
            }
            const index = (y * width + x) * 4;
            outputData[index] = rSum / count;
            outputData[index + 1] = gSum / count;
            outputData[index + 2] = bSum / count;
            outputData[index + 3] = aSum / count;
        }
    }
    imgData.data.set(outputData);
    return imgData;
}




self.onmessage = function (e) {
    try {
        const { width, height, layer, spots, colorPalette, maskData, imgData } = e.data;
        const { noiseType, noiseLevel, noiseScale, smoothType, smoothValue, colorNoise, alphaLevel } = layer;

        let noiseValues;
        let processedData = imgData ? new ImageData(new Uint8ClampedArray(imgData.data), width, height) : new ImageData(width, height);
        const spotArray = [];

        // Генерация пятен
        for (let i = 0; i < spots; i++) {
            spotArray.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 200 + 100
            });
        }

        // Генерация шума
        if (noiseType === 'perlin') {
            noiseValues = perlinNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'simplex') {
            noiseValues = simplexNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'fractal') {
            noiseValues = fractalNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'cellular') {
            noiseValues = cellularNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'worley') {
            noiseValues = worleyNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'erosion') {
            noiseValues = erosionNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'flow') {
            noiseValues = flowNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'organic') {
            noiseValues = organicNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'voronoi') {
            noiseValues = voronoiNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'cloud') {
            noiseValues = cloudNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'lava') {
            noiseValues = lavaNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'fabric') {
            noiseValues = fabricNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'billow') {
            noiseValues = billowNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'ridged') {
            noiseValues = ridgedNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'white') {
            noiseValues = whiteNoise(width, height, noiseLevel, colorNoise);
        } else if (noiseType === 'pink') {
            noiseValues = pinkNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'brown') {
            noiseValues = brownNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'midpointDisplacement') {
            noiseValues = midpointDisplacementNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'voronoiRidged') {
            noiseValues = voronoiRidgedNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'wavelet') {
            noiseValues = waveletNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'blue') {
            noiseValues = blueNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'multilayerPerlin') {
            noiseValues = multilayerPerlinNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'diamondSquare') {
            noiseValues = diamondSquareNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'ridgedMultifractal') {
            noiseValues = ridgedMultifractalNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'saltPepper') {
            noiseValues = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                        const rand = Math.random();
                        noiseValues[(y * width + x) * (colorNoise ? 3 : 1) + c] = rand < 0.05 * noiseLevel ? 255 : rand > 1 - 0.05 * noiseLevel ? 0 : 128;
                    }
                }
            }
        } else if (noiseType === 'gaussian') {
            noiseValues = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                        const mean = 128;
                        const std = 50 * noiseLevel;
                        const value = mean + std * Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
                        noiseValues[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.min(255, Math.max(0, value));
                    }
                }
            }
        } else if (noiseType === 'gradient') {
            noiseValues = gradientNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'sparkle') {
            noiseValues = sparkleNoise(width, height, noiseScale, noiseLevel, colorNoise);
        } else if (noiseType === 'warp') {
            if (!imgData) {
                throw new Error('Для warp-шума требуется входное изображение');
            }
            const { warpX, warpY } = warpMap(width, height, noiseScale, noiseLevel, colorNoise);
            processedData = applyWarp(imgData, warpX, warpY, width, height);
            noiseValues = processedData.data;
        } else {
            noiseValues = new Uint8ClampedArray(width * height * (colorNoise ? 3 : 1));
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    for (let c = 0; c < (colorNoise ? 3 : 1); c++) {
                        noiseValues[(y * width + x) * (colorNoise ? 3 : 1) + c] = Math.random() * 255 * noiseLevel;
                    }
                }
            }
        }

        // Применяем маску, если она передана
        if (noiseValues && maskData && noiseType !== 'warp') {
            for (let i = 0; i < noiseValues.length; i++) {
                noiseValues[i] *= maskData[Math.floor(i / (colorNoise ? 3 : 1))];
            }
        }

        // Применяем палитру и пятна (кроме warp)
        if (noiseType !== 'warp') {
            const paletteRGB = colorPalette ? [
                parseInt(colorPalette.slice(1, 3), 16),
                parseInt(colorPalette.slice(3, 5), 16),
                parseInt(colorPalette.slice(5, 7), 16)
            ] : [0, 0, 0];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    let alphaMask = 1;

                    for (let spot of spotArray) {
                        const dx = x - spot.x;
                        const dy = y - spot.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const influence = Math.max(0, 1 - dist / spot.r);
                        alphaMask *= (1 - 0.8 * influence);
                    }

                    const nIndex = (y * width + x) * (colorNoise ? 3 : 1);
                    let r = noiseValues[nIndex];
                    let g = colorNoise ? noiseValues[nIndex + 1] : r;
                    let b = colorNoise ? noiseValues[nIndex + 2] : r;

                    r *= paletteRGB[0] / 255;
                    g *= paletteRGB[1] / 255;
                    b *= paletteRGB[2] / 255;

                    const alpha = Math.floor(255 * alphaMask * alphaLevel);

                    processedData.data[index] = r;
                    processedData.data[index + 1] = g;
                    processedData.data[index + 2] = b;
                    processedData.data[index + 3] = alpha;
                }
            }
        }

        // Применяем сглаживание
        if (smoothType === 'gaussian' && smoothValue > 0) {
            processedData = gaussianBlur(processedData, width, height, smoothValue);
        } else if (smoothType === 'median' && smoothValue > 0) {
            processedData = medianFilter(processedData, width, height, Math.round(smoothValue));
        } else if (smoothType === 'bilateral' && smoothValue > 0) {
            processedData = bilateralFilter(processedData, width, height, smoothValue);
        } else if (smoothType === 'anisotropic' && smoothValue > 0) {
            processedData = anisotropicFilter(processedData, width, height, smoothValue);
        } else if (smoothType === 'nonlocal' && smoothValue > 0) {
            processedData = nonlocalMeansFilter(processedData, width, height, smoothValue);
        } else if (smoothType === 'mean' && smoothValue > 0) {
            processedData = meanFilter(processedData, width, height, Math.round(smoothValue));
        }

        // Создаём копию данных для возврата
        const returnData = new ImageData(new Uint8ClampedArray(processedData.data), width, height);
        self.postMessage({ imgData: returnData }, [returnData.data.buffer]);
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
