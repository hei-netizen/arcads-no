#!/usr/bin/env python3
"""Genererer llms-full.txt: all synlig tekst fra alle indekserbare sider, i sitemap-rekkefølge.
Kjøres i deploy-workflowen (før minifisering) og kan kjøres lokalt: python3 scripts/build_llms_full.py"""
import re,html,os,sys
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sm=open(os.path.join(root,'sitemap.xml')).read()
urls=re.findall(r'<loc>([^<]+)</loc>',sm)
out=["# Arcads — full tekst av arcads.no",
     "",
     "> Arcads ANS, norsk performance marketing-byrå (Skien, kunder i hele Norge). Google Ads, Meta Ads, UGC og kreativ produksjon. 100 % resultatbasert. Ikke tilknyttet Arcads.ai. Kortversjon: https://arcads.no/llms.txt",
     ""]
for u in urls:
    path=u.replace('https://arcads.no','').strip('/')
    f=os.path.join(root,path,'index.html') if path else os.path.join(root,'index.html')
    if not os.path.exists(f): continue
    h=open(f).read()
    if 'noindex' in h: continue
    title=re.search(r'<title>(.*?)</title>',h,re.S); title=html.unescape(title.group(1).strip()) if title else path
    body=re.sub(r'<(script|style|nav|header|footer|svg)[^>]*>.*?</\1>','',h,flags=re.S)
    body=re.sub(r'<!--.*?-->','',body,flags=re.S)
    body=re.sub(r'<(h[1-6])[^>]*>',lambda m:'\n'+'#'*int(m.group(1)[1])+' ',body)
    body=re.sub(r'</(p|div|li|tr|h[1-6]|section|blockquote)>','\n',body)
    body=re.sub(r'<(td|th)[^>]*>',' | ',body)
    body=re.sub(r'<li[^>]*>','- ',body)
    body=re.sub(r'</(span|a|b|i|strong|em|button)>',r' ',body)
    body=re.sub(r'<[^>]+>','',body)
    body=html.unescape(body)
    body=re.sub(r'[ \t]+',' ',body)
    body='\n'.join(l.rstrip() for l in body.split('\n') if l.strip() not in ('','-'))
    body=re.sub(r'\n{3,}','\n\n',body).strip()
    out+=[f"---\n\n# {title}\nURL: {u}\n",body,""]
open(os.path.join(root,'llms-full.txt'),'w').write('\n'.join(out))
print(f"llms-full.txt: {len(urls)} sider, {sum(len(x) for x in out)//1000} kB")
