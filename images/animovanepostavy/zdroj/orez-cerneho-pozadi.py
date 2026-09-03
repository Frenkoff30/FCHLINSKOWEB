import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

CROSS = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], bool)
ST8 = np.ones((3, 3), bool)


def cutout_black(path, out_path, erode=2, unmul=1.0, min_gap=300, pad=4):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    ai = a.astype(np.int16)
    black = (ai.max(2) <= 12) & (ai.max(2) - ai.min(2) <= 8)

    lab, n = ndimage.label(black, structure=CROSS)
    b = np.concatenate([lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1]])
    out = set(int(v) for v in np.unique(b) if v)
    bg = np.isin(lab, list(out))
    areas = ndimage.sum(np.ones(lab.shape, np.float32), lab, index=np.arange(1, n + 1))
    gaps = [i + 1 for i in range(n) if (i + 1) not in out and areas[i] >= min_gap]
    if gaps:
        bg |= np.isin(lab, gaps)

    keep = ~bg
    kl, kn = ndimage.label(keep, structure=ST8)
    if kn:
        ka = ndimage.sum(np.ones(kl.shape, np.float32), kl, index=np.arange(1, kn + 1))
        small = [i + 1 for i in range(kn) if ka[i] < 250]
        if small:
            keep &= ~np.isin(kl, small)
    keep = ndimage.binary_closing(keep, structure=ST8)

    core = ndimage.binary_erosion(keep, structure=ST8, iterations=erode)
    alpha = ndimage.gaussian_filter(core.astype(np.float32), 0.7)
    alpha = np.clip((alpha - 0.25) / 0.55, 0, 1)

    rgb = a
    if unmul > 1.0:
        s = np.clip(1.0 / np.maximum(alpha, 1e-3), 1.0, unmul)[..., None]
        rgb = np.clip(a * s, 0, 255)

    img = Image.fromarray(np.dstack([rgb, alpha * 255.0]).astype(np.uint8), "RGBA")
    bb = Image.fromarray((alpha > 0.04).astype(np.uint8) * 255).getbbox()
    if bb:
        x0, y0, x1, y1 = bb
        img = img.crop((max(0, x0 - pad), max(0, y0 - pad),
                        min(img.width, x1 + pad), min(img.height, y1 + pad)))
    img.save(out_path)
    return img


if __name__ == "__main__":
    src = "C:/Users/svecj/OneDrive/Plocha/PRACE/FCHLINSKOWEB/images/animovanepostavy"
    os.makedirs("black", exist_ok=True)
    for tag, kw in (("e2", dict(erode=2, unmul=1.0)),
                    ("e1u", dict(erode=1, unmul=2.2))):
        for inp, nm in (("holka lepsi.jpg", "holka"), ("oba.jpg", "oba")):
            im = cutout_black(os.path.join(src, inp), "black/%s_%s.png" % (nm, tag), **kw)
            c = Image.new("RGBA", im.size, (255, 255, 255, 255))
            c.alpha_composite(im)
            c.convert("RGB").save("black/w_%s_%s.jpg" % (nm, tag), quality=92)
        print(tag, "ok")
