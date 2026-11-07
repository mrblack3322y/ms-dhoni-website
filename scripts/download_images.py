import os
import urllib.request
import json
import time

BASE_DIR = r"C:\Users\bmr61\.gemini\antigravity\scratch\mahi-legacy\public\assets\images"
os.makedirs(BASE_DIR, exist_ok=True)

IMAGE_MAPPING = {
    # Career Milestones (The Journey)
    "journey_2004_debut.jpg": "File:Dhoni at Reebok event.jpg",
    "journey_2007_t20_wc.jpg": "File:The Prime Minister, Dr. Manmohan Singh with the Captain of Twenty-Twenty Cricket Team, Shri M.S. Dhoni in New Delhi on October 30, 2007.jpg",
    "journey_2011_wc.jpg": "File:The President, Smt. Pratibha Devisingh Patil greeting the Indian Cricket Team Captain M.S. Dhoni, at Maharashtra Raj Bhavan, in Mumbai on April 03, 2011.jpg",
    "journey_2014_test.jpg": "File:MS Dhoni bowling.jpg",
    "journey_2018_padma.jpg": "File:The President, Shri Ram Nath Kovind presenting the Padma Bhushan Award to Shri M.S. Dhoni, at the Civil Investiture Ceremony-II, at Rashtrapati Bhavan, in New Delhi on April 02, 2018.jpg",
    
    # The Iconic Moment 2011 & Stadiums
    "wankhede_2011_final.jpg": "File:Wankhede ICC WCF.jpg",
    "wankhede_crowd.jpg": "File:Wankhede stadium world cup 2011.jpg",
    "wankhede_night.jpg": "File:Wankhede Stadium (86312941).jpeg",
    
    # Chennai Super Kings (Yellow Legacy)
    "csk_chepauk_night.jpg": "File:MA Chidambaram Stadium In the Night during a CSK Game.jpg",
    "csk_team_field.jpg": "File:Chennai Super Kings.jpg",
    "csk_dhoni_portrait.jpg": "File:MS Dhoni (Prabhav '23 - RiGI 2023).jpg",
    
    # Memorabilia & Trophies
    "dhoni_bat_kit.jpg": "File:Wicketkeeping kit and bat of MS Dhoni at Blades of Glory Cricket Museum, Pune.jpg",
    "cwc_trophy.jpg": "File:Cricket World Cup Trophy.jpg",
    "icc_trophy_case.jpg": "File:ICC world cup (16084305077).jpg",
    "dhoni_padma_portrait.jpg": "File:Mahendra Singh Dhoni receiving Padma Bhushan.jpg",
}

HEADERS = {
    'User-Agent': 'MahiLegacyDocumentary/1.0 (contact@example.org)',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://commons.wikimedia.org/'
}

def get_wikimedia_thumb(file_title, width=1280):
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&iiurlwidth={width}"
    req = urllib.request.Request(api_url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                info = pdata.get('imageinfo', [])
                if info:
                    thumb = info[0].get('thumburl')
                    original = info[0].get('url')
                    return thumb or original
    except Exception as e:
        print(f"Error fetching thumbnail for {file_title}: {e}")
    return None

def download_remaining():
    for target_name, wiki_file in IMAGE_MAPPING.items():
        out_path = os.path.join(BASE_DIR, target_name)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"[OK] Already exists: {target_name} ({os.path.getsize(out_path)} bytes)")
            continue
            
        print(f"Fetching thumb: {wiki_file} -> {target_name}")
        url = get_wikimedia_thumb(wiki_file, width=1280)
        if not url:
            print(f"[WARN] No URL for {wiki_file}")
            continue
            
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = resp.read()
                with open(out_path, 'wb') as f:
                    f.write(data)
                print(f"[SUCCESS] Downloaded {target_name} ({len(data)} bytes)")
        except Exception as e:
            print(f"[ERROR] Failed {target_name}: {e}")
        time.sleep(1.2)

if __name__ == '__main__':
    download_remaining()
