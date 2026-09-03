"""Odstraneni sachovnicoveho pozadi z JPG postavicek FC Hlinsko.

Klicovani NENI podle svetlosti (to vyzralo vsechny bile plochy - belmo,
pruhy dresu, ponozky, mic). Postup:

  1) pixel je "barva sachovnice" = neutralni odstin, bud bily nebo
     ta konkretni teple seda (~192,188,185)
  2) pozadi = takove pixely spojite s okrajem obrazku (flood fill),
     takze vnitrni bile plochy zustanou netknute
  3) uzavrene mezery (podpazi, mezi nohama) se odstrani jen kdyz opravdu
     obsahuji sachovnici - testuje se autokorelaci: pri posunu o jednu
     bunku (~16 px) se parita sachovnice prevrati (korelace ~ -1),
     zatimco stinovani latky se nechova nijak periodicky
"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

CROSS = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], bool)
ST8 = np.ones((3, 3), bool)


def checker_masks(a):
    sat = a.max(2) - a.min(2)
    mn = a.min(2)
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    neutral = sat <= 30
    white = neutral & (mn >= 228)
    gray = neutral & (lum >= 160) & (lum <= 218)
    return white, gray


def flip_score(sig):
    """Nejnizsi korelace pri posunu o 14-19 px. Sachovnice ~ -0.9."""
    best = 1.0
    for lag in range(14, 20):
        for ax in (0, 1):
            A = np.roll(sig, lag, axis=ax)
            B = sig
            if ax == 0:
                A[:lag] = 0
            else:
                A[:, :lag] = 0
            m = (A != 0) & (B != 0)
            if m.sum() < 150:
                continue
            best = min(best, float((A[m] * B[m]).mean()))
    return best


def cutout(path, out_path, pad=4, flip_thr=-0.75, min_area=400):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    white, gray = checker_masks(a)
    checker = white | gray

    lab, n = ndimage.label(checker, structure=CROSS)
    border = np.concatenate([lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1]])
    outside = set(int(v) for v in np.unique(border) if v)
    bg = np.isin(lab, list(outside)) if outside else np.zeros(checker.shape, bool)

    # uzavrene mezery se skutecnou sachovnici
    objs = ndimage.find_objects(lab)
    extra = []
    for i in range(n):
        lid = i + 1
        if lid in outside:
            continue
        sl = objs[i]
        m = lab[sl] == lid
        if m.sum() < min_area:
            continue
        sig = np.zeros(m.shape, np.float32)
        sig[gray[sl] & m] = 1.0
        sig[white[sl] & m] = -1.0
        if flip_score(sig) < flip_thr:
            extra.append(lid)
    if extra:
        bg |= np.isin(lab, extra)

    keep = ~bg

    # drobna smitka pryc
    kl, kn = ndimage.label(keep, structure=ST8)
    if kn:
        ka = ndimage.sum(np.ones(kl.shape, np.float32), kl,
                         index=np.arange(1, kn + 1))
        small = [i + 1 for i in range(kn) if ka[i] < 250]
        if small:
            keep &= ~np.isin(kl, small)
    keep = ndimage.binary_closing(keep, structure=ST8)

    # svetly lem pryc + mekka hrana
    core = ndimage.binary_erosion(keep, structure=ST8)
    alpha = ndimage.gaussian_filter(core.astype(np.float32), 0.7)
    alpha = np.clip((alpha - 0.25) / 0.55, 0, 1)

    out = np.dstack([np.asarray(im).astype(np.float32),
                     alpha * 255.0]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")

    bbox = Image.fromarray((alpha > 0.04).astype(np.uint8) * 255).getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        img = img.crop((max(0, x0 - pad), max(0, y0 - pad),
                        min(img.width, x1 + pad), min(img.height, y1 + pad)))
    img.save(out_path, optimize=True)
    print(f"  {os.path.basename(out_path):10s} {img.width}x{img.height}  "
          f"({len(extra)} uzavrenych mezer)")
    return img


if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    for nm in ("kluk", "holka", "oba"):
        cutout(os.path.join(src, nm + ".jpg"), os.path.join(dst, nm + ".png"))
