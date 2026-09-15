#!/usr/bin/env python3
"""
Pretendard 가변 폰트에서 "이 사이트가 실제로 쓰는 글자" 서브셋을 만든다.
빌드 체인에 넣지 않는다 — 콘텐츠가 크게 늘었을 때 사람이 다시 돌린다.

    python3 -m pip install fonttools brotli
    npm run build                          # out/ 이 있어야 사용 글자를 셀 수 있다
    python3 scripts/build-font-subsets.py

왜 필요한가
  public/fonts/PretendardVariable-1.3.9.woff2 는 2.0MB 이고, 이 한 파일이 사이트
  전 페이지의 LCP 를 지배한다(모바일 스로틀링 ≈1.6Mbps 기준 약 10초).
  그런데 out/ 전체(2,700여 파일)의 화면 텍스트를 집계하면 실제로 쓰이는 글자는
  1,038자뿐이다(한글 913자, 한자 0자).

어떻게 안전하게 줄이나 — 글자 손실 0
  @font-face 를 두 개 선언하고, **둘 다 unicode-range 를 명시**한다.
    1) 서브셋 ~222KB : 실제 사용 글자 + 기본 라틴/문장부호
    2) 원본 2.0MB    : 폰트 cmap 에서 서브셋을 뺀 나머지(희귀 한글·한자 등)
  두 범위의 합집합 = 원본 cmap 과 정확히 같으므로 어떤 글자도 폴백으로 떨어지지 않는다.

  원본 쪽 range 를 생략하면 안 된다(처음에 그렇게 만들었다가 실패했다).
  range 없는 face 는 '모든 문자'의 후보라, 페이지에 이모지(📞 ✕ 💬)처럼
  **폰트에 아예 없는 글자**가 하나만 있어도 브라우저가 2.0MB 를 받아 확인한 뒤
  폴백한다. 실제로 홈·서비스 페이지 전부에서 2.0MB 가 그대로 내려왔다.

주의
  서브셋 범위는 생성 시점의 콘텐츠 기준이다. 새 글자가 들어간 페이지는 원본을
  한 번 더 받을 뿐 화면은 정상이다. 콘텐츠가 크게 바뀌면 이 스크립트를 다시 돌리고
  scripts/verify-font-subset.mjs 로 CSS 의 unicode-range 와 실제 파일을 대조한다.
"""
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/fonts/PretendardVariable-1.3.9.woff2"
DEST = ROOT / "public/fonts/Pretendard-1.3.9-subset.woff2"
META = ROOT / "public/fonts/subset.json"
OUT_DIR = ROOT / "out"

# 콘텐츠와 무관하게 항상 넣는 최소 집합 — 새 페이지가 곧바로 서브셋에 걸리게 한다.
ALWAYS = (
    set(range(0x20, 0x7F))        # ASCII
    | set(range(0xA0, 0x100))     # Latin-1 supplement
    | set(range(0x2000, 0x2070))  # 일반 문장부호(– — ' " … · 등)
    | set(range(0x3000, 0x3040))  # CJK 문장부호(、。「」 등)
    | set(range(0xFF01, 0xFF61))  # 전각 영숫자·부호
    | {0x20A9, 0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212, 0x2713, 0x2714, 0xFFFD}
)

SKIP_TAGS = re.compile(r"<(script|style)\b[^>]*>.*?</\1>", re.S | re.I)
TAGS = re.compile(r"<[^>]+>")
# CSS 의사 요소 문자(content: '✓') 도 화면에 그려진다 — 본문 텍스트만 세면 빠진다.
CSS_CONTENT = re.compile(r"content\s*:\s*(['\"])(.*?)\1", re.S)
# 화면에 글자로 나오는 속성값. 태그를 걷어내는 방식이라 이걸 따로 안 세면 빠진다.
# (실제로 textarea placeholder 의 '옴' 한 글자가 빠져 2.0MB 원본을 다시 부르게 만들었다.)
VISIBLE_ATTRS = re.compile(
    r"\b(?:placeholder|alt|title|aria-label|aria-description|label|value)\s*=\s*\"([^\"]*)\"")


def used_codepoints() -> set[int]:
    """out/ 의 화면 텍스트 + CSS content 값에 등장한 코드포인트."""
    if not OUT_DIR.exists():
        sys.exit("out/ 이 없습니다. 먼저 npm run build 를 실행하세요.")
    seen: set[int] = set()
    files = 0
    for root, _, names in os.walk(OUT_DIR):
        for name in names:
            path = Path(root, name)
            if name.endswith((".html", ".txt", ".xml")):
                files += 1
                raw = path.read_text(encoding="utf-8", errors="ignore")
                text = html.unescape(TAGS.sub(" ", SKIP_TAGS.sub(" ", raw)))
                seen.update(ord(ch) for ch in text if ord(ch) > 0x20)
                for attr in VISIBLE_ATTRS.findall(raw):
                    seen.update(ord(ch) for ch in html.unescape(attr) if ord(ch) > 0x20)
                for _, value in CSS_CONTENT.findall(raw):
                    seen.update(ord(ch) for ch in _unescape_css(value) if ord(ch) > 0x20)
            elif name.endswith(".css"):
                files += 1
                for _, value in CSS_CONTENT.findall(path.read_text(encoding="utf-8", errors="ignore")):
                    seen.update(ord(ch) for ch in _unescape_css(value) if ord(ch) > 0x20)
    print(f"  검사한 산출물 {files:,}개")
    return seen


def _unescape_css(value: str) -> str:
    """CSS 의 \2713 형태 유니코드 이스케이프를 실제 문자로 바꾼다."""
    return re.sub(r"\\([0-9a-fA-F]{1,6})\s?", lambda m: chr(int(m.group(1), 16)), value)


def to_ranges(codes: set[int]) -> str:
    out, s = [], sorted(codes)
    i = 0
    while i < len(s):
        j = i
        while j + 1 < len(s) and s[j + 1] == s[j] + 1:
            j += 1
        out.append(f"U+{s[i]:04X}" if i == j else f"U+{s[i]:04X}-{s[j]:04X}")
        i = j + 1
    return ", ".join(out)


def main() -> None:
    full = set(TTFont(SRC).getBestCmap().keys())
    used = used_codepoints()
    subset = (used | ALWAYS) & full
    print(f"  폰트 cmap {len(full):,}자 · 화면 사용 {len(used):,}자 · 서브셋 {len(subset):,}자")

    listfile = ROOT / "public/fonts/.subset-codes.txt"
    listfile.write_text("\n".join(f"{c:04X}" for c in sorted(subset)), encoding="utf-8")
    subprocess.run(
        [sys.executable, "-m", "fontTools.subset", str(SRC),
         f"--unicodes-file={listfile}", f"--output-file={DEST}",
         "--flavor=woff2", "--layout-features=*", "--name-IDs=*",
         "--notdef-outline", "--recalc-bounds"],
        check=True, capture_output=True)
    listfile.unlink()

    # 가변 축이 살아 있는지 확인 — 죽었다면 굵기가 전부 400 으로 렌더된다.
    sub = TTFont(DEST)
    axes = [(a.axisTag, a.minValue, a.maxValue) for a in sub["fvar"].axes]
    assert axes, "서브셋에서 가변 축(fvar)이 사라졌습니다"
    assert set(sub.getBestCmap().keys()) == subset, "서브셋 cmap 이 요청한 집합과 다릅니다"

    # 원본 face 의 범위는 "폰트 cmap 전체"다. 서브셋을 뺀 차집합이 아니다.
    #   · 서브셋이 나중에 선언되므로 겹치는 글자는 서브셋이 이긴다(중복이 무해).
    #   · 차집합은 서브셋 음절 900여 개가 뚫어 놓은 구멍 때문에 범위가 10.9KB 로 불어난다.
    #     반면 cmap 전체는 거의 연속이라 187구간 2.0KB 로 끝난다.
    #   · 폰트에 아예 없는 문자(📞 ✕ 💬)는 두 범위 어디에도 없어 다운로드를 유발하지 않는다.
    META.write_text(json.dumps({
        "source": SRC.name, "source_bytes": SRC.stat().st_size,
        "subset": DEST.name, "subset_bytes": DEST.stat().st_size,
        "glyphs": len(subset), "font_glyphs": len(full), "axes": axes,
        "unicode_range": to_ranges(subset),
        "rest_unicode_range": to_ranges(full),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    kb = lambda n: f"{n/1024:,.0f}KB"
    print(f"  원본   {kb(SRC.stat().st_size)}  →  서브셋 {kb(DEST.stat().st_size)}"
          f"  ({DEST.stat().st_size/SRC.stat().st_size:.0%})")
    print(f"  가변 축 {axes}")
    print(f"  unicode-range 는 {META.relative_to(ROOT)} 에 있습니다.")


if __name__ == "__main__":
    main()
