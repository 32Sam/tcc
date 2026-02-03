import sqlite3
import unicodedata
import os

# Caminho absoluto para o diretório onde está este arquivo
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Caminho absoluto do banco
DB_PATH = os.path.join(BASE_DIR, "database.db")


def get_connection():
    return sqlite3.connect(DB_PATH)


def normalize_genre(genre: str) -> str:
    """
    Normaliza o gênero:
    - remove espaços extras
    - converte para minúsculas
    - remove acentos
    """
    genre = genre.strip().lower()
    genre = unicodedata.normalize("NFKD", genre)
    genre = "".join(c for c in genre if not unicodedata.combining(c))
    return genre


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS search_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            term TEXT,
            genres TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS anime_clicks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            anime_id INTEGER,
            anime_title TEXT,
            clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS genre_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            genre TEXT UNIQUE,
            count INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()


def register_genres(genres):
    conn = get_connection()
    cursor = conn.cursor()

    for genre in genres:
        genre_normalizado = normalize_genre(genre)

        cursor.execute("""
            INSERT INTO genre_usage (genre, count)
            VALUES (?, 1)
            ON CONFLICT(genre)
            DO UPDATE SET count = count + 1
        """, (genre_normalizado,))

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_tables()
    print("Banco de dados e tabelas criados com sucesso!")



