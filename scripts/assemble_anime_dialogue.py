"""Assemble audio-driven shots without stretching speech or animation.

Usage: python3 scripts/assemble_anime_dialogue.py SOURCE_DIRECTORY
SOURCE_DIRECTORY must contain 01.mp4 .. 04.mp4 (provider originals).
The audio manifest is the timeline authority; only terminal frames may be held.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1]).resolve()
audio = json.loads((root / 'risorse/audio/manifest.json').read_text())['scenes']['sushi']
out = root / 'risorse/anime'


def run(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)


with tempfile.TemporaryDirectory() as task_dir:
    task = Path(task_dir)
    entries = ['ffconcat version 1.0']
    for index, line in enumerate(audio['lines']):
        voice = root / line['src']
        assert hashlib.sha256(voice.read_bytes()).hexdigest() == line['sha256'], voice
        start = line['start']
        end = audio['lines'][index + 1]['start'] if index + 1 < len(audio['lines']) else audio['duration']
        duration = end - start
        clip = task / f'{index + 1:02}.mp4'
        # Keep original speech timing. Padding only holds the last video frame.
        run('-i', source / clip.name, '-an', '-vf',
            'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=10',
            '-t', duration, '-c:v', 'libx264', '-crf', '21', '-pix_fmt', 'yuv420p', clip)
        entries += [f"file '{clip.name}'", f'duration {duration:.6f}']
    playlist = task / 'shots.ffconcat'
    playlist.write_text('\n'.join(entries) + '\n')
    silent = out / 'sushi-dialogue-motion-v2.mp4'
    run('-f', 'concat', '-safe', '0', '-i', playlist, '-an', '-vf', 'fps=30',
        '-t', audio['duration'], '-c:v', 'libx264', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent)
    run('-i', silent, '-i', root / audio['src'], '-map', '0:v:0', '-map', '1:a:0',
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-t', audio['duration'],
        '-movflags', '+faststart', out / 'sushi-dialogue-v2.mp4')
print('Assembled four shots on the original audio timeline; no time stretching.')
