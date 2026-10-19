import os
import sys
import json
import glob
import re

BASE_DIR = r"C:\Users\Wildan M Sofwan\.gemini\antigravity\scratch\TheEliteFiles"
PS_DIR = os.path.join(BASE_DIR, "ProdigalSon_Fixed")
TARGET_DATA_DIR = r"D:\Gawe\SiNovel\src\data"

def clean_title(title_raw, filename):
    t = title_raw.strip()
    # Strip markdown headers like # or ## or ###
    t = re.sub(r'^[#\s*]+', '', t).strip()
    t = re.sub(r'[*#]+$', '', t).strip()
    # Replace weird unicode em-dash or quotes if needed
    t = t.replace('\u2014', '—').replace('\u2013', '–')
    return t

def extract_title_and_body(filepath, fallback_num):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read().strip()
    
    # Normalize CRLF
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    lines = text.split('\n')
    
    title = ''
    body_start_idx = 0
    
    # Skip leading empty lines
    while body_start_idx < len(lines) and not lines[body_start_idx].strip():
        body_start_idx += 1
        
    for i in range(body_start_idx, min(body_start_idx + 6, len(lines))):
        line = lines[i].strip()
        if not line:
            continue
        # Skip "# BOOK 5: ..." line
        if re.match(r'^#*\s*BOOK\s+\d+', line, re.I):
            body_start_idx = i + 1
            continue
        # Detect chapter title line
        if re.match(r'^#*\s*(?:BAB|Bab|PROLOG|Prolog|EPILOG|Epilog)\b', line, re.I):
            title = clean_title(line, os.path.basename(filepath))
            body_start_idx = i + 1
            break
            
    if not title and body_start_idx < len(lines):
        first = lines[body_start_idx].strip()
        if first.startswith('#'):
            title = clean_title(first, os.path.basename(filepath))
            body_start_idx += 1
            
    if not title:
        fname = os.path.basename(filepath)
        title = fname.replace('.txt', '').replace('.md', '').replace('_', ' ')
        
    # Clean body
    body_lines = lines[body_start_idx:]
    # Strip leading empty lines in body
    while body_lines and not body_lines[0].strip():
        body_lines.pop(0)
        
    body = '\n\n'.join([p.strip() for p in '\n'.join(body_lines).split('\n\n') if p.strip()])
    return title, body

def get_sorted_files(folder, pattern, custom_filter=None):
    files = glob.glob(os.path.join(folder, pattern))
    if custom_filter:
        files = [f for f in files if custom_filter(os.path.basename(f))]
        
    def key_fn(filepath):
        name = os.path.basename(filepath).lower()
        if 'prolog' in name:
            return (-1, 0, '')
        if 'epilog' in name:
            return (9999, 0, '')
        
        # e.g. Bab_05b_Transisi_Pelarian.txt -> (5, 0.5, 'b')
        m_b = re.search(r'(?:bab_?|book_\d+_bab_)(\d+)([a-zA-Z])\b', name)
        if m_b:
            main_n = int(m_b.group(1))
            char_code = ord(m_b.group(2).lower()) - ord('a') + 1
            return (main_n, float(f"0.{char_code}"), m_b.group(2))
            
        # e.g. Bab_02_5.txt -> (2, 5, '')
        m_dot = re.search(r'(?:bab_?|book_\d+_bab_)(\d+)_(\d+)', name)
        if m_dot:
            return (int(m_dot.group(1)), float(f"0.{m_dot.group(2)}"), '')
            
        # Standard Bab_01.txt or Book_12_Bab_10.md
        m = re.search(r'(?:bab_?|book_\d+_bab_)(\d+)', name)
        if m:
            return (int(m.group(1)), 0.0, '')
            
        return (5000, 0.0, name)
        
    return sorted(files, key=key_fn)

def build_book(config):
    novel_id = config['id']
    title = config['title']
    author = "PamanKen"
    synopsis = config['synopsis']
    cover = config['cover']
    genre = config['genre']
    genres = config['genres']
    age_rating = "21+"
    content_warnings = config['contentWarnings']
    tags = config['tags']
    rating = config['rating']
    reviews_count = config['reviewsCount']
    published_year = config.get('publishedYear', 2024)
    featured = config.get('featured', False)
    
    sorted_files = get_sorted_files(config['folder'], config['pattern'], config.get('custom_filter'))
    print(f"Building {novel_id} from {len(sorted_files)} files...")
    
    chapters = []
    total_words = 0
    
    for idx, fpath in enumerate(sorted_files):
        ch_title, ch_body = extract_title_and_body(fpath, idx + 1)
        
        # Word count calculation (rough whitespace split)
        words = len(ch_body.split())
        total_words += words
        read_time = max(1, round(words / 200))
        
        # Check if prolog
        is_prolog = 'prolog' in os.path.basename(fpath).lower()
        ch_num = 0 if is_prolog else (idx if ('prolog' in os.path.basename(sorted_files[0]).lower()) else idx + 1)
        
        # chapter id
        ch_id = f"{novel_id}-ch-{idx + 1}"
        
        chapters.append({
            "id": ch_id,
            "chapterNumber": ch_num,
            "title": ch_title,
            "readTimeMinutes": read_time,
            "content": ch_body
        })
        
    novel_obj = {
        "id": novel_id,
        "title": title,
        "author": author,
        "synopsis": synopsis,
        "cover": cover,
        "genre": genre,
        "genres": genres,
        "ageRating": age_rating,
        "contentWarnings": content_warnings,
        "tags": tags,
        "rating": rating,
        "reviewsCount": reviews_count,
        "totalWords": total_words,
        "publishedYear": published_year,
        "featured": featured,
        "chapters": chapters
    }
    
    # Write JSON
    json_path = os.path.join(TARGET_DATA_DIR, f"{config['ts_name']}.json")
    with open(json_path, 'w', encoding='utf-8') as jf:
        json.dump(novel_obj, jf, ensure_ascii=False, indent=2)
    print(f"  -> Saved JSON: {json_path} ({total_words} words, {len(chapters)} chapters)")
    
    # Write TS wrapper
    ts_path = os.path.join(TARGET_DATA_DIR, f"{config['ts_name']}.ts")
    ts_content = f"""import type {{ Novel }} from '../types';
import bookData from './{config['ts_name']}.json';

export const {config['export_var']} = bookData as unknown as Novel;
"""
    with open(ts_path, 'w', encoding='utf-8') as tf:
        tf.write(ts_content)
    print(f"  -> Saved TS: {ts_path}")

BOOK_CONFIGS = [
    # THE ELITE FILES BOOK 3
    {
        "id": "the-elite-files-book-3",
        "ts_name": "theEliteFilesBook3",
        "export_var": "THE_ELITE_FILES_BOOK_3",
        "title": "The Elite Files (Book 3): The Return",
        "synopsis": "Bersembunyi sebagai kuli panggul di pelabuhan Tanjung Perak Surabaya, Dimas Wicaksono dihantui dendam kesumat atas kematian Rein Anastasia di tangan Arista. Namun ketika Viktor Rockefeller mengaktifkan Protokol Purgatori dan perburuan maut meledak di Rungkut, Dimas dan Rai terpaksa bersatu kembali. Penemuan partisi rahasia menyingkap konspirasi satelit Deep-Eye dan fakta mengejutkan tentang garis darah keluarga Rothschild, hingga penyerbuan nekat ke kapal perang The Titan demi membongkar rahasia terdalam The Elite.",
        "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
        "genre": "Thriller",
        "genres": ["Thriller", "Action", "Mystery", "Spy & Agent", "Crime", "Psychological"],
        "contentWarnings": [
            "Kekerasan & Aksi Bersenjata",
            "Konspirasi Global & Pembunuhan Terencana",
            "Penyiksaan & Trauma Psikologis",
            "Intrik Agen Rahasia & Peretasan Tingkat Tinggi",
            "Sensualitas & Romansa Dewasa"
        ],
        "tags": ["The Elite Files", "PamanKen", "The Return", "Spy Thriller", "Aksi Spionase", "Hacker", "Konspirasi"],
        "rating": 4.96,
        "reviewsCount": 2480,
        "folder": os.path.join(BASE_DIR, "Book_3_The_Return"),
        "pattern": "*.txt",
        "custom_filter": None
    },
    # THE ELITE FILES BOOK 4
    {
        "id": "the-elite-files-book-4",
        "ts_name": "theEliteFilesBook4",
        "export_var": "THE_ELITE_FILES_BOOK_4",
        "title": "The Elite Files (Book 4): The Fighter",
        "synopsis": "Terdesak di pesisir Jawa Timur, Rai Prasetyo bertransformasi dari seorang peretas cerdas menjadi petarung jalanan tanpa ampun melalui tempaan brutal di bengkel Surabaya dan dermaga Gresik. Dari penggerebekan berdarah di gudang Eastern Energy, pertempuran mematikan di bunker Perak, hingga eksekusi para oligarki di Madura, Pasuruan, dan gala dinner Yogyakarta, Rai meniti jalan pembalasan yang gelap. Menghadapi racun kimia mematikan di Klaten, ia harus memilih antara mempertahankan nurani manusianya atau menjadi monster pembantai yang ditakuti musuh.",
        "cover": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
        "genre": "Action",
        "genres": ["Action", "Thriller", "Crime", "Psychological", "Mystery"],
        "contentWarnings": [
            "Pertarungan Brutal & Senjata Tajam",
            "Eksekusi Mati Oligarki & Balas Dendam",
            "Senjata Kimia & Racun Mematikan",
            "Romansa Gelap & Sensualitas Dewasa"
        ],
        "tags": ["The Elite Files", "PamanKen", "The Fighter", "Aksi Brutal", "Street Fighting", "Konspirasi", "Thriller"],
        "rating": 4.97,
        "reviewsCount": 2720,
        "folder": os.path.join(BASE_DIR, "Book_4_The_Fighter"),
        "pattern": "*.txt",
        "custom_filter": None
    },
    # THE ELITE FILES BOOK 5
    {
        "id": "the-elite-files-book-5",
        "ts_name": "theEliteFilesBook5",
        "export_var": "THE_ELITE_FILES_BOOK_5",
        "title": "The Elite Files (Book 5): The Executioner",
        "synopsis": "Jaringan The Elite membalas dengan dendam membabi buta saat tim tiba di Jakarta. Dimulai dari infiltrasi kapal pesiar mewah pejabat tinggi hingga pertempuran sengit dalam gelapnya EMP di penthouse ibu kota, Rai bertindak sebagai sang algojo murni. Namun ujian terberat bukan berasal dari peluru musuh, melainkan terbongkarnya pengkhianatan terkelam di dalam tim sendiri: kebenaran berdarah di balik tragedi kecelakaan Tol Cipularang yang meretakkan persahabatan mereka selamanya.",
        "cover": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
        "genre": "Thriller",
        "genres": ["Thriller", "Action", "Crime", "Spy & Agent", "Psychological"],
        "contentWarnings": [
            "Kekerasan & Aksi Bersenjata",
            "Pengkhianatan Sahabat & Keretakan Tim",
            "Serangan Siber & Pemadaman EMP",
            "Sensualitas Dewasa & Ketegangan Moral"
        ],
        "tags": ["The Elite Files", "PamanKen", "The Executioner", "Pengkhianatan", "Algojo", "Jakarta Noir", "Konspirasi"],
        "rating": 4.95,
        "reviewsCount": 2310,
        "folder": os.path.join(BASE_DIR, "Book_5_The_Executioner"),
        "pattern": "*.txt",
        "custom_filter": lambda f: not f.endswith('_original.txt')
    },
    # THE ELITE FILES BOOK 6
    {
        "id": "the-elite-files-book-6",
        "ts_name": "theEliteFilesBook6",
        "export_var": "THE_ELITE_FILES_BOOK_6",
        "title": "The Elite Files (Book 6): The Endgame",
        "synopsis": "Klimaks pamungkas Saga I: The Elite Files. Seluruh identitas tim dihapus dari basis data dunia lewat Damnatio Memoriae. Berlindung di labirin kumuh Tanah Merah bersama makelar bayangan Maulidya, Rai dan Arista menghadapi cobaan tergelap saat Arista diculik oleh The Falcon dan disekap di benteng Pulau Macan di bawah kendali Wilhelm. Dalam malam badai penuh api, gas beracun, dan pengorbanan terakhir seorang sahabat, perang total pecah demi merebut kembali jiwa dan kebebasan yang telah terenggut.",
        "cover": "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
        "genre": "Thriller",
        "genres": ["Thriller", "Action", "Drama", "Romance", "Psychological", "Crime"],
        "contentWarnings": [
            "Pertempuran Skala Penuh & Ledakan Termit",
            "Penculikan, Gas Beracun & Siksaan Mental",
            "Pengorbanan Gugurnya Rekan Seperjuangan",
            "Penyatuan Emosional Terakhir Sebelum Perang (21+)"
        ],
        "tags": ["The Elite Files", "PamanKen", "The Endgame", "Pertempuran Terakhir", "Pulau Macan", "Klimaks Saga 1"],
        "rating": 4.99,
        "reviewsCount": 3890,
        "featured": True,
        "folder": os.path.join(BASE_DIR, "Book_6_The_Endgame"),
        "pattern": "*.txt",
        "custom_filter": None
    },
    # PRODIGAL SON BOOK 1
    {
        "id": "prodigal-son-book-1",
        "ts_name": "prodigalSonBook1",
        "export_var": "PRODIGAL_SON_BOOK_1",
        "title": "Prodigal Son (Book 1): The Varsity Arena",
        "synopsis": "Tujuh belas tahun setelah peristiwa berdarah The Elite Files, Arka Alditama hidup dalam penyamaran sederhana di Ciparay bersama ibunya, Kirana, menyembunyikan kejeniusan analitis dan fisik luar biasanya di balik pekerjaan serabutan mengepel lantai minimarket. Masuknya Arka ke tim bola voli SMAN 1 Ciparay sebagai middle blocker membuka babak baru penuh ketegangan. Dengan kemampuan kalkulasi gerak layaknya superkomputer biologis, Arka membawa timnya melesat menuju Final Kejurda Jawa Barat—sembari menahan ancaman bayangan masa lalu yang mulai mengintai dari balik kabut.",
        "cover": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop",
        "genre": "Drama",
        "genres": ["Drama", "Action", "Romance", "Psychological", "Slice of Life"],
        "contentWarnings": [
            "Kompetisi Olahraga Keras & Cedera Fisik",
            "Trauma Masa Lalu & Penyamaran Identitas",
            "Romansa Dewasa & Sensualitas Eksplisit",
            "Konspirasi Sindikat & Sabotase Klandestin"
        ],
        "tags": ["Prodigal Son", "PamanKen", "The Varsity Arena", "Voli", "Arka Alditama", "Saga 2", "Coming of Age"],
        "rating": 4.98,
        "reviewsCount": 3120,
        "folder": os.path.join(PS_DIR, "Book_7_The_Varsity_Arena"),
        "pattern": "*.txt",
        "custom_filter": None
    },
    # PRODIGAL SON BOOK 2
    {
        "id": "prodigal-son-book-2",
        "ts_name": "prodigalSonBook2",
        "export_var": "PRODIGAL_SON_BOOK_2",
        "title": "Prodigal Son (Book 2): The Varsity Crossfire",
        "synopsis": "Kemenangan di Kejurda menyisakan luka kelam saat pemerasan keji dr. Heru Gunawan mengancam membongkar identitas rahasia Kirana. Di tengah krisis keluarga yang menghancurkan, Arka menemukan suaka emosional pada sosok Risa ('Anin'), gadis pemberani yang melihat Arka sebagai manusia seutuhnya. Dari intrik sabotase steroid di sekolah, pertarungan mempertahankan kehormatan keluarga, hingga babak baru di bawah perlindungan klandestin Tante Maulidya, ikatan batin antara Arka dan Risa mekar di tengah badai yang kian pekat.",
        "cover": "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop",
        "genre": "Romance",
        "genres": ["Romance", "Drama", "Psychological", "Action", "Crime"],
        "contentWarnings": [
            "Trauma Pemerasan & Konflik Keluarga Gelap",
            "Sabotase Sekolah & Fitnah Obat Terlarang",
            "Sensualitas & Romansa Intim Slow-burn (21+)",
            "Proteksi Makelar Bawah Tanah"
        ],
        "tags": ["Prodigal Son", "PamanKen", "The Varsity Crossfire", "Romansa", "Arka dan Risa", "Ciparay", "Saga 2"],
        "rating": 4.97,
        "reviewsCount": 2950,
        "folder": os.path.join(PS_DIR, "Book_8_The_Varsity_Crossfire"),
        "pattern": "*.txt",
        "custom_filter": lambda f: f.startswith('Bab_')
    },
    # PRODIGAL SON BOOK 3
    {
        "id": "prodigal-son-book-3",
        "ts_name": "prodigalSonBook3",
        "export_var": "PRODIGAL_SON_BOOK_3",
        "title": "Prodigal Son (Book 3): The National Ascent",
        "synopsis": "Panggung megah Kejurnas Istora Senayan menjadi arena pembuktian terakhir Arka Alditama sebagai atlet voli terbaik nasional. Namun siaran televisi nasional yang menayangkan wajahnya memicu radar pencarian Sarah Chen (Helena) di Singapura. Memasuki fase perkuliahan di Universitas Padjadjaran bersama Ducati Panigale V4 dan dinamika romansa posesif dengan Risa di Fakultas Kedokteran, Arka terjerat skandal match-fixing sindikat Phoenix Global hingga kemunculan sekilas sosok Arista von Rothschild yang meruntuhkan arogansi dunianya—mendorong Arka mendaftar Akpol SIPSS Semarang demi melindungi mereka yang dicintainya.",
        "cover": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
        "genre": "Drama",
        "genres": ["Drama", "Romance", "Action", "Mystery", "Thriller"],
        "contentWarnings": [
            "Kejurnas Voli Nasional & Tekanan Publik",
            "Malam Kemenangan & Keintiman Penuh Emosi (21+)",
            "Skandal Perjudian & Intrik Konglomerasi",
            "Kemunculan Kembali Agen Maut Legendaris"
        ],
        "tags": ["Prodigal Son", "PamanKen", "The National Ascent", "Kejurnas", "Unpad", "Akpol", "Saga 2 Final"],
        "rating": 4.99,
        "reviewsCount": 3540,
        "featured": True,
        "folder": os.path.join(PS_DIR, "Book_9_The_national_ascent"),
        "pattern": "*.txt",
        "custom_filter": lambda f: f.startswith('Bab_')
    },
    # PRODIGAL SON BOOK 4
    {
        "id": "prodigal-son-book-4",
        "ts_name": "prodigalSonBook4",
        "export_var": "PRODIGAL_SON_BOOK_4",
        "title": "Prodigal Son (Book 4): The Silent Hand",
        "synopsis": "Memasuki Saga III: The Tactical Eclipse. Di laboratorium rahasia Laut Utara, program cuci otak Tabula Rasa menghapus nurani Rai Prasetyo dan Arista menjadi instrumen pembunuh tanpa ampun milik Phoenix Global. Sementara itu, Ipda Arka Alditama yang baru lulus dari Akpol SIPSS mulai menelusuri jaringan kejahatan transnasional di Ditreskrimsus Polda. Pertemuan tak terelakkan di pelabuhan Tanjung Priok memicu gelombang resonansi genetik antara ayah dan anak, sementara Arista diam-diam menyembunyikan hasil tes DNA demi mencegah pembantaian darah daging sendiri.",
        "cover": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
        "genre": "Thriller",
        "genres": ["Thriller", "Action", "Crime", "Spy & Agent", "Psychological"],
        "contentWarnings": [
            "Pencucian Otak Kimiawi Tabula Rasa",
            "Operasi Taktis Kepolisian & Penggerebekan",
            "Resonansi Genetik Ayah-Anak di Garis Maut",
            "Romansa Posesif Bandung & Ancaman Klandestin"
        ],
        "tags": ["Prodigal Son", "PamanKen", "The Silent Hand", "Saga 3", "Tabula Rasa", "Polri", "Resonansi Genetik"],
        "rating": 4.96,
        "reviewsCount": 2680,
        "folder": os.path.join(PS_DIR, "Book_10_The_Silent_Hand"),
        "pattern": "Bab_*.txt",
        "custom_filter": None
    },
    # PRODIGAL SON BOOK 5
    {
        "id": "prodigal-son-book-5",
        "ts_name": "prodigalSonBook5",
        "export_var": "PRODIGAL_SON_BOOK_5",
        "title": "Prodigal Son (Book 5): The Eclipse",
        "synopsis": "Sindikat Phoenix melancarkan operasi bumi hangus di Ciparay, membantai regu pengaman klandestin dan merenggut nyawa orang-orang terkasih. Kehancuran ini memaksa Kirana mengaktifkan Dead Man's Switch dan bertransformasi menjadi makelar bayangan The New Black Widow. Kini memimpin Unit Taktis AEGIS Polri, Kapten Arka Alditama ditugaskan memburu The Ghost Assassin nomor satu negara—tanpa menyadari bahwa sosok predator berdarah dingin bertopeng yang ia buru adalah ayah kandungnya sendiri, Rai Prasetyo.",
        "cover": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
        "genre": "Action",
        "genres": ["Action", "Thriller", "Crime", "Military", "Psychological", "Drama"],
        "contentWarnings": [
            "Pembantaian Massal & Bumi Hangus Ciparay",
            "Duel Jarak Dekat CQC Predator Analytics",
            "Transformasi Menjadi Ghost Broker",
            "Konfrontasi Identitas Paling Mencekam"
        ],
        "tags": ["Prodigal Son", "PamanKen", "The Eclipse", "Unit AEGIS", "Perang Ayah Anak", "Ghost Assassin", "Saga 3"],
        "rating": 4.98,
        "reviewsCount": 3310,
        "folder": os.path.join(PS_DIR, "Book_11_The_Eclipse"),
        "pattern": "Bab_*.md",
        "custom_filter": None
    },
    # PRODIGAL SON BOOK 6
    {
        "id": "prodigal-son-book-6",
        "ts_name": "prodigalSonBook6",
        "export_var": "PRODIGAL_SON_BOOK_6",
        "title": "Prodigal Son (Book 6): The Schism",
        "synopsis": "Grand Finale 63 Bab penutup mahakarya The Elite Files dan Prodigal Son. Pasca malam pembantaian dermaga, krisis neurologis Rai Prasetyo menuntut evakuasi medis darurat di tengah blokade kudeta Brigjen Baskoro. Menolak takhta tiran sang nenek (Sarah Chen/Helena) dan menolak menjadi monster pembunuh berdarah dingin seperti ayahnya, Kombes Pol Arka Alditama bersama Unit Khusus AEGIS mempertaruhkan segalanya dalam pertempuran siber dan taktis berskala global untuk memutus kutukan darah dinasti, menyelamatkan kedaulatan bangsa, dan mengukir akhir legendaris bagi mereka yang bertahan.",
        "cover": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        "genre": "Thriller",
        "genres": ["Thriller", "Action", "Crime", "Military", "Cyberpunk", "Drama"],
        "contentWarnings": [
            "Krisis Neurologis & Prosedur Medis Bawah Tanah",
            "Kudeta Militer & Perang Siber Skala Global",
            "Pemutusan Kutukan Darah Dinasti Phoenix",
            "Epilog Agung Kenaikan Pangkat Luar Biasa (KPLB)"
        ],
        "tags": ["Prodigal Son", "PamanKen", "The Schism", "Grand Finale", "Unit AEGIS", "Kombes Arka", "Penutup Saga"],
        "rating": 4.99,
        "reviewsCount": 4250,
        "featured": True,
        "folder": BASE_DIR,
        "pattern": "Book_12_Bab_*.md",
        "custom_filter": None
    }
]

if __name__ == '__main__':
    print("Starting generation of all 10 books...")
    for cfg in BOOK_CONFIGS:
        build_book(cfg)
    print("All books built successfully!")
