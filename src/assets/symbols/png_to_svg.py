"""
Convert every .png in the symbols folder to .svg at 200x200.

Usage (Windows, from any terminal):
    pip install pillow
    python png_to_svg.py

Mode "embed" (default): wraps each PNG, fitted into a SIZE x SIZE square (no stretching), inside an SVG.
    Looks identical to the original. Not true vector paths.
Mode "trace": real vector paths using vtracer (pip install vtracer).
    Run:  python png_to_svg.py trace
"""
import base64, io, sys
from pathlib import Path
from PIL import Image

FOLDER = Path(r"C:\Users\rober\Downloads\html5-slot-machine-master\html5-slot-machine-master\src\assets\symbols")
SIZE = 200  # matches the attached reference image (200x200)
mode = sys.argv[1] if len(sys.argv) > 1 else "embed"

for png in sorted(FOLDER.glob("*.png")):
    svg_path = png.with_suffix(".svg")
    im = Image.open(png).convert("RGBA")
    # fit inside a SIZE x SIZE square without stretching; pad with transparency
    im.thumbnail((SIZE, SIZE), Image.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    canvas.paste(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2))
    im = canvas
    if mode == "trace":
        import vtracer
        tmp = png.with_name(png.stem + "_tmp200.png")
        im.save(tmp)
        vtracer.convert_image_to_svg_py(str(tmp), str(svg_path), colormode="color",
                                        mode="spline", filter_speckle=4, color_precision=6)
        tmp.unlink()
    else:
        buf = io.BytesIO(); im.save(buf, "PNG")
        b64 = base64.b64encode(buf.getvalue()).decode()
        svg_path.write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}">'
            f'<image width="{SIZE}" height="{SIZE}" xlink:href="data:image/png;base64,{b64}"/></svg>',
            encoding="utf-8")
    print("created", svg_path.name)
