#!/usr/bin/env python3
"""Generazione fuori dal browser. Legge ELEVENLABS_API_KEY dall'ambiente, mai dal repository."""
import argparse,datetime,hashlib,json,os,pathlib,subprocess,sys,urllib.request,urllib.parse,urllib.error
ROOT=pathlib.Path(__file__).resolve().parent.parent
API='https://api.elevenlabs.io'

def api(path,payload=None):
 key=os.environ.get('ELEVENLABS_API_KEY')
 if not key:raise RuntimeError('Configura il segreto ELEVENLABS_API_KEY nell’ambiente. Non inserirlo nel codice o in chat.')
 data=None if payload is None else json.dumps(payload,ensure_ascii=False).encode()
 req=urllib.request.Request(API+path,data=data,headers={'xi-api-key':key,'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=90) as r:return r.read()
 except urllib.error.HTTPError as e:
  # Non stampare headers o corpi di errore potenzialmente sensibili.
  raise RuntimeError(f'ElevenLabs HTTP {e.code}. Verifica permessi, piano, voci e credito nel tuo account.') from None

def voices():
 data=json.loads(api('/v2/voices?language=ja&high_quality=true&page_size=100'))
 candidates=[]
 for v in data.get('voices',[]):
  category=v.get('category') or v.get('sharing',{}).get('category')
  professional=category=='professional' or v.get('sharing',{}).get('category')=='professional'
  langs=v.get('verified_languages') or []
  japanese=any(x.get('language') in ('ja','japanese','Japanese') for x in langs) or str((v.get('labels') or {}).get('language','')).lower() in ('ja','japanese')
  if professional and japanese:
   candidates.append({k:v.get(k) for k in ('voice_id','name','preview_url','description')}|{'category':'professional','language':'ja','gender':(v.get('labels') or {}).get('gender')})
 return sorted(candidates,key=lambda v:v['name'] or '')

def duration(path):
 p=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(path)],check=True,capture_output=True,text=True)
 return float(p.stdout.strip())

def main():
 a=argparse.ArgumentParser();a.add_argument('--list-voices',action='store_true');a.add_argument('--scene',default='sushi');a.add_argument('--max-characters',type=int,default=600);a.add_argument('--voice-staff');a.add_argument('--voice-learner');args=a.parse_args()
 candidates=voices()
 out=ROOT/'risorse/audio';out.mkdir(parents=True,exist_ok=True)
 (out/'voice-candidates.json').write_text(json.dumps({'provider':'ElevenLabs','criteria':'Voci professionali con lingua giapponese verificata, accessibili nell’account','voices':candidates},ensure_ascii=False,indent=2)+'\n')
 print(f'Voci professionali giapponesi verificate trovate: {len(candidates)}')
 for v in candidates:print(v['name'],v['voice_id'],v['gender'] or '',v['preview_url'] or '')
 if args.list_voices:return
 if len(candidates)<2:raise RuntimeError('Servono almeno due voci professionali giapponesi accessibili nell’account. Aggiungile dalla Voice Library di ElevenLabs, poi riesegui --list-voices. Nessun audio è stato richiesto.')
 by_id={v['voice_id']:v for v in candidates}
 staff=by_id.get(args.voice_staff) if args.voice_staff else next((v for v in candidates if v['gender']=='female'),candidates[0])
 learner=by_id.get(args.voice_learner) if args.voice_learner else next((v for v in candidates if v['voice_id']!=staff['voice_id'] and v['gender']=='male'),next(v for v in candidates if v['voice_id']!=staff['voice_id']))
 if not staff or not learner or staff['voice_id']==learner['voice_id']:raise RuntimeError('Seleziona due ID distinti fra le voci giapponesi professionali verificate.')
 available=json.loads(api('/v1/models'))
 if not any(m.get('model_id')=='eleven_v3' and m.get('can_do_text_to_speech') for m in available):raise RuntimeError('Eleven v3 con tag espressivi non è disponibile per questo account. Nessun audio richiesto.')
 scenes=json.loads((ROOT/'risorse/dialoghi/scenette.json').read_text())
 selected=[s for s in scenes if args.scene=='all' or s['id']==args.scene]
 if not selected:raise RuntimeError('Scenetta sconosciuta.')
 total=sum(len(l['tag']+' '+l['text']) for s in selected for l in s['lines'])
 if not 1<=args.max_characters<=4000 or total>args.max_characters:raise RuntimeError(f'Limite di generazione: servono {total} caratteri, limite impostato {args.max_characters}. Nessuna richiesta audio inviata.')
 print(f'Generazione limitata a {len(selected)} scenetta/e, {total} caratteri. Usa il credito ElevenLabs; i file esistenti compatibili non vengono rigenerati.')
 manifest_path=out/'manifest.json';manifest=json.loads(manifest_path.read_text())
 rolemap={'staff':staff,'learner':learner}
 for s in selected:
  folder=out/s['id'];folder.mkdir(exist_ok=True);lines=[];offset=0
  for i,line in enumerate(s['lines']):
   payload={'text':line['tag']+' '+line['text'],'model_id':'eleven_v3','language_code':'ja'}
   voice=rolemap[line['speaker']];digest=hashlib.sha256(json.dumps([payload,voice['voice_id']],ensure_ascii=False).encode()).hexdigest()
   dest=folder/f'{i+1:02}.mp3';meta=dest.with_suffix('.json');pending=dest.with_suffix('.pending')
   existing=json.loads(meta.read_text()) if meta.exists() else {}
   if dest.exists() and existing.get('sha')==digest:pass
   else:
    if dest.exists():raise RuntimeError(f'Esiste già {s["id"]}/{i+1:02}.mp3 con parametri diversi. Conserva la versione attuale o spostala prima di una rigenerazione esplicita.')
    if pending.exists():raise RuntimeError('Esito precedente incerto. Verifica la History ElevenLabs prima di ripetere: nessun retry automatico per evitare doppi addebiti.')
    pending.write_text(json.dumps({'sha':digest,'started':datetime.datetime.now(datetime.timezone.utc).isoformat()}))
    audio=api('/v1/text-to-speech/'+urllib.parse.quote(voice['voice_id'],safe='')+'?output_format=mp3_44100_128',payload)
    dest.write_bytes(audio);seconds=duration(dest)
    if not 0.1<seconds<90:raise RuntimeError('Durata inattesa: controlla il file prima di pubblicare.')
    meta.write_text(json.dumps({'sha':digest,'voice':voice['name'],'model':'eleven_v3','tag':line['tag']},ensure_ascii=False,indent=2));pending.unlink()
   seconds=duration(dest);lines.append({'src':f'./risorse/audio/{s["id"]}/{i+1:02}.mp3','start':round(offset,3),'duration':round(seconds,3),'speaker':line['speaker'],'voice':voice['name']});offset+=seconds
  listing=folder/'concat.txt';listing.write_text(''.join(f"file '{i+1:02}.mp3'\n" for i in range(len(lines))))
  subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(listing),'-c','copy',str(folder/'dialogue.mp3')],check=True);listing.unlink()
  manifest['scenes'][s['id']]={'src':f'./risorse/audio/{s["id"]}/dialogue.mp3','provider':'ElevenLabs','model':'eleven_v3','synthetic':True,'voices':{role:rolemap[role]['name'] for role in rolemap},'lines':lines,'duration':round(duration(folder/'dialogue.mp3'),3)}
  manifest['generated']=True;manifest['updated']=datetime.datetime.now(datetime.timezone.utc).isoformat();manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
  print('Scenetta completata:',s['id'])
 print('Audio sintetici originali generati. Ascolta il risultato prima di pubblicarlo; non sono registrazioni ufficiali JLPT.')
if __name__=='__main__':
 try:main()
 except (RuntimeError,subprocess.CalledProcessError,urllib.error.URLError,json.JSONDecodeError) as e:
  print('Generazione interrotta:',str(e) if isinstance(e,RuntimeError) else type(e).__name__,file=sys.stderr);sys.exit(1)
