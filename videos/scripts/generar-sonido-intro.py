"""Genera public/audio/efectos/intro.wav: melodía original para la intro (4 s).

Sincronizada con la animación de Intro.tsx:
  0.00 s  whoosh suave que sube (entra el logo)
  0.30 s  "boing" (rebote del logo)
  0.55 s  arpegio de campanitas (Do-Mi-Sol-Do)
  1.00 s  destellos (notas agudas al azar, en escala pentatónica)
  1.60 s  acorde "¡ta-dá!" (aparece el título del episodio)

Uso: python3 scripts/generar-sonido-intro.py
"""
import random
import wave

import numpy as np

SR = 44100
DUR = 4.0
n = int(SR * DUR)
t = np.arange(n) / SR
mix = np.zeros(n)
random.seed(7)
rng = np.random.default_rng(7)


def nota(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def campanita(inicio, freq, vol=0.3, decay=1.2):
    """Sonido tipo glockenspiel: parciales inarmónicos con caída exponencial."""
    i0 = int(inicio * SR)
    largo = min(n - i0, int(SR * 2.5))
    tt = np.arange(largo) / SR
    ataque = np.minimum(1, tt / 0.002)
    s = (np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 3 / decay)
         + 0.35 * np.sin(2 * np.pi * freq * 2.76 * tt) * np.exp(-tt * 9 / decay)
         + 0.12 * np.sin(2 * np.pi * freq * 5.40 * tt) * np.exp(-tt * 18 / decay))
    mix[i0:i0 + largo] += vol * ataque * s


# Whoosh: ruido filtrado (media móvil) con envolvente y un barrido suave.
largo = int(0.6 * SR)
tt = np.arange(largo) / SR
ruido = rng.standard_normal(largo)
# Paso de banda (700–6000 Hz) en el dominio de la frecuencia: sin graves ni siseo.
espectro = np.fft.rfft(ruido)
freqs = np.fft.rfftfreq(largo, 1 / SR)
espectro[(freqs < 700) | (freqs > 6000)] = 0
ruido = np.fft.irfft(espectro, largo)
ruido /= np.max(np.abs(ruido))
env = np.sin(np.pi * tt / 0.6) ** 2
barrido = np.sin(2 * np.pi * np.cumsum(300 + 900 * (tt / 0.6) ** 2) / SR)
mix[:largo] += 0.25 * env * ruido + 0.08 * env * barrido

# Boing: tono que baja con vibrato.
i0 = int(0.30 * SR)
largo = int(0.45 * SR)
tt = np.arange(largo) / SR
f = 520 * np.exp(-tt * 2.2) + 180 + 25 * np.sin(2 * np.pi * 14 * tt) * np.exp(-tt * 4)
mix[i0:i0 + largo] += 0.32 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6) * np.minimum(1, tt / 0.005)

# Arpegio Do-Mi-Sol-Do (C6 E6 G6 C7).
for j, m in enumerate([84, 88, 91, 96]):
    campanita(0.55 + j * 0.11, nota(m), vol=0.28, decay=0.9)

# Destellos: notas agudas pentatónicas al azar.
pentatonica = [96, 98, 100, 103, 105, 108]
for j in range(9):
    campanita(1.0 + j * 0.07 + random.uniform(0, 0.03), nota(random.choice(pentatonica)), vol=0.10, decay=0.5)

# "¡Ta-dá!": acorde de Do mayor en dos golpes.
for m in [72, 76, 79, 84]:
    campanita(1.45, nota(m), vol=0.16, decay=0.5)
for m in [72, 76, 79, 84, 88]:
    campanita(1.60, nota(m), vol=0.20, decay=2.2)

# Normalizar a -3 dBFS y desvanecer el final.
mix *= 10 ** (-3 / 20) / np.max(np.abs(mix))
mix *= np.minimum(1, (DUR - t) / 0.4)
pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2")
estereo = np.repeat(pcm[:, None], 2, axis=1)

with wave.open("public/audio/efectos/intro.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(estereo.tobytes())
print("Listo: public/audio/efectos/intro.wav")
