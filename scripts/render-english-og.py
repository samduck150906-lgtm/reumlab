"""Render the original English social card. Pillow is a local design tool, not a build dependency."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parent.parent
fonts=[Path('C:/Windows/Fonts'),Path('/usr/share/fonts/truetype/dejavu')]
def font(size,bold=False):
    for folder in fonts:
        for name in (['arialbd.ttf','DejaVuSans-Bold.ttf'] if bold else ['arial.ttf','DejaVuSans.ttf']):
            if (folder/name).exists():return ImageFont.truetype(str(folder/name),size)
    raise RuntimeError('Install Arial or DejaVu Sans to render the social card')
im=Image.new('RGB',(1200,630),'#f4f7fd');d=ImageDraw.Draw(im)
d.rectangle((0,0,1200,100),fill='#1749ba')
d.text((76,27),'REUMLAB',font=font(37,True),fill='white')
d.text((76,150),'Software development',font=font(72,True),fill='#12203a')
d.text((76,237),'in South Korea.',font=font(72,True),fill='#12203a')
d.text((80,365),'Apps · Web · AI · Business systems',font=font(33),fill='#425775')
d.line((80,460,1118,460),fill='#c9d7ed',width=2)
d.text((80,514),'reumlab.com/en/',font=font(30,True),fill='#1749ba')
im.save(root/'public/english-og.png',optimize=True)
