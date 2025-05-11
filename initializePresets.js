[
    {
      "name": "Соль-перец + Искры",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ffffff",
      "copies": 5,
      "layers": [
        {
          "noiseType": "saltPepper",
          "weight": 0.6,
          "noiseLevel": 1,
          "spots": 20,
          "colorNoise": false,
          "alphaLevel": 1,
          "smoothType": "none",
          "smoothValue": 0
        },
        {
          "noiseType": "sparkle",
          "weight": 0.4,
          "noiseLevel": 1,
          "noiseScale": 10,
          "spots": 15,
          "colorNoise": true,
          "alphaLevel": 1,
          "smoothType": "none",
          "smoothValue": 0
        }
      ]
    },
    {
      "name": "Цветной белый шум + Градиент",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ff0000",
      "copies": 5,
      "layers": [
        {
          "noiseType": "white",
          "weight": 0.7,
          "noiseLevel": 1,
          "spots": 0,
          "colorNoise": true,
          "alphaLevel": 1,
          "smoothType": "none",
          "smoothValue": 0
        },
        {
          "noiseType": "gradient",
          "weight": 0.3,
          "noiseLevel": 1,
          "noiseScale": 5,
          "spots": 0,
          "colorNoise": true,
          "alphaLevel": 1,
          "smoothType": "none",
          "smoothValue": 0
        }
      ]
    },
    {
      "name": "Многослойный хаос",
      "width": 512,
      "height": 1024,
      "colorPalette": "#00ffff",
      "copies": 5,
      "layers": [
        {
          "noiseType": "saltPepper",
          "weight": 0.4,
          "noiseLevel": 1,
          "spots": 20,
          "colorNoise": false,
          "alphaLevel": 1,
          "smoothType": "none",
          "smoothValue": 0
        },
        {
          "noiseType": "white",
          "weight": 0.3,
          "noiseLevel": 1,
          "spots": 0,
          "colorNoise": true,
          "alphaLevel": 1,
          "smoothType": "none",
          "smoothValue": 0
        },
        {
          "noiseType": "sparkle",
          "weight": 0.2,
          "noiseLevel": 1,
          "noiseScale": 8,
          "spots": 10,
          "colorNoise": true,
          "alphaLevel": 1,
          "smoothType": "none",
          "smoothValue": 0
        },
        {
          "noiseType": "gaussian",
          "weight": 0.1,
          "noiseLevel": 1,
          "noiseScale": 10,
          "spots": 0,
          "colorNoise": true,
          "alphaLevel": 0.9,
          "smoothType": "none",
          "smoothValue": 0
        }
      ]
    },
    {
      "name": "Хаотичный шторм",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ff0000",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "impulse",
          "weight": 0.9,
          "noiseLevel": 1.0,
          "noiseScale": 5,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "turbulent",
          "weight": 0.7,
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "smoothType": "gaussian",
          "smoothValue": 0.5,
          "spots": 15,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Горный хаос",
      "width": 512,
      "height": 1024,
      "colorPalette": "#00ff00",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "ridgedMultifractal",
          "weight": 1.0,
          "noiseLevel": 1.0,
          "noiseScale": 8,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 25,
          "colorNoise": false,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "diamondSquare",
          "weight": 0.8,
          "noiseLevel": 0.9,
          "noiseScale": 15,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": false,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Полосатый вихрь",
      "width": 512,
      "height": 1024,
      "colorPalette": "#0000ff",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "stripe",
          "weight": 0.9,
          "noiseLevel": 1.0,
          "noiseScale": 10,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "multilayerPerlin",
          "weight": 0.7,
          "noiseLevel": 0.9,
          "noiseScale": 12,
          "smoothType": "gaussian",
          "smoothValue": 0.3,
          "spots": 15,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Соляной взрыв",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ffffff",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "saltPepper",
          "weight": 1.0,
          "noiseLevel": 1.0,
          "noiseScale": 5,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 30,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "turbulent",
          "weight": 0.8,
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Фрактальная буря",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ff00ff",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "fractal",
          "weight": 0.9,
          "noiseLevel": 1.0,
          "noiseScale": 8,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 25,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "ridgedMultifractal",
          "weight": 0.8,
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "smoothType": "gaussian",
          "smoothValue": 0.5,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Клеточная аномалия",
      "width": 512,
      "height": 1024,
      "colorPalette": "#00ffff",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "cellular",
          "weight": 1.0,
          "noiseLevel": 1.0,
          "noiseScale": 10,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 25,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "impulse",
          "weight": 0.7,
          "noiseLevel": 0.9,
          "noiseScale": 5,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Вороной разлом",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ffff00",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "voronoi",
          "weight": 0.9,
          "noiseLevel": 1.0,
          "noiseScale": 12,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": false,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "diamondSquare",
          "weight": 0.8,
          "noiseLevel": 0.9,
          "noiseScale": 15,
          "smoothType": "gaussian",
          "smoothValue": 0.3,
          "spots": 15,
          "colorNoise": false,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Белый ураган",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ffffff",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "white",
          "weight": 1.0,
          "noiseLevel": 1.0,
          "noiseScale": 5,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 30,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "turbulent",
          "weight": 0.8,
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Искры в пустыне",
      "width": 512,
      "height": 1024,
      "colorPalette": "#ffaa00",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "sparkle",
          "weight": 0.9,
          "noiseLevel": 1.0,
          "noiseScale": 8,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 25,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "multilayerPerlin",
          "weight": 0.7,
          "noiseLevel": 0.9,
          "noiseScale": 15,
          "smoothType": "gaussian",
          "smoothValue": 0.5,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Гауссов разрыв",
      "width": 512,
      "height": 1024,
      "colorPalette": "#aa00ff",
      "copies": 5,
      "layers": [
        {
          "id": 1,
          "noiseType": "gaussian",
          "weight": 1.0,
          "noiseLevel": 1.0,
          "noiseScale": 10,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 25,
          "colorNoise": true,
          "alphaLevel": 1.0
        },
        {
          "id": 2,
          "noiseType": "ridgedMultifractal",
          "weight": 0.8,
          "noiseLevel": 0.9,
          "noiseScale": 8,
          "smoothType": "none",
          "smoothValue": 0,
          "spots": 20,
          "colorNoise": true,
          "alphaLevel": 0.9
        }
      ]
    },
    {
      "name": "Хаотичный ландшафт",
      "layers": [
        {
          "noiseType": "midpointDisplacement",
          "noiseLevel": 0.9,
          "noiseScale": 15,
          "weight": 0.8,
          "alphaLevel": 1.0,
          "colorNoise": false,
          "spots": 30
        },
        {
          "noiseType": "voronoiRidged",
          "noiseLevel": 0.8,
          "noiseScale": 10,
          "weight": 0.7,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 20
        },
        {
          "noiseType": "impulse",
          "noiseLevel": 1.0,
          "noiseScale": 5,
          "weight": 0.6,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 40
        }
      ],
      "smoothValue": 0
    },
    {
      "name": "Турбулентная атмосфера",
      "layers": [
        {
          "noiseType": "cloud",
          "noiseLevel": 0.8,
          "noiseScale": 20,
          "weight": 0.7,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 25
        },
        {
          "noiseType": "turbulent",
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "weight": 0.8,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 30
        },
        {
          "noiseType": "wavelet",
          "noiseLevel": 0.7,
          "noiseScale": 5,
          "weight": 0.6,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 35
        }
      ],
      "smoothValue": 0.3
    },
    {
      "name": "Органический хаос",
      "layers": [
        {
          "noiseType": "organic",
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "weight": 0.8,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 30
        },
        {
          "noiseType": "flow",
          "noiseLevel": 0.8,
          "noiseScale": 15,
          "weight": 0.7,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 25
        },
        {
          "noiseType": "saltPepper",
          "noiseLevel": 1.0,
          "noiseScale": 5,
          "weight": 0.6,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 40
        }
      ],
      "smoothValue": 0
    },
    {
      "name": "Огненная буря",
      "layers": [
        {
          "noiseType": "lava",
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "weight": 0.8,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 30
        },
        {
          "noiseType": "ridgedMultifractal",
          "noiseLevel": 0.8,
          "noiseScale": 15,
          "weight": 0.7,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 25
        },
        {
          "noiseType": "sparkle",
          "noiseLevel": 0.7,
          "noiseScale": 5,
          "weight": 0.6,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 35
        }
      ],
      "smoothValue": 0.2
    },
    {
      "name": "Текстильный ландшафт",
      "layers": [
        {
          "noiseType": "fabric",
          "noiseLevel": 0.8,
          "noiseScale": 10,
          "weight": 0.7,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 25
        },
        {
          "noiseType": "erosion",
          "noiseLevel": 0.9,
          "noiseScale": 15,
          "weight": 0.8,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 30
        },
        {
          "noiseType": "stripe",
          "noiseLevel": 0.7,
          "noiseScale": 5,
          "weight": 0.6,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 40
        }
      ],
      "smoothValue": 0.3
    },
    {
      "name": "Геометрический коллапс",
      "layers": [
        {
          "noiseType": "voronoi",
          "noiseLevel": 0.8,
          "noiseScale": 20,
          "weight": 0.7,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 25
        },
        {
          "noiseType": "ridged",
          "noiseLevel": 0.9,
          "noiseScale": 10,
          "weight": 0.6,
          "alphaLevel": 0.8,
          "colorNoise": false,
          "spots": 20
        },
        {
          "noiseType": "saltPepper",
          "noiseLevel": 1.0,
          "noiseScale": 5,
          "weight": 0.9,
          "alphaLevel": 1.0,
          "colorNoise": false,
          "spots": 50
        }
      ],
      "smoothValue": 0.1
    },
    {
      "name": "Органическая лавина",
      "layers": [
        {
          "noiseType": "organic",
          "noiseLevel": 0.9,
          "noiseScale": 12,
          "weight": 0.9,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 30
        },
        {
          "noiseType": "impulse",
          "noiseLevel": 1.0,
          "noiseScale": 6,
          "weight": 0.7,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 40
        },
        {
          "noiseType": "gradient",
          "noiseLevel": 0.7,
          "noiseScale": 20,
          "weight": 0.5,
          "alphaLevel": 0.6,
          "colorNoise": false,
          "spots": 10
        }
      ],
      "smoothValue": 0.2
    },
    {
      "name": "Разрушенный ландшафт",
      "layers": [
        {
          "noiseType": "midpointDisplacement",
          "noiseLevel": 1.0,
          "noiseScale": 15,
          "weight": 0.8,
          "alphaLevel": 1.0,
          "colorNoise": false,
          "spots": 35
        },
        {
          "noiseType": "voronoiRidged",
          "noiseLevel": 0.9,
          "noiseScale": 8,
          "weight": 0.7,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 25
        },
        {
          "noiseType": "flow",
          "noiseLevel": 0.85,
          "noiseScale": 10,
          "weight": 0.6,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 20
        }
      ],
      "smoothValue": 0
    },
    {
      "name": "Шелковая ткань",
      "layers": [
        {
          "noiseType": "perlin",
          "noiseLevel": 0.7,
          "noiseScale": 25,
          "weight": 0.6,
          "alphaLevel": 0.9,
          "colorNoise": true,
          "spots": 10
        },
        {
          "noiseType": "flow",
          "noiseLevel": 0.85,
          "noiseScale": 12,
          "weight": 0.7,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 20
        },
        {
          "noiseType": "gradient",
          "noiseLevel": 0.6,
          "noiseScale": 30,
          "weight": 0.4,
          "alphaLevel": 0.7,
          "colorNoise": false,
          "spots": 15
        }
      ],
      "smoothValue": 0.4
    }
    , {
      "name": "Дымка и искры",
      "layers": [
        {
          "noiseType": "simplex",
          "noiseLevel": 0.9,
          "noiseScale": 18,
          "weight": 0.8,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 25
        },
        {
          "noiseType": "impulse",
          "noiseLevel": 1.0,
          "noiseScale": 4,
          "weight": 0.6,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 50
        },
        {
          "noiseType": "midpointDisplacement",
          "noiseLevel": 0.7,
          "noiseScale": 22,
          "weight": 0.5,
          "alphaLevel": 0.8,
          "colorNoise": false,
          "spots": 15
        }
      ],
      "smoothValue": 0.2
    }
    , {
      "name": "Вспышка деструкции",
      "layers": [
        {
          "noiseType": "ridged",
          "noiseLevel": 1.0,
          "noiseScale": 7,
          "weight": 0.9,
          "alphaLevel": 1.0,
          "colorNoise": true,
          "spots": 30
        },
        {
          "noiseType": "saltPepper",
          "noiseLevel": 1.0,
          "noiseScale": 3,
          "weight": 1.0,
          "alphaLevel": 1.0,
          "colorNoise": false,
          "spots": 80
        },
        {
          "noiseType": "flow",
          "noiseLevel": 0.8,
          "noiseScale": 12,
          "weight": 0.7,
          "alphaLevel": 0.8,
          "colorNoise": true,
          "spots": 25
        }
      ],
      "smoothValue": 0
    }
  ]
